import { useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../confg/firebase';
import { setContacts } from '../usersSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { ContactProfile, LastMessage } from '../UserList.types';
import { generateChatId } from '../../chat/services/chatService';

export const useUsersList = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!currentUser) return;

        const usersCollectionRef = collection(db, 'users');
        let contacts: ContactProfile[] = [];
        const lastMessageMap = new Map<string, LastMessage>();
        const unreadCountMap = new Map<string, number>();
        const chatUnsubscribes: (() => void)[] = [];

        const rebuildAndDispatch = () => {
            const enrichedContacts = contacts.map(contact => ({
                ...contact,
                lastMessage: lastMessageMap.get(contact.uid),
                unreadCount: unreadCountMap.get(contact.uid),
            }));
            dispatch(setContacts(enrichedContacts));
        };

        const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
            // Clean up previous chat doc listeners before setting up new ones
            chatUnsubscribes.forEach(unsub => unsub());
            chatUnsubscribes.length = 0;
            lastMessageMap.clear();
            unreadCountMap.clear();

            contacts = [];
            snapshot.forEach((userDoc) => {
                if (userDoc.id !== currentUser.uid) {
                    contacts.push(userDoc.data() as ContactProfile);
                }
            });

            // For each contact, listen to their chat doc for real-time lastMessage updates
            contacts.forEach(contact => {
                const chatId = generateChatId(currentUser.uid, contact.uid);
                const chatDocRef = doc(db, 'chats', chatId);

                const unsubChat = onSnapshot(chatDocRef, (chatSnapshot) => {
                    if (chatSnapshot.exists()) {
                        const chatData = chatSnapshot.data();
                        if (chatData.lastMessage) {
                            lastMessageMap.set(contact.uid, {
                                text: chatData.lastMessage.text,
                                timestamp: chatData.lastMessage.timestamp?.toMillis?.() ?? Date.now(),
                                isSeen: chatData.lastMessage.isSeen,
                                senderId: chatData.lastMessage.senderId,
                            });
                        }
                        if (chatData.unreadCount) {
                            unreadCountMap.set(contact.uid, chatData.unreadCount[currentUser.uid]);
                        }
                    }
                    rebuildAndDispatch();
                });

                chatUnsubscribes.push(unsubChat);
            });

            // Dispatch immediately with whatever we have (chat listeners will update as they fire)
            rebuildAndDispatch();
        });

        return () => {
            unsubscribeUsers();
            chatUnsubscribes.forEach(unsub => unsub());
        };
    }, [dispatch, currentUser]);
};