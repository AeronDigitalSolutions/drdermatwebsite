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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic-categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ClinicCategory[] = await res.json();

        if (Array.isArray(data)) {
          setError(data.length < 7 ? "Please add at least 7 clinic categories." : "");
          setCategories(data); // store all fetched categories
          const exploreCat = data.find((cat) => !!cat.exploreImage);
          if (exploreCat?.exploreImage) setExploreImage(exploreCat.exploreImage);
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        console.error(err);
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
    router.push("/ClinicCategoryList");
  };

  if (loading) return <p>Loading categories...</p>;

  // Decide number of categories based on screen size
  let displayCategories: ClinicCategory[] = [];
  if (isMobile) {
    displayCategories = [...categories.slice(0, 8)];
    while (displayCategories.length < 8) {
      displayCategories.push({
        _id: `placeholder-${displayCategories.length}`,
        name: "Coming Soon",
        imageUrl: "/placeholder.jpg",
      });
    }
  } else {
    displayCategories = categories.slice(0, 7); // desktop: 7 categories
  }

  return (
    <div
      className={styles.cliniContainer}
      style={{ backgroundColor: backgroundColor || "#f0f0f0" }}
    >
      <h2 className={styles.clinicTitle}>{title}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.gridContainer}>
        {displayCategories.map((category, index) => (
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

        {/* Explore More card */}
        {exploreImage && (
          <div
            className={styles.categoryCard}
            style={{
              backgroundColor: textBg || "#D9EBFD",
              border: border || "none",
              cursor: "pointer",
            }}
            onClick={handleExploreClick}
          >
            <div className={styles.imageWrapper}>
              <img src={exploreImage} alt="Explore More" className={styles.categoryImg} />
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
