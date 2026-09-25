import React from 'react';
import type { ContactProfile } from '../UserList.types';
import styles from '../userList.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setActiveChatId, setActiveContact } from '../../chat/chatSlice';
import { startOrJoinChat, markConversationAsRead } from '../../chat/services/chatService';
import { formatTimeTo12Hours, getAvatarColor } from '../../../utils/utils';
import { CheckCheck, User2 } from 'lucide-react';

interface ContactCardProps {
  contact: ContactProfile;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const dispatch = useAppDispatch();
  const currentUserUid = useAppSelector((state) => state.auth.user?.uid);

  const handleClick = async () => {
    if (!currentUserUid) return;

    const chatId = await startOrJoinChat(currentUserUid, contact.uid);

    dispatch(setActiveChatId(chatId));
    dispatch(setActiveContact(contact));

    await markConversationAsRead(chatId, currentUserUid);
  };

  const getIconColor = () => {
    if (contact.lastMessage?.isSeen) {
      return "var(--info)";
    }
    return "var(--text-secondary)";
  }

  const colorTheme = getAvatarColor(contact.uid);
  const bgColor = `var(--dp-bg-${colorTheme})`;
  const iconColor = `var(--dp-icon-${colorTheme})`;

  return (
    <div className={styles.userListItem} onClick={handleClick}>
      <div className={styles.avatar} style={{ backgroundColor: bgColor, borderColor: iconColor }}>
        <User2 color={iconColor} size={24} />
      </div>
      <div className={styles.userInfo}>
        <div className={styles.headerRow}>
          <h4 className={styles.username}>{contact.displayName}</h4>
          {contact.lastMessage && (
            <span className={contact.unreadCount > 0 ? styles.timestampUnread : styles.timestamp}>
              {formatTimeTo12Hours(contact.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {contact.lastMessage && (
          <div className={styles.messageRow}>
            <p className={styles.messageText}>
              {contact.lastMessage.senderId === currentUserUid && (
                <CheckCheck size={16} color={getIconColor()} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              )}
              {contact.lastMessage?.text}
            </p>
            {contact.unreadCount > 0 && (
              <span className={styles.unreadDot}>
                {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
