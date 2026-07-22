import { collection, doc, setDoc, getDoc, onSnapshot, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../../confg/firebase';
import store from '../../../store/store';
import {
  setIncomingCall,
  setCallConnected,
  endCall,
  setLocalStreamActive,
  setRemoteStreamActive
} from '../callSlice';
import type { ContactProfile } from '../../users/UserList.types';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
    {
      urls: (import.meta.env.VITE_TURN_SERVER_URL || '').split(','),
      username: import.meta.env.VITE_TURN_SERVER_USER || '',
      credential: import.meta.env.VITE_TURN_SERVER_CREDENTIAL || '',
    },
  ],
  iceCandidatePoolSize: 10,
};

class WebRTCService {
  public pc: RTCPeerConnection | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;
  private callDocRef: any = null;
  private unsubscribeCall: (() => void) | null = null;
  private unsubscribeOfferCandidates: (() => void) | null = null;
  private unsubscribeAnswerCandidates: (() => void) | null = null;
  private incomingCallListener: (() => void) | null = null;

  async initLocalStream(video: boolean = true, audio: boolean = true) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported or running in an insecure context (HTTP instead of HTTPS).');
      }
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
      store.dispatch(setLocalStreamActive(true));
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      return null;
    }
  }

  private initPeerConnection() {
    this.pc = new RTCPeerConnection(servers);
    this.remoteStream = new MediaStream();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.pc?.addTrack(track, this.localStream!);
      });
    }

    this.pc.ontrack = (event) => {
      if (event.track) {
        this.remoteStream?.addTrack(event.track);
        store.dispatch(setRemoteStreamActive(true));
      }
    };
  }

  async createCall(callerProfile: ContactProfile, receiverProfile: ContactProfile) {
    this.initPeerConnection();

    const callDoc = doc(collection(db, 'calls'));
    this.callDocRef = callDoc;

    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    this.pc!.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await this.pc!.createOffer();
    await this.pc!.setLocalDescription(offerDescription);

    const callData = {
      callerId: callerProfile.uid,
      receiverId: receiverProfile.uid,
      callerProfile,
      receiverProfile,
      offer: {
        type: offerDescription.type,
        sdp: offerDescription.sdp,
      },
      status: 'ringing'
    };

    await setDoc(callDoc, callData);

    // Listen for remote ICE candidates
    const pendingCandidates: RTCIceCandidateInit[] = [];
    this.unsubscribeAnswerCandidates = onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidateData = change.doc.data() as RTCIceCandidateInit;
          if (this.pc?.remoteDescription) {
            this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
          } else {
            pendingCandidates.push(candidateData);
          }
        }
      });
    });

    // Listen for answer
    this.unsubscribeCall = onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!this.pc?.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc?.setRemoteDescription(answerDescription).then(() => {
          // Add any pending candidates now that remote description is set
          pendingCandidates.forEach(candidate => {
            this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
          });
          pendingCandidates.length = 0; // Clear the queue
        });
        store.dispatch(setCallConnected(callDoc.id));
      }
      if (data?.status === 'ended') {
        this.cleanupCall();
      }
    });

    return callDoc.id;
  }

  async answerCall(callId: string) {
    this.initPeerConnection();
    const callDoc = doc(db, 'calls', callId);
    this.callDocRef = callDoc;

    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    this.pc!.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    // Listen for remote ICE candidates
    const pendingCandidates: RTCIceCandidateInit[] = [];
    this.unsubscribeOfferCandidates = onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidateData = change.doc.data() as RTCIceCandidateInit;
          if (this.pc?.remoteDescription) {
            this.pc.addIceCandidate(new RTCIceCandidate(candidateData));
          } else {
            pendingCandidates.push(candidateData);
          }
        }
      });
    });

    const callData = (await getDoc(callDoc)).data();
    if (!callData) return;

    const offerDescription = callData.offer;
    await this.pc!.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Add any pending candidates now that remote description is set
    pendingCandidates.forEach(candidate => {
      this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
    });
    pendingCandidates.length = 0; // Clear the queue

    const answerDescription = await this.pc!.createAnswer();
    await this.pc!.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer, status: 'connected' });
    store.dispatch(setCallConnected(callId));

    // Listen for call ending
    this.unsubscribeCall = onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.status === 'ended') {
        this.cleanupCall();
      }
    });
  }

  async rejectCall(callId: string) {
    const callDoc = doc(db, 'calls', callId);
    await updateDoc(callDoc, { status: 'ended' });
    store.dispatch(endCall());
  }

  async hangUp() {
    if (this.callDocRef) {
      try {
        await updateDoc(this.callDocRef, { status: 'ended' });
      } catch (e) {
        console.warn('Call doc might already be deleted or permission denied', e);
      }
    }
    this.cleanupCall();
  }

  private cleanupCall() {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.remoteStream = null;

    if (this.unsubscribeCall) this.unsubscribeCall();
    if (this.unsubscribeOfferCandidates) this.unsubscribeOfferCandidates();
    if (this.unsubscribeAnswerCandidates) this.unsubscribeAnswerCandidates();

    store.dispatch(endCall());
  }

  listenForIncomingCalls(userId: string) {
    const callsQuery = query(
      collection(db, 'calls'),
      where('receiverId', '==', userId),
      where('status', '==', 'ringing')
    );

    this.incomingCallListener = onSnapshot(callsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const callerProfile = data.callerProfile;
          store.dispatch(setIncomingCall({ callId: change.doc.id, remoteUser: callerProfile }));
        }
      });
    });
  }

  stopListeningForIncomingCalls() {
    if (this.incomingCallListener) {
      this.incomingCallListener();
      this.incomingCallListener = null;
    }
  }
}

export const webRTCService = new WebRTCService();
