"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import styles from "@/styles/adminpanel/orderhistory.module.css";

interface Order {
  _id: string;
  products: { id: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  address: { type: string; address: string };
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const UserOrderHistory: React.FC = () => {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
  const fetchOrders = async () => {
    if (!user?._id) return;
    setFetching(true);
    try {
      const res = await axios.get(`${API_BASE}/orders/my`, {
        headers: { "x-user-id": user._id },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
    } finally {
      setFetching(false);
    }
  };
  fetchOrders();
}, [user]);


  if (loading) return <p>Loading user data...</p>;
  if (!user?._id) return <p>Please log in to view your orders.</p>;
  if (fetching) return <p>Loading orders...</p>;

  return (
    <div className={styles.container}>
      <h2>🧾 Order History for {user.name}</h2>
      {orders.length === 0 ? (
        <p>No past orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className={styles.orderCard}>
            <h3>Order #{order._id?.slice(-6)}</h3>
            <p>
              <strong>Address:</strong> {order.address.type} — {order.address.address}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount.toLocaleString("en-IN")}
            </p>
            <ul>
              {order.products.map(p => (
                <li key={p.id}>
                  {p.name} × {p.quantity} — ₹{p.price * p.quantity}
                </li>
              ))}
            </ul>
            <small>{new Date(order.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrderHistory;
