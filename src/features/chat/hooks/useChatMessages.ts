import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../confg/firebase';
import { setMessages } from '../chatSlice';
import { type Message } from '../chat.types';

export const useChatMessages = (activeChatId: string | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!activeChatId) return;

        console.log(`Opening live stream for chat room: ${activeChatId}`);

        const messagesSubCollectionRef = collection(db, 'chats', activeChatId, 'messages');

        const q = query(messagesSubCollectionRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                console.log('Live Chat Messges: ', snapshot)
                const messagesData: Message[] = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    // Map Firestore document data cleanly to our TypeScript Message interface
                    return {
                        id: doc.id,
                        text: data.text || '',
                        senderId: data.senderId || '',
                        timestamp: data.timestamp?.toMillis() ?? null, // ✅ plain number — Redux serializable
                    };
                });

                console.log(`messagesData: `, messagesData)
                // 5. Dispatch the strongly-typed array to your Redux slice
                dispatch(setMessages(messagesData));
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