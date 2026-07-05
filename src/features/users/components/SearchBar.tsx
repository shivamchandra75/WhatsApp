import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchContainer}>
      <input 
        type="text" 
        className={styles.searchInput} 
        placeholder="Search or start a new chat" 
      />
    </div>
  );
};

export default SearchBar;
