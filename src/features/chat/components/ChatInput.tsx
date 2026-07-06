import React, { useState } from 'react';
import styles from './ChatInput.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { sendMessage } from '../chatSlice';

const ChatInput: React.FC = () => {
  const { activeChatId } = useAppSelector(state => state.chat);
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();

  function handleSendMessage() {
    if (!activeChatId) return;
    dispatch(sendMessage({ chatId: activeChatId, message }));
    setMessage('');
  }

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.inputField}
          placeholder="Type a message"
        />
        <button
          className={styles.sendBtn}
          disabled={message === ''}
          onClick={handleSendMessage}
        >
          <div className={styles.sendIcon}></div>
        </button>
      </div >
    </div >
  );
};

export default ChatInput;
