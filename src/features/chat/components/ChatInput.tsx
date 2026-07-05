import React from 'react';
import styles from './ChatInput.module.css';

const ChatInput: React.FC = () => {
  return (
    <div className={styles.inputContainer}>
      <input 
        type="text" 
        className={styles.inputField} 
        placeholder="Type a message" 
      />
      <button className={styles.sendBtn}>Send</button>
    </div>
  );
};

export default ChatInput;
