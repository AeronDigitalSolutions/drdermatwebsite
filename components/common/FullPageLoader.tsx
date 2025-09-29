// components/common/FullPageLoader.tsx
"use client";

import React from "react";
import styles from "@/styles/Loader.module.css";

const FullPageLoader: React.FC = () => {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
      </div>
    </div>
  );
};

export default FullPageLoader;
