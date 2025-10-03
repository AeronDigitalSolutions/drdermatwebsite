import React, { useEffect, useState } from "react";
import styles from "@/styles/components/homePage/categories.module.css";
import { useRouter } from "next/router";

interface ClinicCategory {
  _id: string;
  name: string;
  imageUrl: string;
}

interface ClinicCategoryProps {
  title: string;
  backgroundColor?: string;
  textBg?: string;
  border?: string;
}

const ClinicCategories: React.FC<ClinicCategoryProps> = ({
  title,
  backgroundColor,
  textBg,
  border,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dermatbackend.onrender.com/api/clinic-categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ClinicCategory[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching clinic categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: ClinicCategory) => {
    router.push(`/home/findClinicsPage?category=${category._id}`);
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div
      className={styles.cliniContainer}
      style={{ backgroundColor: backgroundColor || "#f0f0f0" }}
    >
      <h2 className={styles.clinicTitle}>{title}</h2>
      <div className={styles.gridContainer}>
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
      </div>
    </div>
  );
};

export default ClinicCategories;
