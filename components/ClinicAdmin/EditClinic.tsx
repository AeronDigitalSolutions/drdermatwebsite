"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/clinicdashboard/editprofile.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const CLINIC_ID = "replace_with_real_id"; // TODO: Replace with actual clinic id
const BASE_URL = "https://dermatbackend.onrender.com/api/clinics";

const EditClinic = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    whatsapp: "",
    mapLink: "",
    address: "",
    verified: false,
    trusted: false,
    image: null as File | null,
    imagePreview: "",
  });

  const [imageError, setImageError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  // ✅ Fetch clinic data from backend
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${CLINIC_ID}`);
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          ...data,
          imagePreview: data.image || "",
        }));
      } catch (err) {
        console.error("Error fetching clinic:", err);
      }
    };

    fetchClinicData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setImageError("Image must be ≤ 1MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
      setImageError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let base64Image = formData.imagePreview;

    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        base64Image = reader.result as string;

        await updateClinic(base64Image);
      };
      reader.readAsDataURL(formData.image);
    } else {
      await updateClinic(base64Image);
    }
  };

  const updateClinic = async (base64Image: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${CLINIC_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: base64Image }),
      });

      const data = await res.json();
      console.log("✅ Updated:", data);
      setIsEditable(false);
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  return (
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Clinic Details</h2>

        {/* Name + Image */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditable}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={!isEditable}
            />
            {imageError && <p className={styles.error}>{imageError}</p>}
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="preview"
                className={styles.imagePreview}
              />
            )}
          </div>
        </div>

        {/* Mobile & WhatsApp */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Mobile No</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditable}
              required
            />
          </div>
          <div className={styles.field}>
            <label>WhatsApp No</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
        </div>

        {/* Map & Flags */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Google Map Link</label>
            <input
              type="url"
              name="mapLink"
              value={formData.mapLink}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
          <div className={styles.fieldCheckboxes}>
            <label>
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
                disabled={!isEditable}
              />
              Verified
            </label>
            <label>
              <input
                type="checkbox"
                name="trusted"
                checked={formData.trusted}
                onChange={handleChange}
                disabled={!isEditable}
              />
              Trusted
            </label>
          </div>
        </div>

        {/* Address */}
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              disabled={!isEditable}
            />
          </div>
        </div>

        {isEditable ? (
          <button type="submit" className={styles.submitBtn}>
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditable(true)}
            className={styles.editBtn}
          >
            Edit Clinic
          </button>
        )}
      </form>

      <MobileNavbar />
    </div>
  );
};

export default EditClinic;
