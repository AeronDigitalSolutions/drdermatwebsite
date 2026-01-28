"use client";

import { API_URL } from "@/config/api";
import React, { useEffect, useMemo, useState } from "react";
import styles from "@/styles/Dashboard/listofadmin.module.css";

interface Admin {
  _id: string;
  empId: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "superadmin" | "manager";
  createdAt: string;
}

export default function ListOfAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTER STATE */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  /* ✏️ EDIT MODAL */
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

  /* ================= FILTERED ADMINS ================= */
  const filteredAdmins = useMemo(() => {
    let data = [...admins];

    if (search) {
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase()) ||
          a.empId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      data = data.filter((a) => a.role === roleFilter);
    }

    return data;
  }, [admins, search, roleFilter]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    await fetch(`${API_URL}/admins/${id}`, { method: "DELETE" });
    fetchAdmins();
  };

  /* ================= EDIT ================= */
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

    await fetch(`${API_URL}/admins/${currentAdmin._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: currentAdmin.name,
        email: currentAdmin.email,
        number: currentAdmin.phone,
        role: currentAdmin.role,
      }),
    });

    setEditModal(false);
    setCurrentAdmin(null);
    fetchAdmins();
  };

  if (loading) {
    return <div className={styles.loading}>Loading admins…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Directory</h1>

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search by name, email or Admin ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.filter}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {filteredAdmins.length === 0 ? (
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
              {filteredAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td className={styles.id}>{admin.empId}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.phone}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[admin.role]}`}>
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
              />
              <input
                name="email"
                value={currentAdmin.email}
                onChange={handleEditChange}
              />
              <input
                name="phone"
                value={currentAdmin.phone}
                onChange={handleEditChange}
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
