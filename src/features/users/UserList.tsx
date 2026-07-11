import React from 'react';
import { type ContactProfile } from './UserList.types';
import styles from './UserList.module.css';
import { useUsersList } from './hooks/useUsersList';
import { useAppSelector } from '../../store/hooks';
import { ContactCard } from './components/ContactCard';

export const UserList: React.FC = () => {
  useUsersList();

  const { contacts } = useAppSelector((state) => state.users);



  return (
    <div className={styles.userList}>
      {contacts.map((user: ContactProfile) => (
        <ContactCard key={user.uid} user={user} />
      ))}
    </div>
  );
};
