"use client";

import React, { useState } from "react";
import styles from "@/styles/Dashboard/adminpages.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function CreateAdmin() {
  /* ================= AUTO USER ID ================= */
  const [userId] = useState(`ADM-${Date.now().toString().slice(-6)}`);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    accessLevel: "Admin", // Admin | SuperAdmin | Manager
    active: true,

    forgotPassword: false,
    changePassword: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      userId,
      ...form,
    };

    try {
      const res = await fetch(`${API_URL}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("✅ Admin account created successfully");
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        accessLevel: "Admin",
        active: true,
        forgotPassword: false,
        changePassword: false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Management</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* ================= LOGIN / PROFILE ================= */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Login / Profile</h3>

          <div className={styles.field}>
            <label className={styles.label}>User ID</label>
            <input className={styles.readonlyInput} value={userId} disabled />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input className={styles.input} name="name" onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contact No.</label>
            <input
              className={styles.input}
              name="phone"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ================= PASSWORD ================= */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Security</h3>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              className={styles.input}
              type="password"
              name="confirmPassword"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ================= ACCESS ================= */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Access Level</h3>

          <div className={styles.field}>
            <label className={styles.label}>Grant Access</label>
            <select
              className={styles.select}
              name="accessLevel"
              onChange={handleChange}
            >
              <option>Admin</option>
              <option>SuperAdmin</option>
              <option>Manager</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active / Block
            </label>

            <label>
              <input
                type="checkbox"
                name="forgotPassword"
                checked={form.forgotPassword}
                onChange={handleChange}
              />
              Forgot Password Enabled
            </label>

            <label>
              <input
                type="checkbox"
                name="changePassword"
                checked={form.changePassword}
                onChange={handleChange}
              />
              Allow Change Password
            </label>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <button className={styles.submitBtn} type="submit">
          Save Admin
        </button>
      </form>

      <MobileNavbar />
    </div>
  );
}
