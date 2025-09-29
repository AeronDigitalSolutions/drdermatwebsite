"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/clinicdashboard/clinicservices.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ClinicCategory {
  _id: string;
  categoryId: string;
  name: string;
  imageUrl: string;
}

interface JwtPayload {
  id: string; // clinicId from token
  role: string;
}

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

  const SERVICE_URL = "http://localhost:5000/api/services";
  const CATEGORY_URL = "http://localhost:5000/api/clinic-categories";

  // Get clinicId from token
  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Token:", token);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("Decoded token:", decoded);
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

  // Fetch clinic categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_URL);
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

  // Convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

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

      // Try both backend routes (query param and path param)
      const urlsToTry = [
        SERVICE_URL, // POST normally works on main endpoint
      ];

      let created = false;
      for (const url of urlsToTry) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (res.ok) {
            created = true;
            setNotification("✅ Service created successfully!");
            // Reset form
            setServiceName("");
            setSelectedCategories([]);
            setImages([]);
            setImagePreviews([]);
            setDescription("");
            setPrice("");
            setDiscountedPrice("");
            break;
          } else {
            console.warn("Backend error:", data.message);
          }
        } catch (err) {
          console.warn("Failed to POST to URL:", url, err);
        }
      }

      if (!created) setNotification("Failed to create service ❌");
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
        <label className={styles.label}>Service Name</label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className={styles.input}
          required
        />

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
                      setSelectedCategories((prev) => prev.filter((cid) => cid !== id))
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
            <img key={idx} src={src} alt={`preview-${idx}`} className={styles.imagePreview} />
          ))}
        </div>

        <label className={styles.label}>Description</label>
        <div className={styles.quillContainer}>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

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
