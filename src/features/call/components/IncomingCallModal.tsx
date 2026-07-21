import React from 'react';
import { useSelector  } from 'react-redux';
import type { RootState } from '../../../store/store';
import { webRTCService } from '../services/webrtcService';
import styles from './IncomingCallModal.module.css';

const IncomingCallModal: React.FC = () => {
  const { status, callId, remoteUser, isCaller } = useSelector((state: RootState) => state.call);

  if (status !== 'ringing' || !callId || !remoteUser) {
    return null;
  }

  // If we are the caller, we don't show the incoming call modal
  if (isCaller) {
    return null;
  }

  const handleAccept = async () => {
    // Request media permissions before answering
    const stream = await webRTCService.initLocalStream();
    if (stream) {
      await webRTCService.answerCall(callId);
    } else {
      // If permission denied
      handleReject();
    }
  };

  const handleReject = async () => {
    await webRTCService.rejectCall(callId);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.callerInfo}>
          <div className={styles.avatar}>
             {remoteUser.displayName ? remoteUser.displayName[0].toUpperCase() : '?'}
          </div>
          <div className={styles.details}>
            <h4>{remoteUser.displayName}</h4>
            <p>Incoming video call...</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.rejectBtn} onClick={handleReject}>Decline</button>
          <button className={styles.acceptBtn} onClick={handleAccept}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
