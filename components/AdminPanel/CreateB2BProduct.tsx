"use client";

import React, { useState } from "react";
import styles from "@/styles/Dashboard/createb2bproduct.module.css";

export default function CreateB2BProduct() {
  const [sku] = useState(`B2B-${Date.now().toString().slice(-6)}`);

  const [form, setForm] = useState({
    productName: "",
    category: "",
    subCategory: "",
    hsnCode: "",
    brandName: "",
    packSize: "",
    pricePerUnit: "",
    bulkPriceTier: "",
    moq: "",
    stockAvailable: "",
    expiryDate: "",

    description: "",
    ingredients: "",
    usageInstructions: "",
    treatmentIndications: "",
    certifications: "",

    manufacturerName: "",
    licenseNumber: "",
    mrp: "",
    discountedPrice: "",
    gst: "",
    taxIncluded: true,

    countryOfOrigin: "",
    shippingWeight: "",
    dispatchTime: "",
    returnPolicy: "",
    howToUseVideo: "",

    productImages: "",
    msds: "",
    customerReviews: "",
    relatedProducts: "",
    promotionalTags: "",

    addToCart: true,
    inAppChat: true,
    chooseFromList: "",
    issueDescription: "",

    chatOption: true,
    tollFreeNumber: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ B2B PRODUCT PAYLOAD", { sku, ...form });
    alert("B2B Product saved successfully (check console)");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create B2B Product</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>

          <div className={styles.field}>
            <label className={styles.label}>SKU / Product Code</label>
            <input className={styles.readonlyInput} value={sku} disabled />
          </div>

          <input className={styles.input} name="productName" placeholder="Product Name" onChange={handleChange} />
          <input className={styles.input} name="category" placeholder="Product Category" onChange={handleChange} />
          <input className={styles.input} name="subCategory" placeholder="Sub-Category" onChange={handleChange} />
          <input className={styles.input} name="hsnCode" placeholder="HSN Code" onChange={handleChange} />
          <input className={styles.input} name="brandName" placeholder="Brand Name" onChange={handleChange} />
        </div>

        {/* PRICING */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Pricing & Quantity</h3>

          <input className={styles.input} name="packSize" placeholder="Pack Size / Quantity" onChange={handleChange} />
          <input className={styles.input} name="pricePerUnit" placeholder="Price per Unit" onChange={handleChange} />
          <input className={styles.input} name="bulkPriceTier" placeholder="Bulk Price Tier" onChange={handleChange} />
          <input className={styles.input} name="moq" placeholder="MOQ" onChange={handleChange} />
          <input className={styles.input} name="stockAvailable" placeholder="Stock Available" onChange={handleChange} />
          <input type="date" className={styles.input} name="expiryDate" onChange={handleChange} />
        </div>

        {/* DESCRIPTION */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Product Details</h3>

          <textarea className={styles.textarea} name="description" placeholder="Product Description" onChange={handleChange} />
          <textarea className={styles.textarea} name="ingredients" placeholder="Key Ingredients / Components" onChange={handleChange} />
          <textarea className={styles.textarea} name="usageInstructions" placeholder="Usage Instructions" onChange={handleChange} />
          <textarea className={styles.textarea} name="treatmentIndications" placeholder="Treatment Indications" onChange={handleChange} />
          <input className={styles.input} name="certifications" placeholder="Certifications" onChange={handleChange} />
        </div>

        {/* MANUFACTURER */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Manufacturer & Tax</h3>

          <input className={styles.input} name="manufacturerName" placeholder="Manufacturer Name" onChange={handleChange} />
          <input className={styles.input} name="licenseNumber" placeholder="License Number" onChange={handleChange} />
          <input className={styles.input} name="mrp" placeholder="MRP (if applicable)" onChange={handleChange} />
          <input className={styles.input} name="discountedPrice" placeholder="Discounted Price (B2B)" onChange={handleChange} />
          <input className={styles.input} name="gst" placeholder="GST %" onChange={handleChange} />

          <select className={styles.select} name="taxIncluded" onChange={handleChange}>
            <option value="true">Tax Included</option>
            <option value="false">Tax Excluded</option>
          </select>
        </div>

        {/* LOGISTICS */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Logistics</h3>

          <input className={styles.input} name="countryOfOrigin" placeholder="Country of Origin" onChange={handleChange} />
          <input className={styles.input} name="shippingWeight" placeholder="Shipping Weight" onChange={handleChange} />
          <input className={styles.input} name="dispatchTime" placeholder="Dispatch Time" onChange={handleChange} />
          <input className={styles.input} name="returnPolicy" placeholder="Return Policy" onChange={handleChange} />
          <input className={styles.input} name="howToUseVideo" placeholder="How to Use Video / Manual" onChange={handleChange} />
        </div>

        {/* MEDIA & SUPPORT */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Media & Support</h3>

          <input className={styles.input} name="productImages" placeholder="Product Images (Upload / URL)" onChange={handleChange} />
          <input className={styles.input} name="msds" placeholder="MSDS / Product Datasheet" onChange={handleChange} />
          <textarea className={styles.textarea} name="customerReviews" placeholder="Customer Ratings / Reviews" onChange={handleChange} />
          <input className={styles.input} name="relatedProducts" placeholder="Related Products / Add-ons" onChange={handleChange} />
          <input className={styles.input} name="promotionalTags" placeholder="Promotional Tags" onChange={handleChange} />
        </div>

        {/* ACTIONS */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Actions & Contact</h3>

          <div className={styles.switchRow}>
            <label><input type="checkbox" name="addToCart" checked={form.addToCart} onChange={handleChange} /> Add to Cart</label>
            <label><input type="checkbox" name="inAppChat" checked={form.inAppChat} onChange={handleChange} /> In-App Chat with Supplier</label>
            <label><input type="checkbox" name="chatOption" checked={form.chatOption} onChange={handleChange} /> Chat Option</label>
          </div>

          <input className={styles.input} name="chooseFromList" placeholder="Choose from list" onChange={handleChange} />
          <textarea className={styles.textarea} name="issueDescription" placeholder="Describe your issue in detail" onChange={handleChange} />
          <input className={styles.input} name="tollFreeNumber" placeholder="Toll Free Number" onChange={handleChange} />
          <input className={styles.input} name="email" placeholder="Write an Email" onChange={handleChange} />
        </div>

        <button className={styles.submitBtn}>Submit B2B Product</button>
      </form>
    </div>
  );
}
