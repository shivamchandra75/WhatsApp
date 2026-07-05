import React from 'react';
import styles from './ChatMessages.module.css';

const ChatMessages: React.FC = () => {
  return (
    <div className={styles.messagesContainer}>
      <div className={styles.placeholder}>
        Select a chat to start messaging
      </div>
    </div>
  );
};

export default ChatMessages;
