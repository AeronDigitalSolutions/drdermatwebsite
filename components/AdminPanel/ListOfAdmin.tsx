"use client";
import { API_URL } from "@/config/api";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/listofadmin.module.css";

interface Admin {
  _id: string;
  empId: string;
  name: string;
  email: string;
  phone: string; // Contact No.
  role: "admin" | "superadmin" | "manager";
  createdAt: string;
}

// const API_URL =
//   process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function ListOfAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_URL}/admins`);
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await fetch(`${API_URL}/admins/${id}`, { method: "DELETE" });
      fetchAdmins();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (admin: Admin) => {
    setCurrentAdmin(admin);
    setEditModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentAdmin) return;
    setCurrentAdmin({ ...currentAdmin, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;

    try {
      const res = await fetch(`${API_URL}/admins/${currentAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentAdmin.name,
          email: currentAdmin.email,
          number: currentAdmin.phone,
          role: currentAdmin.role,
        }),
      });

      if (res.ok) {
        setEditModal(false);
        setCurrentAdmin(null);
        fetchAdmins();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading admins…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Directory</h1>

      {admins.length === 0 ? (
        <div className={styles.noData}>No admins found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className={styles.id}>{admin.empId}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.phone}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[admin.role]
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editModal && currentAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Admin</h2>

            <form onSubmit={handleEditSubmit} className={styles.modalForm}>
              <input value={currentAdmin.empId} disabled />
              <input
                name="name"
                value={currentAdmin.name}
                onChange={handleEditChange}
                placeholder="Name"
              />
              <input
                name="email"
                value={currentAdmin.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <input
                name="number"
                value={currentAdmin.phone}
                onChange={handleEditChange}
                placeholder="Contact No."
              />

              <select
                name="role"
                value={currentAdmin.role}
                onChange={handleEditChange}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="manager">Manager</option>
              </select>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Save
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditModal(false)}
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
