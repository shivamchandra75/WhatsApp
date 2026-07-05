import React from 'react';
import styles from './Header.module.css';

const SidebarHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>Chats</h3>
    </div>
  );
};

export default SidebarHeader;
