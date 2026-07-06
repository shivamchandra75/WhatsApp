import React from 'react';
import styles from './ChatMessages.module.css';
import { useAppSelector } from '../../../store/hooks';
import { useChatMessages } from '../hooks/useChatMessages';

const ChatMessages: React.FC = () => {
  const { activeChatId } = useAppSelector(state => state.chat);

  useChatMessages(activeChatId);

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.placeholder}>
        Select a chat to start messaging
      </div>
    </div>
  );
};

export default ChatMessages;
