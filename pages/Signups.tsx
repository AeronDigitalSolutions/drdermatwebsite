"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/components/forms/Signup.module.css";
import illustration from "../public/register.png"; // adjust path if needed
import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";

// ✅ Use live backend URL
const API_URL = "https://dermatbackend.onrender.com";

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [signupSuccess, setSignupSuccess] = useState(false); // ✅ track success
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSignupSuccess(true); // ✅ show login button
    } catch (err: any) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/Login"); // redirect to login page
  };

  return (
    <>
      <Topbar />
      <div className={styles.container}>
        <div className={styles.form}>
          {/* Logo Section */}
          <div className={styles.imageContainer}>
            <div className={styles.logo}>
              <span>
                dr.<span style={{ color: "#b39b53" }}>dermat</span>
              </span>
            </div>
          </div>

          {/* Illustration */}
          <div className={styles.imageContainer}>
            <Image src={illustration} alt="Illustration" className={styles.image} />
          </div>

          <div className={styles.head}>Add your information…</div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputDiv}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputDiv}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputDiv}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          {/* ✅ Show "Go to Login" button after successful signup */}
          {signupSuccess && (
            <div className={styles.buttonContainer} style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className={styles.button}
                onClick={goToLogin}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
