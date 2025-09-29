import React, { useState } from "react";
import { useRouter } from "next/router"; // ✅ use next/router for Pages Router
import Cookies from "js-cookie";
import styles from "@/styles/cliniclogin.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ClinicLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("📡 Sending login request:", form);

      const res = await fetch("http://localhost:5000/api/clinics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("✅ Response status:", res.status);

      const data = await res.json().catch(() => null);
      console.log("📦 Response data:", data);

      if (!res.ok) throw new Error(data?.message || "Login failed");

      // 🎯 Save cookies (token + role)
      Cookies.set("token", data.token, { expires: 1 }); // valid for 1 day
      Cookies.set("role", "clinic", { expires: 1 });

      // 🎯 Redirect after login success
      console.log("🎉 Login success, redirecting...");
      router.replace("/ClinicDashboard"); 
window.location.href = "/ClinicDashboard"; // ✅ forces middleware to run
 // ✅ must start with /
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Clinic Login</h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="clinic@example.com"
            />
          </label>

          <label className={styles.label}>
            Password
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
