import axios from "axios";

// Ganti baseURL sesuai domain ngrok/devtunnel/backend kamu
const api = axios.create({
  baseURL: "https://3fd5pjgv-3000.asse.devtunnels.ms/api/",
});

// Interceptor untuk menyisipkan token ke header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

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
    // Contoh: redirect ke login kalau unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized. Redirecting to login...");
      window.location.href = "/"; // asumsi login ada di "/"
    }

    return Promise.reject(error);
  }
);

export default api;
