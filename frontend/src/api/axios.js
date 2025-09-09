import axios from "axios";

const resolvedBaseUrl =
  (typeof window !== "undefined" && window?.ENV?.VITE_API_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://task-manager.ddev.site/api";

const api = axios.create({
  baseURL: resolvedBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
