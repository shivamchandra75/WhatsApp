import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../confg/firebase";

export async function updateUserOnlineStatusInFirestore(userId: string, isOnline: boolean) {
    const userDocRef = doc(db, 'users', userId);
    try {
        return await updateDoc(userDocRef, { isOnline });
    } catch (error) {
        console.error(error);
        throw error;
    }
};