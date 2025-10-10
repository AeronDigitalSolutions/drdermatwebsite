"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/components/homePage/categories.module.css";
import { useRouter } from "next/router";

interface ClinicCategory {
  _id: string;
  name: string;
  imageUrl: string;
  exploreImage?: string;
}

interface ClinicCategoryProps {
  title: string;
  backgroundColor?: string;
  textBg?: string;
  border?: string;
}

// ✅ API base URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const ClinicCategories: React.FC<ClinicCategoryProps> = ({
  title,
  backgroundColor,
  textBg,
  border,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [exploreImage, setExploreImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic-categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ClinicCategory[] = await res.json();

        if (Array.isArray(data)) {
          // ⚠️ Check minimum category count
          if (data.length < 7) {
            setError("Please add at least 7 clinic categories to display.");
          } else {
            setError("");
          }

          // ✅ Take first 7 categories
          setCategories(data.slice(0, 7));

          // ✅ Find category with exploreImage for the 8th tile
          const exploreCat = data.find((cat) => !!cat.exploreImage);
          if (exploreCat?.exploreImage) {
            setExploreImage(exploreCat.exploreImage);
          }
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        console.error("Error fetching clinic categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: ClinicCategory) => {
    router.push(`/home/findClinicsPage?category=${category._id}`);
  };

  const handleExploreClick = () => {
    router.push("/ClinicCategoryList"); // ✅ Redirect to ClinicCategoryList page
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div
      className={styles.cliniContainer}
      style={{ backgroundColor: backgroundColor || "#f0f0f0" }}
    >
      <h2 className={styles.clinicTitle}>{title}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.gridContainer}>
        {/* 🧩 First 7 categories */}
        {categories.map((category, index) => (
          <div
            key={category._id}
            className={styles.categoryCard}
            style={{
              cursor: "pointer",
              backgroundColor: textBg || "#D9EBFD",
              border: border || "none",
            }}
            onClick={() => handleCategoryClick(category)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={category.imageUrl}
                alt={category.name}
                className={`${styles.categoryImg} ${
                  hoveredIndex === index ? "" : "reverse"
                }`}
              />
              <div
                className={`${styles.overlay} ${
                  hoveredIndex === index ? "" : "reverse"
                }`}
              >
                <div className={styles.overlayContent}>
                  <span className={styles.categoryText}>{category.name}</span>
                  <span className={styles.arrow}>&rarr;</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 🧩 8th Tile — Explore Image */}
        {exploreImage && (
          <div
            className={styles.categoryCard}
            style={{
              backgroundColor: textBg || "#D9EBFD",
              border: border || "none",
              cursor: "pointer",
            }}
            onClick={handleExploreClick} // ✅ Redirect on click
          >
            <div className={styles.imageWrapper}>
              <img
                src={exploreImage}
                alt="Explore More"
                className={styles.categoryImg}
              />
              <div className={styles.overlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.categoryText}>Explore More</span>
                  <span className={styles.arrow}>&rarr;</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicCategories;
