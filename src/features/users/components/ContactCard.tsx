import React from 'react';
import type { ContactProfile } from '../UserList.types';
import styles from '../userList.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setActiveChatId, setActiveContact } from '../../chat/chatSlice';
import { startOrJoinChat, markChatAsReadInFirestore } from '../../chat/services/chatService';
import { formatTimeTo12Hours } from '../../../utils/utils';
import { CheckCheck } from 'lucide-react';

interface ContactCardProps {
  user: ContactProfile;
}

export const ContactCard: React.FC<ContactCardProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const currentUserUid = useAppSelector((state) => state.auth.user?.uid);

  const handleClick = async () => {
    if (!currentUserUid) return;

    // Creates the chat room in Firestore if it doesn't exist, then returns its ID
    const chatId = await startOrJoinChat(currentUserUid, user.uid);


    dispatch(setActiveChatId(chatId));          // triggers useChatMessages to subscribe
    dispatch(setActiveContact(user)); // updates the chat header
    
    const isOtherUser = user.lastMessage?.senderId !== currentUserUid;
    await markChatAsReadInFirestore(chatId, currentUserUid, isOtherUser);
  };

  const getIconColor = () => {
    if (user.lastMessage?.isSeen) {
      return "var(--info)"; // Using standard blue info color for "seen" blue ticks
    }
    return "var(--text-secondary)";
  }

  return (
    <div className={styles.userListItem} onClick={handleClick}>
      <div className={styles.avatar}></div>
      <div className={styles.userInfo}>
        <div className={styles.headerRow}>
          <h4 className={styles.username}>{user.displayName}</h4>
          {user.lastMessage && (
            <span className={user.unreadCount > 0 ? styles.timestampUnread : styles.timestamp}>
              {formatTimeTo12Hours(user.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {user.lastMessage && (
          <div className={styles.messageRow}>
            <p className={styles.messageText}>
              {user.lastMessage.senderId === currentUserUid && (
                <CheckCheck size={16} color={getIconColor()} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              )}
              {user.lastMessage?.text}
            </p>
            {user.unreadCount > 0 && (
              <span className={styles.unreadDot}>
                {user.unreadCount > 99 ? '99+' : user.unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
