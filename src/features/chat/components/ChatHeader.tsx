import React from 'react';
import styles from './ChatHeader.module.css';
import { useAppSelector } from '../../../store/hooks';
import { User2 } from 'lucide-react';
import { getAvatarColor } from '../../../utils/utils';

const ChatHeader: React.FC = () => {
  const activeContactData = useAppSelector(state =>
    state.users.contacts.find(c => c.uid === state.chat.activeContact?.uid)
  );

  const colorTheme = activeContactData ? getAvatarColor(activeContactData.uid) : 'green';
  const bgColor = `var(--dp-bg-${colorTheme})`;
  const iconColor = `var(--dp-icon-${colorTheme})`;

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
    </div>
  );
};

export default ChatHeader;
