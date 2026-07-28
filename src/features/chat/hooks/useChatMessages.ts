import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../confg/firebase';
import { setMessages } from '../chatSlice';
import { type Message } from '../chat.types';
import { markConversationAsRead } from '../services/chatService';

export const useChatMessages = (activeChatId: string | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!activeChatId) return;

        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        const messagesSubCollectionRef = collection(db, 'chats', activeChatId, 'messages');
        const q = query(messagesSubCollectionRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                let hasUnreadFromOtherUser = false;

                const messagesData: Message[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();

                    if (data.senderId !== currentUserId && !data.isSeen) {
                        hasUnreadFromOtherUser = true;
                    }

                    return {
                        id: docSnap.id,
                        text: data.text || '',
                        isSeen: Boolean(data.isSeen),
                        senderId: data.senderId || '',
                        timestamp: data.timestamp?.toMillis() ?? null,
                    };
                });

                dispatch(setMessages(messagesData));

                // If user is actively viewing this chat room and unread messages from contact exist, mark conversation as read
                if (hasUnreadFromOtherUser) {
                    markConversationAsRead(activeChatId, currentUserId);
                }
            },
            (error) => {
                console.error("Firestore real-time stream error:", error);
            }
        );

        return () => {
            unsubscribe();
        };

    }, [activeChatId, dispatch]);
};
