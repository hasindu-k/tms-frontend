import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../api/axios";
import { useState } from "react";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [resendLoading, setResendLoading] = useState(false);

  const { status, message } = location.state || {
    status: 404,
    message: "Page not found",
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      const response = await api.post("/email/verification-notification");
      enqueueSnackbar(response.data.message, {
        variant: "success",
      });
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#000F18"
      color="#0899A3"
      textAlign="center"
    >
      <Typography variant="h1" gutterBottom>
        {status}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {message}
      </Typography>
      {status === 401 && (
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "20px",
            color: "#fff",
            backgroundColor: "#0899A3",
            "&:hover": {
              backgroundColor: "#067b86",
            },
          }}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      )}
      {status === 403 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleResendVerification}
          disabled={resendLoading}
          sx={{
            marginTop: "10px",
            color: "#0899A3",
            borderColor: "#0899A3",
            "&:hover": {
              backgroundColor: "rgba(8,153,163,0.1)",
              borderColor: "#067b86",
            },
          }}
        >
          {resendLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Resend Verification Email"
          )}
        </Button>
      )}
      {status === 404 && (
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "20px",
            color: "#fff",
            backgroundColor: "#0899A3",
            "&:hover": {
              backgroundColor: "#067b86",
            },
          }}
          onClick={() => navigate(-1)}
        >
          Back to Previous Page
        </Button>
      )}
    </Box>
  );
};

export default ErrorPage;
