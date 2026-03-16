import axios from "axios";
import type { AxiosError } from "axios";

// Base URL for API
// In development, use relative path for Vite proxy
// In production, use full URL
const BASE_URL = import.meta.env.DEV ? "/api" : "http://43.200.32.71:3001/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request
    console.log("🚀 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });

    // Get token from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error: AxiosError) => {
    // Log error response
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized: Token expired or invalid");
      localStorage.removeItem("accessToken");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 Access forbidden");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("💥 Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
