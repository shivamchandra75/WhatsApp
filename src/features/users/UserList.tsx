import React from 'react';
import { type ContactProfile } from './UserList.types';
import styles from './userList.module.css';
import { useUsersList } from './hooks/useUsersList';
import { useAppSelector } from '../../store/hooks';
import { ContactCard } from './components/ContactCard';

interface UserListProps {
  query?: string;
  filter?: string;
  setFilter: (filter: string) => void
}

export const UserList: React.FC<UserListProps> = ({ query = '', filter = 'all', setFilter }) => {
  useUsersList();
  const { contacts } = useAppSelector((state) => state.users);

  // Compute filtered contacts on the fly based on the search query
  const filteredContacts = contacts.filter((user: ContactProfile) => {
    if (query && query !== '') return user.displayName.toLowerCase().includes(query.toLowerCase());
    return true;
  }
  ).filter((user: ContactProfile) => {
    if (filter === 'unread') return user.unreadCount > 0;
    return true;
  });

  return (
    <div className={styles.userList}>
      {filteredContacts.map((user: ContactProfile) => (
        <ContactCard key={user.uid} user={user} />
      ))}
      {filteredContacts.length === 0 && <>
        <div className={styles.noContacts}>No contacts found</div>
        {
          filter === "unread" && <button className={styles.filterBtn} onClick={() => setFilter('all')}>Clear Filter</button>
        }
      </>
      }
    </div>
  );
};
