import {
  Button,
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../api/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useGoogleLogin from "../hooks/useGoogleLogin";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../context/UserContext";

// Define the validation schema using Yup
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const TOKEN_EXPIRATION = import.meta.env.TOKEN_EXPIRATION_TIME;
  const [showPassword, setShowPassword] = useState(false);
  const { googleLoading, handleGoogleLogin } = useGoogleLogin();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  // Initialize React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Handle form submission
  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { access_token } = response.data.authorization;

      if (access_token) {
        Cookies.set("token", access_token, { expires: TOKEN_EXPIRATION });
        enqueueSnackbar("Login successful!", { variant: "success" });
        refreshUser();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        enqueueSnackbar("Invalid credentials, please try again.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("An unexpected error occurred. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="mx-auto h-screen sm:h-auto sm:shadow-xl shadow-slate-500 rounded-[6px] bg-[#F9FBFD] w-full
     pb-2  md:my-3 lg:max-w-[400px] lg:pb-6 lg:mt-[50px] lg:mb-5"
    >
      <div className="form-content flex-col justify-center content-center pt-10">
        <div className="max-w-[400px] mx-auto flex justify-center">
          <img
            className="w-[157px] h-[104px] lg:w-[167px] lg:h-[114px] "
            src="/images/main_logo.svg"
            alt=""
          />
        </div>
        <span className="flex justify-center font-semibold text-xl">
          Log in to continue
        </span>
        <div className="flex-col space-y-5 justify-center mx-auto mt-3 w-4/5">
          <div className="text-field-container container space-y-3">
            <TextField
              fullWidth
              label="Enter your email address"
              variant="outlined"
              {...register("email")} // Pass the `login` function as a prop
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
          </div>
          <a href="/password-recovery">
            <span className="flex justify-center font-normal text-primary-green text-base">
              Forgotten your password?
            </span>
          </a>
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
              "Continue"
            )}
          </Button>
          <span className="flex justify-center text-gray-500 font-normal text-base">
            Or continue with
          </span>
          <Button
            fullWidth
            variant="contained"
            color="white"
            startIcon={<FcGoogle size={20} />}
            disabled={googleLoading}
            onClick={handleGoogleLogin}
          >
            {googleLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Sign Up with Google"
            )}
          </Button>
          <a href="/register">
            <span className="flex justify-center font-normal text-primary-green mt-3 text-base">
              Can’t log in? Create an account
            </span>
          </a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
