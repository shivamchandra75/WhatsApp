import React from 'react';
import type { ContactProfile } from '../UserList.types';
import styles from '../userList.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setActiveChatId, setActiveContact } from '../../chat/chatSlice';
import { startOrJoinChat, markChatAsReadInFirestore } from '../../chat/services/chatService';
import { formatTimeTo12Hours, getAvatarColor } from '../../../utils/utils';
import { CheckCheck, User2 } from 'lucide-react';

interface ContactCardProps {
  user: ContactProfile;
}

export const ContactCard: React.FC<ContactCardProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const currentUserUid = useAppSelector((state) => state.auth.user?.uid);

  const handleClick = async () => {
    if (!currentUserUid) return;

    const chatId = await startOrJoinChat(currentUserUid, user.uid);

    dispatch(setActiveChatId(chatId));
    dispatch(setActiveContact(user));

    const isOtherUser = user.lastMessage?.senderId !== currentUserUid;
    await markChatAsReadInFirestore(chatId, currentUserUid, isOtherUser);
  };

  const getIconColor = () => {
    if (user.lastMessage?.isSeen) {
      return "var(--info)";
    }
    return "var(--text-secondary)";
  }

  const colorTheme = getAvatarColor(user.uid);
  const bgColor = `var(--dp-bg-${colorTheme})`;
  const iconColor = `var(--dp-icon-${colorTheme})`;

  return (
    <div className={styles.userListItem} onClick={handleClick}>
      <div className={styles.avatar} style={{ backgroundColor: bgColor, borderColor: iconColor }}>
        <User2 color={iconColor} size={24} />
      </div>
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
