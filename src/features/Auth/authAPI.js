// authAPI.js
import axios from "axios";

// Create the API instance with default config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Initialize common headers
    common: {},
  },
});

// Request interceptor
API.interceptors.request.use(
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

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Don't use window.location directly - let the app handle navigation
      console.log(error);
      return Promise.reject(new Error("UNAUTHORIZED"));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },

  register: (userData) => API.post("/auth/register", userData),

  logout: async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  verify: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("No token found"));
    }
    return await API.get("/auth/verify");
  },

  deleteAccount: () => API.delete("/auth/delete"),
  get: (url) => API.get(url),
  post: (url, data) => API.post(url, data),
  put: (url, data) => API.put(url, data),
  delete: (url) => API.delete(url),
};

export default API;
