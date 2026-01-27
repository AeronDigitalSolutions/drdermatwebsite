"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/listofuser.module.css";
import { API_URL } from "@/config/api";

interface User {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  contactNo?: string;
  address?: string;
  createdAt: string;
}

// ✅ API base
// const API_URL =
//   process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

function ListOfUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className={styles.loading}>Loading users...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>List of Users</h1>

      {users.length === 0 ? (
        <p className={styles.noData}>No users found</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Address</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.patientId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNo || "-"}</td>
                  <td className={styles.address}>
                    {user.address || "-"}
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.viewBtn}>View</button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListOfUser;
