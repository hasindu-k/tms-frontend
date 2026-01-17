import {
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../api/axios";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { FcGoogle } from "react-icons/fc";
import useGoogleLogin from "../hooks/useGoogleLogin";

// Define the validation schema using Yup
const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  name: Yup.string().required("Name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { googleLoading, handleGoogleLogin } = useGoogleLogin();
  const [emailSent, setEmailSent] = useState(false);

  // Function to handle toggling password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      const { token } = response.data;

      // Store token in a cookie (expires in 7 days)
      Cookies.set("token", token, { expires: 7 });
      enqueueSnackbar("Registration successful! Please verify your email", {
        variant: "success",
      });
      setEmailSent(true);
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
      setLoading(false);
    }
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
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="mx-auto shadow-xl shadow-slate-300 rounded-[4px] bg-[#F9FBFD] w-full
     pb-3 md:my-3 lg:max-w-[400px] lg:pb-6 lg:mt-2 lg:mb-5"
    >
      <div className="max-w-[400px] mx-auto flex justify-center">
        <img
          className="w-[157px] h-[104px] lg:w-[167px] lg:h-[114px] "
          src="/images/main_logo.svg"
          alt=""
        />
      </div>
      <span className="flex justify-center font-semibold lg:text-xl lg:mb-5">
        Sign up to continue
      </span>
      <div className="flex-col space-y-5 justify-center mx-auto mt-3 w-4/5">
        <div className="text-field-container container space-y-3">
          <TextField
            fullWidth
            label="Enter your email address"
            variant="outlined"
            {...register("email")} // Register field for validation
            error={!!errors.email} // Show error style if validation fails
            helperText={errors.email?.message} // Show validation message
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errors.email ? "error.main" : "default",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.email ? "error.main" : "#0899A3",
                },
              },
              "& .MuiInputLabel-root": {
                color: errors.email ? "error.main" : "default",
                "&.Mui-focused": {
                  color: errors.email ? "error.main" : "#0899A3",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Enter your name"
            variant="outlined"
            {...register("name")} // Register field for validation
            error={!!errors.name} // Show error style if validation fails
            helperText={errors.name?.message} // Show validation message
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errors.name ? "error.main" : "default",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.name ? "error.main" : "#0899A3",
                },
              },
              "& .MuiInputLabel-root": {
                color: errors.name ? "error.main" : "default",
                "&.Mui-focused": {
                  color: errors.name ? "error.main" : "#0899A3",
                },
              },
            }}
          />
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errors.password ? "error.main" : "default",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.password ? "error.main" : "#0899A3",
                },
              },
              "& .MuiInputLabel-root": {
                color: errors.password ? "error.main" : "default",
                "&.Mui-focused": {
                  color: errors.password ? "error.main" : "#0899A3",
                },
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            error={!!errors.confirmPassword}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errors.confirmPassword
                    ? "error.main"
                    : "default",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.confirmPassword
                    ? "error.main"
                    : "#0899A3",
                },
              },
              "& .MuiInputLabel-root": {
                color: errors.confirmPassword ? "error.main" : "default",
                "&.Mui-focused": {
                  color: errors.confirmPassword ? "error.main" : "#0899A3",
                },
              },
            }}
          >
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </FormControl>{" "}
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            className="!mb-2"
          >
            By sign up, I accept the workstream Terms and Service and Knowledge
            of privacy and policy
            <a href="#" color="inherit">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" color="inherit">
              Privacy Policy
            </a>
          </Typography>
          <Button
            type="submit"
            className="!bg-primary-green"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Sign Up"
            )}
          </Button>
          <span className="my-[1px]">
            {emailSent && (
              <Typography
                variant="body2"
                component="span"
                className="text-[#0899A3] cursor-pointer"
                onClick={handleResendVerification}
              >
                {resendLoading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "#0899A3", my: 1 }}
                  />
                ) : (
                  "Resend verification email"
                )}
              </Typography>
            )}
          </span>
          <span className="flex justify-center text-gray-500 font-normal text-base">
            Or continue with
          </span>
          <Button
            fullWidth
            variant="contained"
            color="white"
            startIcon={!googleLoading && <FcGoogle size={20} />}
            disabled={googleLoading}
            onClick={handleGoogleLogin}
          >
            {googleLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Sign Up with Google"
            )}
          </Button>
          <a href="/login">
            <div className="text-container flex justify-center font-normal">
              <span className=" text-primary-green text-center mt-3 text-base">
                Already have an WorkStream account? Log in
              </span>
            </div>
          </a>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
