export const API_URL =
  process.env.NEXT_PUBLIC_API_BASE
    ? `${process.env.NEXT_PUBLIC_API_BASE}/api`
    : "http://localhost:5000/api";
