import React from 'react';
import styles from './ChatHeader.module.css';
import { useAppSelector } from '../../../store/hooks';

const ChatHeader: React.FC = () => {
  const { activeContactName } = useAppSelector(state => state.chat)

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}></div>
        <div className={styles.details}>
          <h3 className={styles.name}>{activeContactName}</h3>
          <span className={styles.status}>offline</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
