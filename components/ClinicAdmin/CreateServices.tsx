"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/clinicdashboard/clinicservices.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "react-quill/dist/quill.snow.css";

// ✅ Load ReactQuill dynamically (Next.js SSR safe)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ClinicCategory {
  _id: string;
  categoryId: string;
  name: string;
  imageUrl: string;
}

interface JwtPayload {
  id: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const CreateServices = () => {
  const [serviceName, setServiceName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("");

  // ✅ Decode token to get clinic ID
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded?.id) setClinicId(decoded.id);
        else setNotification("Invalid token: Clinic ID missing");
      } catch (err) {
        console.error("Error decoding token:", err);
        setNotification("Failed to decode token");
      }
    } else {
      setNotification("Token not found. Please login again.");
    }
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic-categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: ClinicCategory[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setNotification("Error fetching categories ❌");
      }
    };
    fetchCategories();
  }, []);

  // ✅ Convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  // ✅ Handle service image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // ✅ Handle description image upload (inside Quill editor)
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: function handleImage(this: any) {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();

            input.onchange = () => {
              const file = input.files?.[0];
              if (!file) return;
              if (file.size > 1024 * 1024) {
                alert("Image size should not exceed 1MB.");
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                const quill = this.quill; // direct access to editor instance
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", base64);
                quill.setSelection(range.index + 1);
              };
              reader.readAsDataURL(file);
            };
          },
        },
      },
    };
  }, []);

  // ✅ Submit new service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicId) {
      setNotification("Clinic ID missing. Please log in again.");
      return;
    }
    if (selectedCategories.length === 0) {
      setNotification("Please select at least one category.");
      return;
    }

    try {
      const base64Images = await Promise.all(images.map((f) => toBase64(f)));

      const payload = {
        serviceName,
        clinic: clinicId,
        categories: selectedCategories,
        images: base64Images,
        description,
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      };

      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification("✅ Service created successfully!");
        // Reset form
        setServiceName("");
        setSelectedCategories([]);
        setImages([]);
        setImagePreviews([]);
        setDescription("");
        setPrice("");
        setDiscountedPrice("");
      } else {
        setNotification(data.message || "Failed to create service ❌");
      }
    } catch (err) {
      console.error("Error creating service:", err);
      setNotification("Error creating service ❌");
    }
  };

  return (
    <div className={styles.container}>
      {notification && <div className={styles.notification}>{notification}</div>}

      <h2 className={styles.title}>Create New Service</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ✅ Service Name */}
        <label className={styles.label}>Service Name</label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className={styles.input}
          required
        />

        {/* ✅ Selected categories */}
        {selectedCategories.length > 0 && (
          <div className={styles.selectedList}>
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c._id === id);
              return (
                <span key={id} className={styles.selectedTag}>
                  {cat?.name}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((cid) => cid !== id)
                      )
                    }
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* ✅ Category selection */}
        <label className={styles.label}>Categories</label>
        <select
          multiple
          value={selectedCategories}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
            setSelectedCategories(values);
          }}
          className={styles.select}
          required
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* ✅ Upload service images */}
        <label className={styles.label}>Service Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className={styles.input}
        />
        <div className={styles.imagePreviewContainer}>
          {imagePreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className={styles.imagePreview}
            />
          ))}
        </div>

        {/* ✅ Description with image upload */}
        <label className={styles.label}>Description</label>
        <div className={styles.quillContainer}>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={modules}
            placeholder="Enter service description... You can add text, bullets, and images."
          />
        </div>

        {/* ✅ Live description preview */}
        {description && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>Live Description Preview:</h3>
            <div
              className={styles.descriptionPreview}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* ✅ Price fields */}
        <label className={styles.label}>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.input}
          required
        />

        <label className={styles.label}>Discounted Price</label>
        <input
          type="number"
          value={discountedPrice}
          onChange={(e) => setDiscountedPrice(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Create Service
        </button>
      </form>
    </div>
  );
};

export default CreateServices;
