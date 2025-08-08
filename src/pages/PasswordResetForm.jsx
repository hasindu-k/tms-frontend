import {
  Button,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Validation schema
const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const PasswordResetForm = () => {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordResetSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token: token,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      enqueueSnackbar("Password reset successful!", { variant: "success" });

      const timeOutId = setTimeout(() => {
        Navigate("/login");
      }, 3000);
      return () => clearTimeout(timeOutId);
    } catch (error) {
      if (error.response.status === 422) {
        enqueueSnackbar("Please enter a valid email.", {
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

  // Toggle password visibility
  const handlePasswordToggle = (type) => {
    if (type === "password") {
      setShowPassword(!showPassword);
    } else if (type === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const renderPasswordField = (label, field, showField, toggleFunction) => (
    <FormControl
      fullWidth
      variant="outlined"
      error={!!errors[field]}
      sx={formControlStyles(errors[field])}
    >
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        type={showField ? "text" : "password"}
        {...register(field)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => toggleFunction(field)} edge="end">
              {showField ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      {errors[field] && (
        <span className="text-red-500">{errors[field].message}</span>
      )}
    </FormControl>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto shadow-xl shadow-slate-300 rounded-[4px] bg-[#F9FBFD] w-full
     pb-3 md:my-3 lg:max-w-[400px] lg:pb-9 lg:mt-[100px] lg:mb-5"
    >
      <div className="max-w-[400px] mx-auto flex justify-center">
        <img
          className="w-[157px] h-[104px]"
          src="/images/main_logo.svg"
          alt=""
        />
      </div>
      <span className="flex justify-center font-semibold text-xl mb-5">
        Password Reset
      </span>

      <div className="flex-col space-y-5 justify-center mx-auto mt-3 w-4/5">
        <TextField
          fullWidth
          label="Enter your email address"
          variant="outlined"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={formControlStyles(errors.email)}
        />

        {renderPasswordField(
          "Password",
          "password",
          showPassword,
          handlePasswordToggle
        )}

        {renderPasswordField(
          "Confirm Password",
          "confirmPassword",
          showConfirmPassword,
          handlePasswordToggle
        )}

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
      </div>
    </form>
  );
};

// Refactor styles for form control
const formControlStyles = (error) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: error ? "error.main" : "default",
    },
    "&.Mui-focused fieldset": {
      borderColor: error ? "error.main" : "#0899A3",
    },
  },
  "& .MuiInputLabel-root": {
    color: error ? "error.main" : "default",
    "&.Mui-focused": {
      color: error ? "error.main" : "#0899A3",
    },
  },
});

export default PasswordResetForm;
