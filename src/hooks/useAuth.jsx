import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../api/axios";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setLoading(false);
    } else {
      api
        .get("/me")
        .then((response) => {
          setIsAuthenticated(true);
          setIsVerified(true);
          Cookies.set("userName", response.data.data.name);
          Cookies.set("userEmail", response.data.data.email);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return { isAuthenticated, isVerified, loading };
};
