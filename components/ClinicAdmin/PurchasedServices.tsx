"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function PurchasedServices() {
  const [items, setItems] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clinicId = Cookies.get("clinicId");

  /* Fetch purchased services */
  const loadServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/clinics/${clinicId}/purchased-services`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading purchased services:", err);
      setError("Failed to load purchased services");
    }
  };

  /* Fetch doctors */
  const loadDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error loading doctors:", err);
    }
  };

  useEffect(() => {
    loadDoctors();
    loadServices().finally(() => setLoading(false));
  }, []);

  /* Assign doctor */
  const assignDoctor = async (serviceEntryId: string, doctorId: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/clinics/purchased-services/${serviceEntryId}/assign-doctor`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId }),
        }
      );

      if (!res.ok) return alert("Failed to assign doctor");

      await loadServices();
      alert("Doctor assigned successfully");
    } catch (err) {
      console.error("Assign doctor error:", err);
    }
  };

  if (loading) return <p>Loading purchased services...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Purchased Services</h2>

      {items.length === 0 ? (
        <p style={styles.noData}>No purchased services found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Assign</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p: any, index: number) => (
              <tr key={p._id || index} style={styles.tr}>
                <td style={styles.td}>{p.serviceId?.serviceName}</td>
                <td style={styles.td}>{p.userId?.name}</td>
                <td style={styles.td}>{p.quantity}</td>
                <td style={styles.td}>₹{p.totalPrice}</td>

                {/* Already assigned doctor */}
                <td style={styles.td}>
                  {p.assignedDoctor
                    ? `${p.assignedDoctor.title} ${p.assignedDoctor.firstName}`
                    : "Not Assigned"}
                </td>

                {/* Assign dropdown */}
                <td style={styles.td}>
                  <select
                    onChange={(e) => assignDoctor(p._id, e.target.value)}
                    defaultValue=""
                    style={styles.select}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.title} {doc.firstName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* Styling */
const styles: any = {
  container: {
    padding: "25px",
    background: "#f9fafc",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  heading: { fontSize: "24px", fontWeight: "600", marginBottom: "20px" },
  noData: { fontSize: "16px", color: "#777" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
  th: {
    background: "#4a90e2",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },
  tr: { transition: "background 0.2s" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
  select: {
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
};
