import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../confg/firebase';
import { setMessages } from '../chatSlice';
import { type Message } from '../chat.types';

export const useChatMessages = (activeChatId: string | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 1. Guard Clause: If the user hasn't clicked a contact yet, do nothing
        if (!activeChatId) return;

        console.log(`Opening live stream for chat room: ${activeChatId}`);

        // 2. Point directly to the nested sub-collection path:
        // path: chats / {activeChatId} / messages
        const messagesSubCollectionRef = collection(db, 'chats', activeChatId, 'messages');

        // 3. Create a query to sort the messages chronologically by their Firestore timestamp
        const q = query(messagesSubCollectionRef, orderBy('timestamp', 'asc'));

        // 4. Set up the real-time listener
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
                        timestamp: data.timestamp, // Keeps the Firestore timestamp object
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

        // 6. The Cleanup Function
        // When the user switches to a different chat, or closes the window, 
        // React unmounts or re-runs this useEffect. Returning 'unsubscribe' 
        // tells Firebase to instantly stop listening, preventing memory leaks and billing costs.
        return () => {
            console.log(`Closing live stream for chat room: ${activeChatId}`);
            unsubscribe();
        };

    }, [activeChatId, dispatch]);
};