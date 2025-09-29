"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/components/homePage/categories.module.css";
import { useRouter } from "next/navigation";
import productImg from "@/public/product1.png";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ProductCategoryProps {
  title: string;
  backgroundColor?: string;
  textBg?: string;
  border?: string;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({
  title,
  backgroundColor,
  textBg,
  border,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const getValidImage = (img?: string) => {
    if (!img) return productImg.src;
    if (img.startsWith("data:")) return img;
    return `data:image/jpeg;base64,${img}`;
  };

  // fetch categories
  useEffect(() => {
    const ac = new AbortController();
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        const formatted: Category[] = Array.isArray(data)
          ? data.map((cat: any) => ({
              id: cat.id ?? cat._id,
              name: cat.name,
              imageUrl: cat.imageUrl,
            }))
          : [];

        setCategories(formatted);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Error fetching categories:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => ac.abort();
  }, []);

  const handleCategoryClick = (category: Category) => {
    // Store selected category in localStorage
    localStorage.setItem("selectedCategory", JSON.stringify(category));
    // Redirect to product listing page
    router.push("/product-listing");
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div
      className={styles.cliniContainer}
      style={{ backgroundColor: backgroundColor || "#f0f0f0" }}
    >
      <h2 className={styles.clinicTitle}>{title}</h2>

      <div className={styles.gridContainer}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(category)}
            style={{
              cursor: "pointer",
              backgroundColor: textBg || "#D9EBFD",
              border: border || "none",
            }}
          >
            <img
              src={getValidImage(category.imageUrl)}
              alt={category.name}
              className={styles.categoryImg}
            />
            <p className={styles.categoryName}>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
