import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/dashboard.module.css";
import { FiUsers, FiHome, FiBox } from "react-icons/fi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    admins: 0,
    clinics: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const resAdmins = await fetch("http://localhost:5000/api/admins");
        if (!resAdmins.ok) throw new Error("Failed to fetch admins");
        const admins = await resAdmins.json();

        const resClinics = await fetch("http://localhost:5000/api/clinics");
        if (!resClinics.ok) throw new Error("Failed to fetch clinics");
        const clinics = await resClinics.json();

        const resProducts = await fetch("http://localhost:5000/api/products");
        if (!resProducts.ok) throw new Error("Failed to fetch products");
        const products = await resProducts.json();

        setCounts({
          admins: Array.isArray(admins) ? admins.length : 0,
          clinics: Array.isArray(clinics) ? clinics.length : 0,
          products: Array.isArray(products) ? products.length : 0,
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { title: "Total Admins", value: counts.admins, icon: <FiUsers size={28} />, color: "#3b82f6" },
    { title: "Total Clinics", value: counts.clinics, icon: <FiHome size={28} />, color: "#10b981" },
    { title: "Total Products", value: counts.products, icon: <FiBox size={28} />, color: "#f59e0b" },
  ];

  if (loading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Dashboard Overview</h2>
      <div className={styles.cardGrid}>
        {stats.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconWrapper} style={{ backgroundColor: item.color + "20" }}>
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div>
              <p className={styles.cardValue}>{item.value}</p>
              <p className={styles.cardTitle}>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
