// components/CreateCategory.tsx
"use client";

import React, { useState, useRef } from "react";
import styles from "@/styles/Dashboard/createcategory.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image must be ≤ 1MB.");
        setCategoryImage(null);
        setPreviewUrl(null);
        return;
      }
      setError("");
      setCategoryImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    if (!categoryImage) {
      setError("Please select an image.");
      return;
    }

    try {
      const base64Image = await convertToBase64(categoryImage);

      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          imageUrl: base64Image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create category.");
        return;
      }

      // Reset form
      setCategoryName("");
      setCategoryImage(null);
      setPreviewUrl(null);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("✅ Category created successfully!");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Add New Category</h2>

        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className={styles.input}
          placeholder="Enter category name"
          required
        />

        <label htmlFor="image">Category Image (Max 1MB)</label>
        <input
          ref={fileInputRef}
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />

        {previewUrl && (
          <img src={previewUrl} alt="Preview" className={styles.preview} />
        )}

        <button type="submit" className={styles.button}>
          Add Category
        </button>
      </form>

      <MobileNavbar />
    </div>
  );
};

export default CreateCategory;
