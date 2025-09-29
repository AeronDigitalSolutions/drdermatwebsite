import React, { useState, useRef } from "react";
import styles from "@/styles/Dashboard/createcategory.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const CreateClinicCategory = () => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId.trim()) {
      setError("Category ID is required.");
      return;
    }

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
      const response = await fetch("http://localhost:5000/api/clinic-categories", {
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

      // Reset form
      setCategoryId("");
      setCategoryName("");
      setCategoryImage(null);
      setPreviewUrl(null);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("✅ Clinic Category created successfully!");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.container}>
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

      <MobileNavbar />
    </div>
  );
};

export default CreateClinicCategory;
