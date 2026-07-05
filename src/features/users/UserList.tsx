import React from 'react';
import { USERS, type UserListUser } from './UserList.types';

export const UserList: React.FC = () => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="user-list">
      {USERS.map((user: UserListUser) => (
        <div key={user.userId} className="user-list-item" style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ccc' }}>
          <img
            src={user.userImage}
            alt={`${user.username}'s avatar`}
            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }}
          />
          <div className="user-info" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0 }}>{user.username}</h4>
              {user.lastMessage && (
                <span style={{ fontSize: '0.8em', color: user.lastMessage.isSeen ? 'gray' : 'green' }}>
                  {formatTime(user.lastMessage.timestamp)}
                </span>
              )}
            </div>
            {user.lastMessage && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'gray', fontSize: '0.9em' }}>
                  {user.lastMessage.text}
                </p>
                {!user.lastMessage.isSeen && (
                  <span style={{
                    backgroundColor: 'green',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
