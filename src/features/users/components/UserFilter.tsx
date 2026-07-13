import React from 'react';
import styles from './UserFilter.module.css';

interface UserFilterProps {
  filter: string,
  setFilter: (filter: string) => void
}

const UserFilter: React.FC<UserFilterProps> = ({ filter, setFilter }) => {
  const handleClick = (filterType: string) => {
    setFilter(filterType)
  }
  return (
    <div className={styles.filterContainer}>
      <button
        onClick={() => handleClick('all')}
        className={`${styles.filterBtn} ${filter === 'all' && styles.active}`}>All</button>
      <button onClick={() => handleClick('unread')} className={`${styles.filterBtn} ${filter === 'unread' && styles.active}`}>Unread</button>
    </div>
  );
};

export default UserFilter;
