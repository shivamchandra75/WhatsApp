import React from 'react';
import { USERS, type UserListUser } from './UserList.types';
import styles from './UserList.module.css';

export const UserList: React.FC = () => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.userList}>
      {USERS.map((user: UserListUser) => (
        <div key={user.userId} className={styles.userListItem}>
          <img
            src={user.userImage}
            alt={`${user.username}'s avatar`}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <div className={styles.headerRow}>
              <h4 className={styles.username}>{user.username}</h4>
              {user.lastMessage && (
                <span className={user.lastMessage.isSeen ? styles.timestamp : styles.timestampUnread}>
                  {formatTime(user.lastMessage.timestamp)}
                </span>
              )}
            </div>
            {user.lastMessage && (
              <div className={styles.messageRow}>
                <p className={styles.messageText}>
                  {user.lastMessage.text}
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
