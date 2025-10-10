"use client";

import React, { useState, useRef } from "react";
import styles from "@/styles/Dashboard/createcategory.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [exploreImage, setExploreImage] = useState<File | null>(null);
  const [explorePreview, setExplorePreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exploreInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  // ✅ Handle main image upload
  const handleCategoryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Image must be ≤ 1MB");
      return;
    }
    setError("");
    setCategoryImage(file);
    setPreviewUrl(URL.createObjectURL(file)); // replaces old preview
  };

  // ✅ Handle explore image upload
  const handleExploreImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Explore image must be ≤ 1MB");
      return;
    }
    setError("");
    setExploreImage(file);
    setExplorePreview(URL.createObjectURL(file)); // replaces old preview
  };

  // ✅ Create category with main image
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return setError("Category name required");
    if (!categoryImage) return setError("Please select a category image");

    try {
      const base64Image = await convertToBase64(categoryImage);
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          imageUrl: base64Image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create category");
        return;
      }

      alert("✅ Category created successfully");
      setCategoryName("");
      setCategoryImage(null);
      setPreviewUrl(null);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    }
  };

  // ✅ Upload explore image only
  const handleExploreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exploreImage) return setError("Please select an explore image");

    try {
      const base64Explore = await convertToBase64(exploreImage);

      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Explore Image Only", // dummy name if you only want to upload image
          imageUrl: base64Explore, // you can store in exploreImage only if needed
          exploreImage: base64Explore,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to upload explore image");
        return;
      }

      alert("✅ Explore image uploaded successfully");
      setExploreImage(null);
      setExplorePreview(null);
      if (exploreInputRef.current) exploreInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("Unexpected error during explore upload");
    }
  };

  return (
    <div className={styles.container}>
      {/* ✅ Add Category Section */}
      <form className={styles.form} onSubmit={handleCreateCategory}>
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
        />

        <label htmlFor="categoryImage">Category Image (Max 1MB)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCategoryImage}
          className={styles.fileInput}
        />

        {previewUrl && (
          <img src={previewUrl} alt="Preview" className={styles.preview} />
        )}

        <button type="submit" className={styles.button}>
          Add Category
        </button>
      </form>

      {/* ✅ Explore Image Section */}
      <form className={styles.form} onSubmit={handleExploreSubmit}>
        <h3 className={styles.subHeading}>
          Update image to explore more category
        </h3>

        <input
          ref={exploreInputRef}
          type="file"
          accept="image/*"
          onChange={handleExploreImage}
          className={styles.fileInput}
        />

        {explorePreview && (
          <img
            src={explorePreview}
            alt="Explore Preview"
            className={styles.preview}
          />
        )}

        <button type="submit" className={styles.buttonSecondary}>
          Upload Explore Image
        </button>
      </form>

      <MobileNavbar />
    </div>
  );
};

export default CreateCategory;
