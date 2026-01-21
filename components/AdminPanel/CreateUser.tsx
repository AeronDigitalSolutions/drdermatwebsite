"use client";

import { useState } from "react";
import styles from "@/styles/Dashboard/createUser.module.css";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    email: "",
    contactNo: "",
    address: "",
    membershipPlan: "",
    paymentMethod: "",
    location: "",
    status: "active",
    notifications: true,
    profileReset: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CREATE USER DATA:", formData);
    alert("Dummy user created (check console)");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create User</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* ================= BASIC INFO ================= */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Basic Information</div>

          <div className={styles.field}>
            <label className={styles.label}>Patient ID</label>
            <input
              className={styles.input}
              name="patientId"
              placeholder="Auto / Manual ID"
              value={formData.patientId}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Patient Name</label>
            <input
              className={styles.input}
              name="patientName"
              placeholder="Enter full name"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email ID</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contact No.</label>
            <input
              className={styles.input}
              name="contactNo"
              placeholder="Enter contact number"
              value={formData.contactNo}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fullField}>
            <label className={styles.label}>Address</label>
            <textarea
              className={styles.textarea}
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>User Activity</div>

          <div className={styles.field}>
            <label className={styles.label}>Your Orders</label>
            <input className={styles.readonlyInput} readOnly value="Available" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Your Consultations</label>
            <input className={styles.readonlyInput} readOnly value="Available" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Online Test Report</label>
            <input className={styles.readonlyInput} readOnly value="Available" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Your Prescriptions</label>
            <input className={styles.readonlyInput} readOnly value="Available" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Search History</label>
            <input className={styles.readonlyInput} readOnly value="Tracked" />
          </div>
        </div>

        {/* ================= ACCOUNT ================= */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Account & Membership</div>

          <div className={styles.field}>
            <label className={styles.label}>Membership Plan</label>
            <input
              className={styles.input}
              name="membershipPlan"
              placeholder="Free / Premium / Gold"
              value={formData.membershipPlan}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Payment Method</label>
            <input
              className={styles.input}
              name="paymentMethod"
              placeholder="UPI / Card / Net Banking"
              value={formData.paymentMethod}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              name="location"
              placeholder="City, State"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked by Admin</option>
            </select>
          </div>
        </div>

        {/* ================= SETTINGS ================= */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Preferences & Controls</div>

          <div className={styles.switchRow}>
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
              Notification
            </label>

            <label>
              <input
                type="checkbox"
                name="profileReset"
                checked={formData.profileReset}
                onChange={handleChange}
              />
              Profile Reset
            </label>

            <label>Privacy Policy</label>
            <label>Help Center</label>
            <label>Settings</label>
            <label>Rate us ⭐⭐⭐⭐⭐</label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Create User
        </button>
      </form>
    </div>
  );
}
