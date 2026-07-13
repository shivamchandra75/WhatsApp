import React, { useState } from 'react';
import SidebarHeader from './Header';
import SearchBar from '../../features/users/components/SearchBar';
import UserFilter from '../../features/users/components/UserFilter';
import { UserList } from '../../features/users/UserList';
import styles from './MainLayout.module.css';

const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <>
      <SidebarHeader />
      <SearchBar query={searchQuery} setQuery={setSearchQuery} />
      <UserFilter filter={filter} setFilter={setFilter} />
      <div className={styles.scrollableArea}>
        <UserList query={searchQuery} filter={filter} setFilter={setFilter} />
      </div>
    </>
  );
};

export default Sidebar;
