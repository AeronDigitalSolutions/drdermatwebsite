"use client";
import React, { useState } from "react";
import axios from "axios";
import styles from "@/styles/Dashboard/createdoctor.module.css";

interface DoctorForm {
  title: string;
  firstName: string;
  lastName: string;
  specialist: string;
  email: string;
  password: string;
}

interface Props {
  onDoctorCreated?: () => void; // callback to refresh list
}

const CreateDoctor: React.FC<Props> = ({ onDoctorCreated }) => {
  const [form, setForm] = useState<DoctorForm>({
    title: "",
    firstName: "",
    lastName: "",
    specialist: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/doctoradmin", form);
      setMessage("Doctor created successfully!");
      setForm({ title: "", firstName: "", lastName: "", specialist: "", email: "", password: "" });
      if (onDoctorCreated) onDoctorCreated();
    } catch (err: any) {
      setMessage(err.response?.data?.msg || "Error creating doctor");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Doctor</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Title
          <input className={styles.input} type="text" name="title" value={form.title} onChange={handleChange} />
        </label>
        <label className={styles.label}>
          First Name*
          <input className={styles.input} type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
        <label className={styles.label}>
          Last Name*
          <input className={styles.input} type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
        <label className={styles.label}>
          Specialist*
          <input className={styles.input} type="text" name="specialist" value={form.specialist} onChange={handleChange} required />
        </label>
        <label className={styles.label}>
          Email*
          <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className={styles.label}>
          Password*
          <input className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Doctor"}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default CreateDoctor;
