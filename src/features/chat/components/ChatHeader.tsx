import React from 'react';
import styles from './ChatHeader.module.css';
import { useAppSelector } from '../../../store/hooks';

const ChatHeader: React.FC = () => {
  const activeContactData = useAppSelector(state =>
    state.users.contacts.find(c => c.uid === state.chat.activeContact?.uid)
  );

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}></div>
        <div className={styles.details}>
          <h3 className={styles.name}>{activeContactData?.displayName}</h3>
          <span className={styles.status}>{activeContactData?.isOnline ? 'online' : 'offline'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
