import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { CircularProgress, Typography } from "@mui/material";
import useGoogleLogin from "../hooks/useGoogleLogin";
import { useUser } from "../context/UserContext";

const GoogleLoginCallback = () => {
  const { saveAuthData } = useGoogleLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { refreshUser } = useUser();

  const handledRef = useRef(false); // prevents double execution (React 18)

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      saveAuthData({ authorization: { access_token: token } });
      enqueueSnackbar("Login successful!", { variant: "success" });
      refreshUser();
      navigate("/dashboard");
      return;
    }

    if (error) {
      enqueueSnackbar("Google authentication failed. Please try again.", {
        variant: "error",
      });
      navigate("/login");
      return;
    }

    enqueueSnackbar("Please try again later.", { variant: "error" });
    navigate("/login");
  }, [location.search, navigate, enqueueSnackbar, saveAuthData, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <CircularProgress size={60} />
      <Typography variant="h5" className="font-semibold text-secondary-green">
        Signing you in with Google…
      </Typography>
      <Typography variant="body1" className="text-gray-600">
        Please wait
      </Typography>
    </div>
  );
};

export default GoogleLoginCallback;
