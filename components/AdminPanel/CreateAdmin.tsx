import React, { useState } from "react";
import styles from "@/styles/Dashboard/adminpages.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    email: "",
    number: "",
    password: "",
    role: "admin", // ✅ default role
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "role" && type === "checkbox") {
      // ✅ if checkbox checked, role = superadmin
      setFormData(prev => ({ ...prev, role: checked ? "superadmin" : "admin" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 Submitting admin data:", formData);

    try {
      const res = await fetch("http://localhost:5000/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create admin");

      setSuccess("✅ Admin created successfully!");
      setFormData({
        empId: "",
        name: "",
        email: "",
        number: "",
        password: "",
        role: "admin",
      });
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Admin</h2>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <label htmlFor="empId">Employee ID</label>
        <input
          className={styles.input}
          type="text"
          name="empId"
          id="empId"
          value={formData.empId}
          onChange={handleChange}
          required
        />

        <label htmlFor="name">Name</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="number">Phone Number</label>
        <input
          className={styles.input}
          type="tel"
          name="number"
          id="number"
          value={formData.number}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className={styles.input}
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* ✅ Checkbox for Superadmin */}
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="role"
            name="role"
            checked={formData.role === "superadmin"}
            onChange={handleChange}
          />
          <label htmlFor="role">Make Superadmin</label>
        </div>

        <button type="submit" className={styles.button}>Create Admin</button>
      </form>

      <MobileNavbar />
    </div>
  );
};

export default CreateAdmin;
