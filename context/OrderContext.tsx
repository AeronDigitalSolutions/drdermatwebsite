"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CartItem } from "./CartContext";

export interface IOrder {
  _id?: string;
  userId?: string;
  products: CartItem[];
  totalAmount: number;
  address: { type: string; address: string };
  createdAt?: string;
}

interface OrderContextType {
  orders: IOrder[];
  createOrder: (items: CartItem[], total: number, address: { type: string; address: string }) => Promise<void>;
  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const createOrder = async (items: CartItem[], total: number, address: { type: string; address: string }) => {
    const userId = Cookies.get("userId") || localStorage.getItem("userId");
    if (!userId) throw new Error("User not logged in");

    try {
      const res = await axios.post(`${API_BASE}/orders`, {
        userId,
        products: items,
        totalAmount: total,
        address,
      });
      setOrders(prev => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Failed to create order:", err);
      throw err;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
};
