import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
                lastMessage: '',
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
    await addDoc(messagesSubCollectionRef, {
        text,
        senderId,
        timestamp: serverTimestamp(),
    });
};