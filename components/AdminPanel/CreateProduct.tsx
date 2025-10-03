// components/CreateProduct.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Dashboard/createproduct.module.css";

// ✅ Dynamically import ReactQuill (for rich text)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Category {
  _id: string; // ✅ now using MongoDB _id
  name: string;
  imageUrl: string;
}

const CreateProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    company: "",
    name: "",
    quantity: "",
    price: "",
    discountPrice: "",
    description: "",
  });

  /** ✅ Fetch categories from backend */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dermatbackend.onrender.com/api/categories");
        const data = await res.json();

        // ✅ Expect categories with _id, name, imageUrl
        const validCategories = data
          .map((cat: any) => ({
            _id: cat._id,
            name: cat.name,
            imageUrl: cat.imageUrl,
          }))
          .filter((cat: Category) => cat._id && cat.name);

        setCategories(validCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /** ✅ Handle image uploads (Base64) */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArr = Array.from(files);
      fileArr.forEach((file) => {
        if (file.size > 1024 * 1024) {
          alert("Image size should not exceed 1MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  /** ✅ Remove image from preview */
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** ✅ Handle text and select changes */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Handle description (ReactQuill) */
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  /** ✅ Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    const productData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      images,
    };

    try {
      const response = await fetch("https://dermatbackend.onrender.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const result = await response.json();
      alert("✅ Product created successfully!");
      console.log("Created product:", result);

      // ✅ Reset form
      setFormData({
        category: "",
        company: "",
        name: "",
        quantity: "",
        price: "",
        discountPrice: "",
        description: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("❌ Failed to create product. Check console for details.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add New Product</h2>

      {/* ✅ Image Upload */}
      <div className={styles.row}>
        <label className={styles.imageUpload}>
          <span>Upload Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className={styles.imageInput}
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* ✅ Image Preview */}
      <div className={styles.previewContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.previewWrapper}>
            <img
              src={img}
              alt={`Preview ${index}`}
              className={styles.previewImage}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className={styles.removeBtn}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Category & Company */}
      <div className={styles.row}>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Company</option>
          <option value="dove">Dove</option>
          <option value="patanjali">Patanjali</option>
          <option value="himalaya">Himalaya</option>
          <option value="vlcc">VLCC</option>
        </select>
      </div>

      {/* ✅ Name & Quantity */}
      <div className={styles.row}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      {/* ✅ Price & Discount */}
      <div className={styles.row}>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price"
          value={formData.discountPrice}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      {/* ✅ Description */}
      <div className={styles.richTextWrapper}>
        <ReactQuill
          value={formData.description}
          onChange={handleDescriptionChange}
          className={styles.richText}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          }}
          placeholder="Enter product description..."
        />
      </div>

      {/* ✅ Submit */}
      <button type="submit" className={styles.button}>
        Add Product
      </button>
    </form>
  );
};

export default CreateProduct;
