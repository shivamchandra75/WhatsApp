import React from 'react';
import styles from './ChatMessages.module.css';
import { useAppSelector } from '../../../store/hooks';
import { useChatMessages } from '../hooks/useChatMessages';
import { formatTimeTo12Hours } from '../../../utils/utils';
import { CheckCheck } from 'lucide-react';

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
                {message.timestamp ? formatTimeTo12Hours(message.timestamp) : ''}
                {message.senderId === currentUser?.uid && (
                  <CheckCheck size={14} color="var(--brand-primary)" />
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
