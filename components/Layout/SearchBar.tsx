// components/SearchBar.tsx

import React from "react";
import { Search } from "lucide-react";
import styles from "@/styles/components/Layout/SearchBar.module.css"; // create a separate CSS module

const SearchBar = () => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Products for you"
          className={styles.searchInput}
        />
        <Search className={styles.searchIcon} size={20} />
      </div>
    </div>
  );
};

export default SearchBar;
