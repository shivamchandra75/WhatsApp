import React from 'react';
import styles from './ChatMessages.module.css';
import { useAppSelector } from '../../../store/hooks';
import { useChatMessages } from '../hooks/useChatMessages';

const ChatMessages: React.FC = () => {
  const { activeChatId, activeMessages } = useAppSelector(state => state.chat);
  const { user: currentUser } = useAppSelector(state => state.auth);


  useChatMessages(activeChatId);

  return (
    <div className={styles.messagesContainer}>
      {activeMessages.length === 0 && (
        <div className={styles.placeholder}>
          Start Chatting
        </div>
      )}

      {activeMessages.length > 0 && activeChatId && (
        <div className={styles.messagesWrapper}>
          {activeMessages.map((message) => (
            <div
              key={message.id}
              className={message.senderId === currentUser?.uid ? styles.messageRight : styles.messageLeft}
            >
              <p className={styles.messageText}>{message.text}</p>
              <span className={styles.messageTimestamp}>
                {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
