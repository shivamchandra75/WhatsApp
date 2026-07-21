import React from 'react';
import styles from './ChatHeader.module.css';
import { useAppSelector } from '../../../store/hooks';
import { User2 } from 'lucide-react';
import { FaVideo } from 'react-icons/fa';
import { getAvatarColor } from '../../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { webRTCService } from '../../call/services/webrtcService';
import { initiateCall, setFullScreen } from '../../call/callSlice';
import type { RootState } from '../../../store/store';

const ChatHeader: React.FC = () => {
  const dispatch = useDispatch();
  const activeContactData = useAppSelector(state =>
    state.users.contacts.find(c => c.uid === state.chat.activeContact?.uid)
  );
  
  const currentUser = useAppSelector(state => state.auth.user);
  const { status, callId, isFullScreen } = useSelector((state: RootState) => state.call);

  const colorTheme = activeContactData ? getAvatarColor(activeContactData.uid) : 'green';
  const bgColor = `var(--dp-bg-${colorTheme})`;
  const iconColor = `var(--dp-icon-${colorTheme})`;

  const handleVideoCallClick = async () => {
    if (!activeContactData || !currentUser) return;

    if (status !== 'idle') {
      // If a call is already active, just return to full screen
      dispatch(setFullScreen(true));
      return;
    }

    // Initiate new call
    const stream = await webRTCService.initLocalStream();
    if (stream) {
      dispatch(initiateCall(activeContactData));
      
      const callerProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Unknown User',
        status: 'Hey there! I am using WhatsApp.',
        isOnline: true,
        unreadCount: 0
      };

      await webRTCService.createCall(callerProfile, activeContactData);
    } else {
      alert("Microphone or camera permission denied.");
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar} style={{ backgroundColor: bgColor, borderColor: iconColor }}>
          <User2 color={iconColor} size={24} />
        </div>
        <div className={styles.details}>
          <h3 className={styles.name}>{activeContactData?.displayName}</h3>
          <span className={styles.status}>{activeContactData?.isOnline ? 'online' : 'offline'}</span>
        </div>
      </div>
      
      {activeContactData && (
        <div className={styles.actions}>
          <button 
            className={`${styles.callButton} ${status !== 'idle' ? styles.activeCall : ''}`} 
            onClick={handleVideoCallClick}
            title={status !== 'idle' ? "Return to Call" : "Video Call"}
          >
            <FaVideo />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
