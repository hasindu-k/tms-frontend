import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = () => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        backgroundColor="#000F18"
        color="#0899A3"
      >
        <CircularProgress sx={{ color: "#0899A3" }} />
      </Box>
    );
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/error"
        state={{
          status: 401,
          message: "Unauthenticated. Please login.",
        }}
        replace
      />
    );
  }
  if (isAuthenticated && !isVerified) {
    return (
      <Navigate
        to="/error"
        state={{
          status: 403,
          message: "Your email is not verified. Please verify your email.",
        }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
