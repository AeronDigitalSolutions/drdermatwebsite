"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import API from "./utils/axios";
import Image from "next/image";
import styles from "@/styles/components/forms/Signup.module.css";
import illustration from "../public/register.png"; // adjust path if needed
import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [signupSuccess, setSignupSuccess] = useState(false); // ✅ track success

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/user/signup", formData);

      setSignupSuccess(true); // ✅ show login button
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
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
          <div className={styles.imageContainer}>
            <div className={styles.logo}>
              <span>
                dr.<span style={{ color: "#b39b53" }}>dermat</span>
              </span>
            </div>
          </div>

          <div className={styles.imageContainer}>
            <Image src={illustration} alt="Illustration" className={styles.image} />
          </div>

          <div className={styles.head}>Add your information…</div>

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
              <button type="submit" className={styles.button}>
                Register
              </button>
            </div>
          </form>

          {/* ✅ Show login button only after successful signup */}
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
