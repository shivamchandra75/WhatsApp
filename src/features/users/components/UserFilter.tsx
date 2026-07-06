import React from 'react';
import styles from './UserFilter.module.css';

const UserFilter: React.FC = () => {
  return (
    <div className={styles.filterContainer}>
      <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
      <button className={styles.filterBtn}>Unread</button>
    </div>
  );
};

export default UserFilter;
