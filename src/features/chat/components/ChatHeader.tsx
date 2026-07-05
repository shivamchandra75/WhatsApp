import React from 'react';
import styles from './ChatHeader.module.css';

const ChatHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}></div>
        <div className={styles.details}>
          <h3 className={styles.name}>Select a chat</h3>
          <span className={styles.status}>offline</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
