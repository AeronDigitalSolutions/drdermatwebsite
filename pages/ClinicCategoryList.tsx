"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/cliniccategorylist.module.css";

interface ClinicCategory {
  _id: string;
  categoryId: string;
  name: string;
  imageUrl: string; // base64 string
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const ClinicCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic-categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load clinic categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className={styles.loading}>Loading clinic categories...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clinic Categories</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat._id} className={styles.card}>
            <img src={cat.imageUrl} alt={cat.name} className={styles.image} />
            <div className={styles.content}>
              <h3>{cat.name}</h3>
              <p>ID: {cat.categoryId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicCategoryList;
