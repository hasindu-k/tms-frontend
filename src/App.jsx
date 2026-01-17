import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import DashboardLayout from "./components/layout/DashboardLayout";
import GuestLayout from "./components/layout/GuestLayout";
import GoogleLoginCallback from "./components/GoogleLoginCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./components/mail/EmailVerification";
import ErrorPage from "./pages/ErrorPage";
import LoginForm from "./pages/LoginForm";
import MainDashboard from "./pages/MainDashboard";
import PasswordRecoveryForm from "./pages/PasswordRecoveryForm";
import PasswordResetForm from "./pages/PasswordResetForm";
import Modal from "./components/Modal/Modal";
import SignUpForm from "./pages/SignupForm";
import Welcome from "./pages/Welcome";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/" element={<GuestLayout />}>
              <Route path="register" element={<SignUpForm />} />
              <Route path="login" element={<LoginForm />} />
              <Route
                path="/auth/google/callback"
                element={<GoogleLoginCallback />}
              />
              <Route
                path="password-recovery"
                element={<PasswordRecoveryForm />}
              />
              <Route
                path="password-reset/:token"
                element={<PasswordResetForm />}
              />
            </Route>

            {/* Email verification route (public route) */}
            <Route
              path="/email/verify/:userId/:hash"
              element={<EmailVerification />}
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<MainDashboard />} />
                <Route path="modal" element={<Modal />} />
              </Route>
            </Route>
            {/* Error route */}
            <Route path="/error" element={<ErrorPage />} />
            {/* handling unknown routes 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </UserProvider>
      </Router>
    </SnackbarProvider>
  );
}
