// utils/axios.ts
import axios from "axios";

// Use environment variable in production, fallback to localhost only in dev
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
  console.warn(
    "NEXT_PUBLIC_API_URL is not set! Axios will use localhost for local development."
  );
}

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;
