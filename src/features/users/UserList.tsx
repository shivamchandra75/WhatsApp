import React from 'react';
import { type ContactProfile } from './UserList.types';
import styles from './UserList.module.css';
import { useUsersList } from './hooks/useUsersList';
import { useAppSelector } from '../../store/hooks';

export const UserList: React.FC = () => {
  useUsersList();

  const { contacts } = useAppSelector((state) => state.users);
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className={styles.userList}>
      {contacts.map((user: ContactProfile) => (
        <div key={user.uid} className={styles.userListItem}>
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
                  {user.lastMessage.text || 'how are you'}
                </p>
                {!user.lastMessage.isSeen && (
                  <span className={styles.unreadDot}></span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
