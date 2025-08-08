import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

let isRefreshing = false;

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const TOKEN_EXPIRATION = import.meta.env.TOKEN_EXPIRATION_TIME;

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const token = Cookies.get("token");
    if (token) {
      const response = await api.post("/auth/refresh", {});
      const { access_token: newToken } = response.data;

      // Store the new access token in cookies
      Cookies.set("token", newToken, { expires: TOKEN_EXPIRATION });
      return newToken;
    }
  } catch (error) {
    console.error("Unable to refresh token", error);
    throw error;
  }
};

// Axios request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor
api.interceptors.response.use(
  (response) => response, // Pass through valid responses
  async (error) => {
    const originalRequest = error.config;
    if (!isRefreshing && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token and retry the request
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Handle refresh token failure
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        enqueueSnackbar("Session expired, please log in again.", {
          variant: "error",
        });
        useNavigate()("/login");
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
