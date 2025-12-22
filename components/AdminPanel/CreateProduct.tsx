"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Dashboard/createproduct.module.css";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CreateProduct() {
  /* ================= AUTO SKU ================= */
  const [productSKU] = useState(`SKU-${Date.now().toString().slice(-6)}`);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    productName: "",
    category: "",
    subCategory: "",

    description: "",
    ingredients: "",
    targetConcerns: "",
    usageInstructions: "",

    netQuantity: "",
    mrpPrice: "",
    discountedPrice: "",
    discountPercent: "",
    taxIncluded: true,

    expiryDate: "",
    manufacturerName: "",
    licenseNumber: "",
    packagingType: "",

    productImages: [] as string[],
    productShortVideo: "",

    benefits: "",
    rating: "",
    shippingTime: "",
    returnPolicy: "",
    howToUseVideo: "",
    certifications: "",

    gender: "Unisex",
    skinHairType: "",
    barcode: "",

    availabilityStatus: "Available",
    stockStatus: "In Stock",
    reviews: "",

    brandName: "",
    checkAvailability: true,
    dermatologistRecommended: false,
    activeStatus: true,

    productURL: "",
    buyNow: true,
  });

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          productImages: [...prev.productImages, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productSKU,
      ...form,
    };

    console.log("✅ FINAL PRODUCT PAYLOAD", payload);
    alert("Product saved successfully (check console)");
  };

  /* ================= UI ================= */
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Product</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* ===== BASIC INFO ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>

          <div className={styles.field}>
            <label className={styles.label}>Product SKU (Auto)</label>
            <input className={styles.readonlyInput} value={productSKU} disabled />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Product Name</label>
            <input className={styles.input} name="productName" onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Product Category</label>
            <input className={styles.input} name="category" onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Sub-Category</label>
            <input className={styles.input} name="subCategory" onChange={handleChange} />
          </div>
        </div>

        {/* ===== DESCRIPTION ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Description</h3>

          <div className={styles.fullField}>
            <label className={styles.label}>Product Description</label>
            <ReactQuill
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              modules={quillModules}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ingredients (Key)</label>
            <input className={styles.input} name="ingredients" onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Target Concerns</label>
            <input className={styles.input} name="targetConcerns" onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Usage Instructions</label>
            <input className={styles.input} name="usageInstructions" onChange={handleChange} />
          </div>
        </div>

        {/* ===== PRICING ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Pricing</h3>

          <input className={styles.input} name="netQuantity" placeholder="Net Quantity" onChange={handleChange} />
          <input className={styles.input} name="mrpPrice" placeholder="MRP Price" onChange={handleChange} />
          <input className={styles.input} name="discountedPrice" placeholder="Discounted Price" onChange={handleChange} />
          <input className={styles.input} name="discountPercent" placeholder="Discount (%)" onChange={handleChange} />

          <select className={styles.select} name="taxIncluded" onChange={handleChange}>
            <option value="true">Tax Included – Yes</option>
            <option value="false">Tax Included – No</option>
          </select>
        </div>

        {/* ===== COMPLIANCE ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Compliance & Packaging</h3>

          <input type="date" className={styles.input} name="expiryDate" onChange={handleChange} />
          <input className={styles.input} name="manufacturerName" placeholder="Manufacturer Name" onChange={handleChange} />
          <input className={styles.input} name="licenseNumber" placeholder="License / FSSAI No." onChange={handleChange} />
          <input className={styles.input} name="packagingType" placeholder="Packaging Type" onChange={handleChange} />
        </div>

        {/* ===== MEDIA ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Media</h3>

          <input type="file" multiple className={styles.fileInput} onChange={handleImageUpload} />
          <input className={styles.input} name="productShortVideo" placeholder="Product Short Video URL" onChange={handleChange} />
          <input className={styles.input} name="howToUseVideo" placeholder="How to Use Video (Optional)" onChange={handleChange} />
        </div>

        {/* ===== META ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Meta & Controls</h3>

          <input className={styles.input} name="benefits" placeholder="Benefits Highlighted" onChange={handleChange} />
          <input className={styles.input} name="rating" placeholder="Product Rating" onChange={handleChange} />
          <input className={styles.input} name="shippingTime" placeholder="Shipping Time" onChange={handleChange} />
          <input className={styles.input} name="returnPolicy" placeholder="Return Policy" onChange={handleChange} />
          <input className={styles.input} name="certifications" placeholder="Certifications" onChange={handleChange} />
          <input className={styles.input} name="brandName" placeholder="Brand Name" onChange={handleChange} />
          <input className={styles.input} name="barcode" placeholder="Product SKU / Barcode" onChange={handleChange} />

          <select className={styles.select} name="gender" onChange={handleChange}>
            <option>Unisex</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input className={styles.input} name="skinHairType" placeholder="Skin Type / Hair Type" onChange={handleChange} />

          <select className={styles.select} name="availabilityStatus" onChange={handleChange}>
            <option>Available</option>
            <option>Unavailable</option>
          </select>

          <select className={styles.select} name="stockStatus" onChange={handleChange}>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>

          <textarea className={styles.input} name="reviews" placeholder="Product Reviews" onChange={handleChange} />
          <input className={styles.input} name="productURL" placeholder="Product URL" onChange={handleChange} />
        </div>

        {/* ===== SWITCHES ===== */}
        <div className={styles.switchRow}>
          <label><input type="checkbox" name="checkAvailability" checked={form.checkAvailability} onChange={handleChange} /> Check Product Availability</label>
          <label><input type="checkbox" name="dermatologistRecommended" checked={form.dermatologistRecommended} onChange={handleChange} /> Dermatologist Recommended</label>
          <label><input type="checkbox" name="activeStatus" checked={form.activeStatus} onChange={handleChange} /> Active</label>
          <label><input type="checkbox" name="buyNow" checked={form.buyNow} onChange={handleChange} /> Buy Now / Add to Cart</label>
        </div>

        <button className={styles.submitBtn}>Save Product</button>
      </form>
    </div>
  );
}
