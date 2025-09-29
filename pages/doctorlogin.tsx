"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "@/styles/clinicdashboard/doctors.module.css";

const LoginDoctor = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/doctors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");

        // ✅ Save cookies so middleware can read
        Cookies.set("token", data.token, { expires: 1, path: "/" });
        Cookies.set("role", "doctor", { expires: 1, path: "/" });

        // ✅ Reset form
        setFormData({ email: "", password: "" });

        // ✅ Force reload so middleware immediately sees cookies
        window.location.href = "/DoctorDashboard";
      } else {
        setMessage(`❌ Error: ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.doctorContainer}>
      <h1 className={styles.pageTitle}>Doctor Login</h1>

      {message && <p className={styles.message}>{message}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginDoctor;
