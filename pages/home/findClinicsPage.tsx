"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation"; // to read query params
import ClinicCard from "@/components/Layout/clinicCard";
import SideCategories from "@/components/Layout/SideCategories";
import styles from "@/styles/pages/findClinicsPage.module.css";
import Footer from "@/components/Layout/Footer";
import Topbar from "@/components/Layout/Topbar";
import MobileNavbar from './../../components/Layout/MobileNavbar';

const ITEMS_PER_PAGE = 6;

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

  useEffect(() => {
    fetchCategories();
    fetchClinics();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/clinic-categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/clinics");
      if (!res.ok) throw new Error("Failed to fetch clinics");
      const data = await res.json();
      setClinics(data);
    } catch (err) {
      setError("Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCategoryId(categoryQuery);
  }, [categoryQuery]);

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
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <SideCategories
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
          />
        </aside>

        <main className={styles.main}>
          {/* Updated search bar */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search Clinics, Tests, Products"
              className={styles.searchBarSC}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className={styles.searchButton}>
              🔍
            </button>
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
      <MobileNavbar/>
      <Footer />
    </>
  );
};

export default FindClinicsPage;
