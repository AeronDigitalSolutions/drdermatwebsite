"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/Dashboard/createclinic.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

interface ClinicCategory {
  _id: string;
  name: string;
}

const CreateClinic = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    whatsapp: "",
    mapLink: "",
    address: "",
    verified: false,
    trusted: false,
    email: "",
    password: "",
    images: [] as string[],
    category: "",
  });

  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/clinic-categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setNotification("Error fetching clinic categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Multiple image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const readers = fileArray.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          if (file.size > 1024 * 1024) return reject("Image must be ≤ 1MB.");
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((base64Images) => {
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }));
      })
      .catch((err) => alert(err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.images.length) return alert("Please upload at least one image.");
    if (!formData.category) return alert("Please select a category.");

    try {
      const res = await fetch("http://localhost:5000/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create clinic");

      alert("Clinic created successfully!");
      setFormData({
        name: "",
        mobile: "",
        whatsapp: "",
        mapLink: "",
        address: "",
        verified: false,
        trusted: false,
        email: "",
        password: "",
        images: [],
        category: "",
      });
    } catch (error: any) {
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <div className={styles.container}>
      {notification && <p className={styles.notification}>{notification}</p>}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Create Clinic</h2>

        {/* Name & Images */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div className={styles.imagePreviewGrid}>
              {formData.images.map((img, i) => (
                <img key={i} src={img} alt={`preview-${i}`} className={styles.imagePreview} />
              ))}
            </div>
          </div>
        </div>

        {/* Email & Password */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
        </div>

        {/* Other fields */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Mobile</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>WhatsApp</label>
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Google Map Link</label>
            <input type="url" name="mapLink" value={formData.mapLink} onChange={handleChange} />
          </div>
          <div className={styles.fieldCheckboxes}>
            <label>
              <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} /> Verified
            </label>
            <label>
              <input type="checkbox" name="trusted" checked={formData.trusted} onChange={handleChange} /> Trusted
            </label>
          </div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Clinic Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required />
          </div>
        </div>
        <button type="submit" className={styles.submitBtn}>Create Clinic</button>
      </form>
      <MobileNavbar />
    </div>
  );
};

export default CreateClinic;
