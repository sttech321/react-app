// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if needed
});

// ✅ Attach token to every request
 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    //console.log("[API] Authorization header set:", config.headers.Authorization);
  } else {
    //console.log("[API] No token found in localStorage");
  }

  // Also log full config for debugging (optional)
  console.log("[API] Request config:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});


// ✅ Handle expired or invalid tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "";

    if (
      error.response?.status === 401 &&
      (message.includes("expired") ||
        message.includes("Invalid") ||
        message.includes("No token"))
    ) {
      localStorage.removeItem("token");
      // optional: clear any user context here
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login"; // redirect user
    }

    return Promise.reject(error);
  }
);



export default API;
