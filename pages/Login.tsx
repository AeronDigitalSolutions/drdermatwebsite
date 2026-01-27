"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";
import styles from "@/styles/components/forms/ModularForm.module.css";
import illustration from "../public/form.png";
import { API_URL } from "@/config/api";

// const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save cookies
      Cookies.set("token", data.token, { expires: rememberMe ? 7 : undefined });
      Cookies.set("email", data.user.email, { expires: rememberMe ? 7 : undefined });
      Cookies.set("username", data.user.name, { expires: rememberMe ? 7 : undefined });

      router.push("/UserDashboard"); // redirect to profile page
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar />
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <div className={styles.imageContainer}>
            <Image src={illustration} alt="Illustration" className={styles.image} />
          </div>

          <h1 className={styles.head}>Login to your account</h1>

          <div className={styles.inputDiv}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputDiv}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={`${styles.inputDiv} ${styles.checkboxRow}`}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> Remember Me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className={styles.terms}>
            By logging in, you agree to Dr. Dermat's <u>Privacy Policy</u> and <u>Terms of Service</u>.
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}
