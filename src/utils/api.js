import axios from "axios";

// Ganti baseURL sesuai domain ngrok/devtunnel/backend kamu
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor untuk menyisipkan token ke header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Opsional) Interceptor untuk handle error global (misalnya expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan redirect ke login jika sudah di halaman login
    const currentPath = window.location.pathname;

    // Cek jika unauthorized dan bukan di halaman login
    if (
      error.response &&
      error.response.status === 401 &&
      currentPath !== "/"
    ) {
      console.warn("Unauthorized. Redirecting to login...");
      window.location.href = "/";
    }

    return Promise.reject(error); // Penting agar bisa ditangani di komponen (seperti di Login.jsx)
  }
);

export default api;
