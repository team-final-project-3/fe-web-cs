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
  (error) => Promise.reject(error)
);

// Interceptor untuk handle token yang tidak valid atau expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;

    const isOnAuthPage =
      currentPath === "/" ||
      currentPath === "/login" ||
      currentPath === "/session-expired";

    if (error.response && error.response.status === 401 && !isOnAuthPage) {
      console.warn(
        "Token expired or unauthorized. Redirecting to session-expired..."
      );
      localStorage.clear();
      window.location.href = "/session-expired";
    }

    return Promise.reject(error); // tetap lempar error agar bisa ditangani komponen
  }
);

export default api;
