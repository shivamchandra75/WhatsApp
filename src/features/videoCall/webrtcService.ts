// a function that creates an offer and stores that in firebase

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../confg/firebase";

export async function createOfferInFirestore(callerId: string, receiverId: string) {
    const peerConnection = new RTCPeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const callsCollectionRef = collection(db, 'calls');
    const callDocRef = await addDoc(callsCollectionRef, { offer, callerId, receiverId, status: 'ringing' });

    console.log("Call document created with ID: ", callDocRef.id);

    return callDocRef.id;
};