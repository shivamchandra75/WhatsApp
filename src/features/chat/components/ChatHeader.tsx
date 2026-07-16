import React from 'react';
import styles from './ChatHeader.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { User2, Video } from 'lucide-react';
import { getAvatarColor, getCameraAndMicPermission, turnOffCameraAndMic } from '../../../utils/utils';
import { makeACall } from '../../videoCall/callSlice';

const ChatHeader: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const activeContactData = useAppSelector(state =>
    state.users.contacts.find(c => c.uid === state.chat.activeContact?.uid)
  );
  const dispatch = useAppDispatch();

  const colorTheme = activeContactData ? getAvatarColor(activeContactData.uid) : 'green';
  const bgColor = `var(--dp-bg-${colorTheme})`;
  const iconColor = `var(--dp-icon-${colorTheme})`;

  async function handleCallClick() {
    const stream = await getCameraAndMicPermission();
    if (!stream) return;

    dispatch(makeACall({ callerId: user.uid, receiverId: activeContactData?.uid }));
    // turnOffCameraAndMic(stream);
  }

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
      <button
        onClick={handleCallClick}
        className={styles.callButton}>
        <Video size={24} />
      </button>
    </div>
  );
};

export default ChatHeader;
