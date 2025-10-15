"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/Dashboard/createproduct.module.css";

// ✅ Load ReactQuill dynamically
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Category {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface Company {
  _id: string;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const CreateProduct: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies] = useState<Company[]>([
    { _id: "dove", name: "Dove" },
    { _id: "patanjali", name: "Patanjali" },
    { _id: "himalaya", name: "Himalaya" },
    { _id: "vlcc", name: "VLCC" },
  ]);
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

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        const valid = data
          .filter((cat: any) => cat._id && cat.name)
          .map((cat: any) => ({
            _id: cat._id,
            name: cat.name,
            imageUrl: cat.imageUrl,
          }));
        setCategories(valid);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Gallery image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 1024 * 1024) {
        alert("Image size should not exceed 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) =>
    setFormData((prev) => ({ ...prev, description: value }));

  // ✅ ReactQuill modules with Base64 image upload & auto styling
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
                const quill = this.quill;
                const range = quill.getSelection(true);

                // ✅ Insert image
                quill.insertEmbed(range.index, "image", base64);

                // ✅ Add class after insertion
                setTimeout(() => {
                  const [leaf] = quill.getLeaf(range.index);
                  const imgNode = leaf?.domNode as HTMLImageElement | undefined;
                  if (imgNode && imgNode.tagName === "IMG") {
                    imgNode.classList.add(styles.descriptionImage); // add CSS module class
                  }
                }, 100);

                quill.setSelection(range.index + 1);
              };
              reader.readAsDataURL(file);
            };
          },
        },
      },
    };
  }, []);

  // ✅ Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) return alert("Please select a category");
    if (!formData.company) return alert("Please select a company");
    if (images.length === 0) return alert("Please upload at least one image");

    const productData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      images,
    };

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const result = await res.json();
      alert("✅ Product created successfully!");
      console.log("Created product:", result);

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
    } catch (err) {
      console.error("Error creating product:", err);
      alert("❌ Failed to create product. Check console for details.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add New Product</h2>

      {/* Gallery Upload */}
      <div className={styles.row}>
        <label className={styles.imageUpload}>
          <span>Upload Product Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className={styles.imageInput}
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Gallery Preview */}
      <div className={styles.previewContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.previewWrapper}>
            <img src={img} alt={`Preview ${index}`} className={styles.previewImage} />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemoveImage(index)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Category & Company */}
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
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name & Quantity */}
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

      {/* Price & Discount */}
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

      {/* Description */}
      <div className={styles.richTextWrapper}>
        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={handleDescriptionChange}
          modules={modules}
          className={styles.richText}
          placeholder="Enter product description... (you can add images)"
        />
      </div>

      {/* Live Description Preview */}
      {formData.description && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>Live Description Preview:</h3>
          <div
            className={styles.descriptionPreview}
            dangerouslySetInnerHTML={{ __html: formData.description }}
          />
        </div>
      )}

      <button type="submit" className={styles.button}>
        Add Product
      </button>
    </form>
  );
};

export default CreateProduct;
