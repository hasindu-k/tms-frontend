import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import useGoogleLogin from "../hooks/useGoogleLogin";

const GoogleLoginCallback = () => {
  const { saveAuthData } = useGoogleLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const handleCallback = async () => {
      // Extract the query parameters from the URL
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      // Check if the token exists
      if (token) {
        // Save the token using the custom hook method
        saveAuthData({ authorization: { access_token: token } });

        enqueueSnackbar("Login successful!", { variant: "success" });

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        enqueueSnackbar("Login failed. No token found.", { variant: "error" });
        navigate("/login"); // Redirect back to login if there's an issue
      }
    };

    handleCallback();
  }, [navigate, enqueueSnackbar, saveAuthData, location.search]);

  return <div>Logging in...</div>;
};

export default GoogleLoginCallback;
