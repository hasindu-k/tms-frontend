import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../../api/axios";

const EmailVerification = () => {
  const { userId, hash } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState("loading"); // loading | success | error

  const searchParams = new URLSearchParams(location.search);
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/email/verify/${userId}/${hash}`, {
          params: { expires, signature },
        });

        enqueueSnackbar(response.data.message, { variant: "success" });
        setStatus("success");

        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setStatus("error");

        if (error.response) {
          enqueueSnackbar(error.response.data.message, {
            variant: error.response.status === 401 ? "warning" : "error",
          });
        } else {
          enqueueSnackbar("An unknown error occurred", { variant: "error" });
        }
      }
    };

    verifyEmail();
  }, [userId, hash, expires, signature, navigate, enqueueSnackbar]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      {status === "loading" && (
        <>
          <CircularProgress size={60} />
          <Typography
            variant="h5"
            className="font-semibold text-secondary-green"
          >
            Verifying your email…
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Please wait a moment.
          </Typography>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#16a34a" }} />
          <Typography
            variant="h5"
            className="font-semibold text-secondary-green"
          >
            Email Verified
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            You will be redirected to login shortly.
          </Typography>
        </>
      )}

      {status === "error" && (
        <>
          <CancelIcon sx={{ fontSize: 80, color: "#dc2626" }} />
          <Typography variant="h5" className="font-semibold text-red-600">
            Verification Failed
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            The verification link is invalid or expired.
          </Typography>
          <Button
            min-h-screen
            variant="contained"
            onClick={() => navigate("/login")}
            className="bg-secondary-green hover:bg-primary-green"
          >
            Go to Login
          </Button>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
