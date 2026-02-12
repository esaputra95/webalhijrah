import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "", // default ke relative path
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// bisa tambahin interceptor (contoh untuk token auth)
api.interceptors.request.use((config) => {
  // kalau pakai token JWT di localStorage / cookie
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
