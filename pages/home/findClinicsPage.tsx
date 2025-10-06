"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClinicCard from "@/components/Layout/clinicCard";
import SideCategories from "@/components/Layout/SideCategories";
import styles from "@/styles/pages/findClinicsPage.module.css";
import Footer from "@/components/Layout/Footer";
import Topbar from "@/components/Layout/Topbar";
import MobileNavbar from "@/components/Layout/MobileNavbar";

const ITEMS_PER_PAGE = 6;

// ✅ Backend API base (local or deployed)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface ClinicCategory {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Clinic {
  _id: string;
  name: string;
  address: string;
  category?: ClinicCategory;
  [key: string]: any;
}

const FindClinicsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [categories, setCategories] = useState<ClinicCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/clinic-categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories");
    }
  };

  // Fetch clinics
  const fetchClinics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clinics`);
      if (!res.ok) throw new Error("Failed to fetch clinics");
      const data = await res.json();
      setClinics(data);
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
      setError("Failed to load clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchClinics();
  }, []);

  useEffect(() => {
    setSelectedCategoryId(categoryQuery);
  }, [categoryQuery]);

  // Filter clinics by category and search
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const matchCategory = selectedCategoryId
        ? clinic.category?._id === selectedCategoryId
        : true;

      const matchSearch =
        clinic.name.toLowerCase().includes(search.toLowerCase()) ||
        clinic.address.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [clinics, selectedCategoryId, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClinics.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClinics = filteredClinics.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <>
      <Topbar />

      {/* Mobile Categories Slider */}
      <div className={styles.mobileCategories}>
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`${styles.mobileCategoryItem} ${
              selectedCategoryId === cat._id ? styles.activeCategory : ""
            }`}
            onClick={() => setSelectedCategoryId(cat._id)}
          >
            <img src={cat.imageUrl} alt={cat.name} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          <SideCategories
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
          />
        </aside>

        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search Clinics, Tests, Products"
                className={styles.searchBarSC}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.searchButton}>🔍</button>
            </div>
          </div>

          {loading ? (
            <p className={styles.status}>Loading clinics...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : paginatedClinics.length === 0 ? (
            <p className={styles.status}>No clinics found.</p>
          ) : (
            paginatedClinics.map((clinic) => <ClinicCard key={clinic._id} clinic={clinic} />)
          )}

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`${styles.pageButton} ${currentPage === idx + 1 ? styles.active : ""}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      <MobileNavbar />
      <Footer />
    </>
  );
};

export default FindClinicsPage;
