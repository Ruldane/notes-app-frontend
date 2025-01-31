import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  xsrfCookieName: "csrfToken",
  xsrfHeaderName: "X-CSRF-TOKEN",
  headers: {
    common: {
      "X-Requested-With": "XMLHttpRequest",
    },
  },
});

// Response interceptor for security
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    // Sanitize error messages
    const sanitizedError = new Error(
      error.response?.data?.message || "Request failed"
    );
    sanitizedError.status = error.response?.status;

    return Promise.reject(sanitizedError);
  }
);

export default instance;
