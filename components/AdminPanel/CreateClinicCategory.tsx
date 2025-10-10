"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/Dashboard/createcategory.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const CreateClinicCategory = () => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Explore Image States
  const [exploreImage, setExploreImage] = useState<File | null>(null);
  const [explorePreview, setExplorePreview] = useState<string | null>(null);
  const [latestCategoryId, setLatestCategoryId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exploreInputRef = useRef<HTMLInputElement>(null);

  // 🔹 Fetch latest category to show explore image
  const fetchLatestCategory = async () => {
    try {
      const res = await fetch(`${API_URL}/clinic-categories`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        setLatestCategoryId(latest._id);
        setExplorePreview(latest.exploreImage || null);
      }
    } catch (err) {
      console.error("Failed to fetch latest category:", err);
    }
  };

  useEffect(() => {
    fetchLatestCategory();
  }, []);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image must be less than or equal to 1MB.");
        setCategoryImage(null);
        setPreviewUrl(null);
        return;
      }
      setError("");
      setCategoryImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleExploreImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Explore image must be less than or equal to 1MB.");
        setExploreImage(null);
        return;
      }
      setError("");
      setExploreImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId.trim() || !categoryName.trim() || !categoryImage) {
      setError("Please fill all required fields and select an image.");
      return;
    }

    try {
      const base64Image = await convertToBase64(categoryImage);
      const response = await fetch(`${API_URL}/clinic-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: categoryId.trim(),
          name: categoryName.trim(),
          imageUrl: base64Image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create clinic category.");
        return;
      }

      alert("✅ Clinic Category created successfully!");
      setCategoryId("");
      setCategoryName("");
      setCategoryImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("");
      fetchLatestCategory(); // Refresh to show latest
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  const handleExploreUpload = async () => {
    if (!exploreImage) {
      setError("Please select an image to upload.");
      return;
    }
    if (!latestCategoryId) {
      setError("No category found to update.");
      return;
    }

    try {
      const base64 = await convertToBase64(exploreImage);
      const res = await fetch(
        `${API_URL}/clinic-categories/explore-image/${latestCategoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exploreImage: base64 }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to upload image");
        return;
      }

      alert("✅ Explore image updated successfully!");
      setExploreImage(null);
      setExplorePreview(data.exploreImage);
      if (exploreInputRef.current) exploreInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while uploading.");
    }
  };

  return (
    <div className={styles.container}>
      {/* ========== CREATE CLINIC CATEGORY FORM ========== */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Add New Clinic Category</h2>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="categoryId">Category ID (Unique)</label>
        <input
          type="text"
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={styles.input}
          placeholder="Enter unique category ID"
          required
        />

        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className={styles.input}
          placeholder="Enter clinic category name"
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
          Add Clinic Category
        </button>
      </form>

      {/* ========== EXPLORE IMAGE SECTION ========== */}
      <div className={styles.exploreSection}>
        <h3 className={styles.subtitle}>Update image to explore more category</h3>

        {explorePreview ? (
          <img
            src={explorePreview}
            alt="Explore"
            className={styles.preview}
          />
        ) : (
          <p className={styles.noImage}>No explore image uploaded yet.</p>
        )}

        <input
          ref={exploreInputRef}
          type="file"
          accept="image/*"
          onChange={handleExploreImageChange}
          className={styles.fileInput}
        />

        <button onClick={handleExploreUpload} className={styles.button}>
          Upload Explore Image
        </button>
      </div>

      <MobileNavbar />
    </div>
  );
};

export default CreateClinicCategory;
