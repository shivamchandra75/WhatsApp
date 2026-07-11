import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <Search size={18} color="var(--text-secondary)" className={styles.icon} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          placeholder="Search or start a new chat"
        />
        {query && (
          <X
            size={18}
            color="var(--text-secondary)"
            onClick={() => setQuery('')}
            className={styles.clearIcon}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
