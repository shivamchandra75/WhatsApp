import React from 'react';
import type { ContactProfile } from '../UserList.types';
import styles from '../userList.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setActiveChatId, setActiveContact } from '../../chat/chatSlice';
import { startOrJoinChat, updateUnreadCountInFirestore } from '../../chat/services/chatService';

interface ContactCardProps {
  user: ContactProfile;
  formatTime: (timestamp: number) => string;
}

export const ContactCard: React.FC<ContactCardProps> = ({ user, formatTime }) => {
  const dispatch = useAppDispatch();
  const currentUserUid = useAppSelector((state) => state.auth.user?.uid);

  const handleClick = async () => {
    if (!currentUserUid) return;

    // Creates the chat room in Firestore if it doesn't exist, then returns its ID
    const chatId = await startOrJoinChat(currentUserUid, user.uid);


    dispatch(setActiveChatId(chatId));          // triggers useChatMessages to subscribe
    dispatch(setActiveContact(user)); // updates the chat header
    await updateUnreadCountInFirestore(chatId, currentUserUid);
  };

  return (
    <div className={styles.userListItem} onClick={handleClick}>
      {/* <img
        src={user.userImage}
        alt={`${user.username}'s avatar`}
        className={styles.avatar}
      /> */}
      <div className={styles.userInfo}>
        <div className={styles.headerRow}>
          <h4 className={styles.username}>{user.displayName}</h4>
          {user.lastMessage && (
            <span className={user.lastMessage.isSeen ? styles.timestamp : styles.timestampUnread}>
              {formatTime(user.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {user.lastMessage && (
          <div className={styles.messageRow}>
            <p className={styles.messageText}>
              {user.lastMessage?.text}
            </p>
            {user.unreadCount > 0 && (
              <span className={styles.unreadDot}>{user.unreadCount}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
