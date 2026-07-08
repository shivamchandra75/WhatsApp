import { addDoc, collection, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../confg/firebase";


export const generateChatId = (uid1: string, uid2: string): string => {
    return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

export const startOrJoinChat = async (currentUserUid: string, contactUid: string) => {
    try {
        const chatId = generateChatId(currentUserUid, contactUid);
        const chatDocRef = doc(db, 'chats', chatId);

        const chatSnapshot = await getDoc(chatDocRef);

        if (!chatSnapshot.exists()) {
            await setDoc(chatDocRef, {
                participants: [currentUserUid, contactUid],
                createdAt: serverTimestamp(),
                lastMessage: {
                    text: '',
                    timestamp: serverTimestamp(),
                    isSeen: false,
                    senderId: '',
                },
                unreadCount: {
                    [currentUserUid]: 0,
                    [contactUid]: 0,
                },
                updatedAt: serverTimestamp(),
            });
            console.log('New Chat room created');
        } else {
            console.log('Existing chat room found');
        }

        return chatId;

    } catch (error) {
        console.error('Error establishing chat connection');
        throw error;
    }

}

export const sendMessageToFirestore = async (chatId: string, text: string, senderId: string) => {
    const messagesSubCollectionRef = collection(db, 'chats', chatId, 'messages');
    const chatDocRef = doc(db, 'chats', chatId);
    const contactId = chatId.split('_').find(id => id !== senderId);
    const messageData = {
        text,
        senderId,
        timestamp: serverTimestamp(),
        isSeen: false
    }

    try {
        await addDoc(messagesSubCollectionRef, messageData);
    } catch (error) {
        console.error('Failed to add message :', error);
    }

    try {
        await updateDoc(chatDocRef, { lastMessage: messageData, [`unreadCount.${contactId}`]: increment(1) })
    } catch (error) {
        console.error('Failed to update last message & unread count:', error);
    }
};

export const updateUnreadCountInFirestore = async (chatId: string, currentUserId: string) => {
    try {
        const chatDocRef = doc(db, 'chats', chatId);
        await updateDoc(chatDocRef, { [`unreadCount.${currentUserId}`]: 0 })
    } catch (error) {
        console.error('Failed to update unread count:', error);
    }
};