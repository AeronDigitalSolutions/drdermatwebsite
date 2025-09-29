import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/listofadmin.module.css";

interface Admin {
  _id: string;
  empId: string;
  name: string;
  email: string;
  number: string;
  role: "admin" | "superadmin"; // ✅ added role
  createdAt: string;
}

function ListOfAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admins");
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: "DELETE",
      });
      fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  const handleEdit = (admin: Admin) => {
    setCurrentAdmin(admin);
    setEditModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!currentAdmin) return;
    setCurrentAdmin({ ...currentAdmin, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/${currentAdmin._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentAdmin),
        }
      );

      if (res.ok) {
        setEditModal(false);
        setCurrentAdmin(null);
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading admins...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>List of Admins</h2>

      {admins.length === 0 ? (
        <div className={styles.noData}>No admins found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th> {/* ✅ Added role column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.empId}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.number}</td>
                <td>{admin.role}</td> {/* ✅ Display role */}
                <td className={styles.actions}>
                  <button
                    onClick={() => handleEdit(admin)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editModal && currentAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Admin</h3>
            <form onSubmit={handleEditSubmit} className={styles.form}>
              <input
                type="text"
                name="empId"
                value={currentAdmin.empId}
                onChange={handleEditChange}
                required
                placeholder="Employee ID"
              />
              <input
                type="text"
                name="name"
                value={currentAdmin.name}
                onChange={handleEditChange}
                required
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={currentAdmin.email}
                onChange={handleEditChange}
                required
                placeholder="Email"
              />
              <input
                type="text"
                name="number"
                value={currentAdmin.number}
                onChange={handleEditChange}
                required
                placeholder="Phone Number"
              />

              {/* ✅ Dropdown for Role */}
              <select
                name="role"
                value={currentAdmin.role}
                onChange={handleEditChange}
                className={styles.select}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
                <button
                  onClick={() => setEditModal(false)}
                  type="button"
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOfAdmin;
