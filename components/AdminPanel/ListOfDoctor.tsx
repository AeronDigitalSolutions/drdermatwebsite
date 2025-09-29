"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Dashboard/listofdoctor.module.css";

interface Doctor {
  _id: string;
  title?: string;
  firstName: string;
  lastName: string;
  specialist: string;
  email: string;
  createdAt: string;
}

const ListOfDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Doctor>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // FETCH doctors
  const fetchDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/doctoradmin");
      console.log("Doctors fetched:", res.data);
      setDoctors(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // DELETE doctor
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/doctoradmin/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT doctor
  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setEditForm({
      title: doctor.title,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialist: doctor.specialist,
      email: doctor.email,
    });
    setModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    try {
      await axios.put(`http://localhost:5000/api/doctoradmin/${editingDoctor._id}`, editForm);
      setModalOpen(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>List of Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>First Name</th>
              <th className={styles.th}>Last Name</th>
              <th className={styles.th}>Specialist</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td className={styles.td}>{d.title || "-"}</td>
                <td className={styles.td}>{d.firstName}</td>
                <td className={styles.td}>{d.lastName}</td>
                <td className={styles.td}>{d.specialist}</td>
                <td className={styles.td}>{d.email}</td>
                <td className={styles.td}>
                  <button className={styles.editButton} onClick={() => handleEdit(d)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && editingDoctor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Doctor</h3>
            <form onSubmit={handleEditSubmit} className={styles.form}>
              <label className={styles.label}>
                Title
                <input className={styles.input} type="text" name="title" value={editForm.title || ""} onChange={handleEditChange} />
              </label>
              <label className={styles.label}>
                First Name
                <input className={styles.input} type="text" name="firstName" value={editForm.firstName || ""} onChange={handleEditChange} required />
              </label>
              <label className={styles.label}>
                Last Name
                <input className={styles.input} type="text" name="lastName" value={editForm.lastName || ""} onChange={handleEditChange} required />
              </label>
              <label className={styles.label}>
                Specialist
                <input className={styles.input} type="text" name="specialist" value={editForm.specialist || ""} onChange={handleEditChange} required />
              </label>
              <label className={styles.label}>
                Email
                <input className={styles.input} type="email" name="email" value={editForm.email || ""} onChange={handleEditChange} required />
              </label>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.editButton}>Save</button>
                <button type="button" className={styles.deleteButton} onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfDoctor;
