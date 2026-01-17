import { useState } from "react";
import Cookies from "js-cookie";

const useGoogleLogin = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const TOKEN_EXPIRATION = import.meta.env.TOKEN_EXPIRATION_TIME;

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      window.location.href = `${baseURL}/auth/google`;
      // Note: page will redirect, so loading state persists
    } catch (error) {
      console.error("Google login failed", error);
      setGoogleLoading(false);
    }
  };
  const saveAuthData = (data) => {
    Cookies.set("token", data.authorization.access_token, {
      expires: TOKEN_EXPIRATION,
    });
  };

  return { googleLoading, handleGoogleLogin, saveAuthData };
};

export default useGoogleLogin;
