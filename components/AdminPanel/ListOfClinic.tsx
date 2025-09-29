"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/listofclinic.module.css";

type ClinicCategory = {
  _id: string;
  name: string;
};

type Clinic = {
  _id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  mapLink: string;
  address: string;
  verified: boolean;
  trusted: boolean;
  images: string[];
  category?: ClinicCategory;
};

function ListOfClinic() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editClinic, setEditClinic] = useState<Clinic | null>(null);

  // ✅ Lightbox state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchClinics();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClinics(filtered);
  }, [search, clinics]);

  const fetchClinics = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/clinics");
      const data = await response.json();
      setClinics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/clinic-categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this clinic?")) return;
    try {
      await fetch(`http://localhost:5000/api/clinics/${id}`, {
        method: "DELETE",
      });
      setClinics((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete clinic.");
    }
  };

  const openEditModal = (clinic: Clinic) => {
    setEditClinic(JSON.parse(JSON.stringify(clinic))); // deep copy
    setShowModal(true);
  };

  const closeModal = () => {
    setEditClinic(null);
    setShowModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editClinic) return;
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
        setEditClinic({
          ...editClinic,
          images: [...editClinic.images, ...base64Images],
        });
      })
      .catch((err) => alert(err));
  };

  const handleRemoveImage = (index: number) => {
    if (!editClinic) return;
    setEditClinic({
      ...editClinic,
      images: editClinic.images.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClinic) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/clinics/${editClinic._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editClinic),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update clinic");

      setClinics((prev) =>
        prev.map((c) => (c._id === editClinic._id ? result : c))
      );
      alert("Clinic updated successfully!");
      closeModal();
    } catch (err: any) {
      alert(err.message || "Update failed.");
    }
  };

  // ✅ Open lightbox gallery
  const openGallery = (images: string[], index: number = 0) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
    setGalleryImages([]);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>List of Clinics</h2>

      <input
        type="text"
        placeholder="Search by clinic name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchBar}
      />

      {loading ? (
        <p className={styles.status}>Loading clinics...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredClinics.length === 0 ? (
        <p className={styles.status}>No clinics found.</p>
      ) : (
        <div className={styles.clinicGrid}>
          {filteredClinics.map((clinic) => {
            const images = clinic.images || [];
            const mainImage = images[0] || "https://via.placeholder.com/200";
            const thumbnails = images.slice(1, 4);
            const extraCount = images.length > 4 ? images.length - 4 : 0;

            return (
              <div key={clinic._id} className={styles.card}>
                {/* ✅ Image Gallery with +N overlay */}
                <div className={styles.imageGallery}>
                  <div className={styles.thumbnails}>
                    {thumbnails.map((img, i) => {
                      const isLastThumb =
                        i === thumbnails.length - 1 && extraCount > 0;
                      return (
                        <div
                          key={i}
                          className={styles.thumbWrapper}
                          onClick={() => openGallery(images, i + 1)}
                        >
                          <img
                            src={
                              img || "https://via.placeholder.com/80?text=No+Image"
                            }
                            alt={`thumb-${i}`}
                            className={styles.thumbnail}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/80?text=No+Image";
                            }}
                          />
                          {isLastThumb && (
                            <div
                              className={styles.moreOverlay}
                              onClick={() => openGallery(images, i + 1)}
                            >
                              +{extraCount}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={styles.mainImageWrapper}
                    onClick={() => openGallery(images, 0)}
                  >
                    <img
                      src={mainImage}
                      alt={clinic.name}
                      className={styles.mainImage}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                  </div>
                </div>

                {/* ✅ Clinic Info */}
                <div className={styles.content}>
                  <h3>{clinic.name}</h3>
                  <p>
                    <strong>Category:</strong>{" "}
                    {clinic.category?.name || "Not assigned"}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {clinic.mobile}
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> {clinic.whatsapp}
                  </p>
                  <p>
                    <strong>Address:</strong> {clinic.address}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        clinic.verified ? styles.verified : styles.unverified
                      }
                    >
                      {clinic.verified ? "Verified" : "Unverified"}
                    </span>
                    ,{" "}
                    <span
                      className={
                        clinic.trusted ? styles.trusted : styles.notTrusted
                      }
                    >
                      {clinic.trusted ? "Trusted" : "Not Trusted"}
                    </span>
                  </p>
                  {clinic.mapLink && (
                    <a
                      href={clinic.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapLink}
                    >
                      View on Google Maps
                    </a>
                  )}

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.updateBtn}
                      onClick={() => openEditModal(clinic)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(clinic._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Lightbox Modal */}
      {showGallery && (
        <div className={styles.lightboxOverlay} onClick={closeGallery}>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.lightboxClose} onClick={closeGallery}>
              ✕
            </button>
            <button className={styles.lightboxPrev} onClick={prevImage}>
              ‹
            </button>
            <img
              src={galleryImages[currentImageIndex]}
              alt={`gallery-${currentImageIndex}`}
              className={styles.lightboxImage}
            />
            <button className={styles.lightboxNext} onClick={nextImage}>
              ›
            </button>
          </div>
        </div>
      )}

      {/* ✅ Edit Clinic Modal */}
      {showModal && editClinic && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Clinic</h2>
            <form onSubmit={handleUpdate} className={styles.modalForm}>
              <label>
                Name:
                <input
                  type="text"
                  value={editClinic.name}
                  onChange={(e) =>
                    setEditClinic({ ...editClinic, name: e.target.value })
                  }
                />
              </label>
              <label>
                Mobile:
                <input
                  type="text"
                  value={editClinic.mobile}
                  onChange={(e) =>
                    setEditClinic({ ...editClinic, mobile: e.target.value })
                  }
                />
              </label>
              <label>
                WhatsApp:
                <input
                  type="text"
                  value={editClinic.whatsapp}
                  onChange={(e) =>
                    setEditClinic({ ...editClinic, whatsapp: e.target.value })
                  }
                />
              </label>
              <label>
                Address:
                <textarea
                  value={editClinic.address}
                  onChange={(e) =>
                    setEditClinic({ ...editClinic, address: e.target.value })
                  }
                />
              </label>
              <label>
                Category:
                <select
                  value={editClinic.category?._id || ""}
                  onChange={(e) =>
                    setEditClinic({
                      ...editClinic,
                      category: { _id: e.target.value, name: "" },
                    })
                  }
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* ✅ Image Management */}
              <label>
                Clinic Images:
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
              <div className={styles.imagePreviewGrid}>
                {editClinic.images.map((img, i) => (
                  <div key={i} className={styles.previewWrapper}>
                    <img
                      src={img}
                      alt={`preview-${i}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOfClinic;
