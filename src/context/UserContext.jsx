import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data", error);
      setError(error);
    } finally {
      setLoading(false);
      setNeedsRefresh(false); // Reset needsRefresh after fetching
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (needsRefresh) {
      fetchUser();
    }
  }, [needsRefresh, fetchUser]);

  const refreshUser = () => {
    setLoading(true);
    setNeedsRefresh(true);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for using the context
export const useUser = () => useContext(UserContext);
