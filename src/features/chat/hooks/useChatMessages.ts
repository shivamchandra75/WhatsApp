import { useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../confg/firebase';
import { setMessages } from '../chatSlice';
import { type Message } from '../chat.types';
import { useAppDispatch } from '../../../store/hooks';

export const useChatMessages = (activeChatId: string | null) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!activeChatId) return;

        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        console.log(`Opening live stream for chat room: ${activeChatId}`);

        const messagesSubCollectionRef = collection(db, 'chats', activeChatId, 'messages');
        const q = query(messagesSubCollectionRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                let hasNewMessagesFromOtherUser = false;

                const messagesData: Message[] = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    // Check if there are new unread messages from the other user
                    if (snapshot.docChanges().some(change =>
                        change.type === 'added' &&
                        change.doc.data().senderId !== currentUserId
                    )) {
                        hasNewMessagesFromOtherUser = true;
                    }

                    return {
                        id: doc.id,
                        text: data.text || '',
                        isSeen: data.isSeen,
                        senderId: data.senderId || '',
                        timestamp: data.timestamp?.toMillis() ?? null,
                    };
                });

                dispatch(setMessages(messagesData));

                // If a new message arrived while the user is actively viewing the chat,
                // instantly clear their unread count.
                if (hasNewMessagesFromOtherUser) {
                    const chatDocRef = doc(db, 'chats', activeChatId);
                    updateDoc(chatDocRef, {
                        [`unreadCount.${currentUserId}`]: 0,
                        'lastMessage.isSeen': true
                    }).catch(err => console.error("Failed to clear unread count:", err));
                }
            },
            (error) => {
                console.error("Firestore real-time stream error:", error);
            }
        );

        return () => {
            console.log(`Closing live stream for chat room: ${activeChatId}`);
            unsubscribe();
        };

    }, [activeChatId, dispatch]);
};