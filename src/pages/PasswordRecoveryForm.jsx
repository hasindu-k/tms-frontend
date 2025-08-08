import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import api from "../api/axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Define the validation schema using Yup
const PasswordRecoverySchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const PasswordRecoveryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordRecoverySchema),
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handlePasswordReset = async (data) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });
      enqueueSnackbar("Password reset link sent!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handlePasswordReset)}
      className="mx-auto h-screen md:mt-[100px] sm:h-auto sm:shadow-xl shadow-slate-300 rounded-[4px] bg-[#F9FBFD] w-full
     pb-2 md:pb-8  md:my-3 lg:max-w-[400px] lg:mt-[120px] lg:pb-7 lg:mb-5"
    >
      <div className="max-w-[400px] mx-auto flex justify-center">
        <img
          className="w-[157px] h-[104px] lg:w-[167px] lg:h-[114px] "
          src="/images/main_logo.svg"
          alt=""
        />
      </div>
      <span className="flex justify-center font-semibold text-xl mb-5">
        Password recovery
      </span>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className="!mb-4 !px-2"
      >
        If you've forgotten your password, enter your email address below, and
        we’ll send you instructions to reset it.
      </Typography>
      <div className="flex-col space-y-5 justify-center mx-auto mt-3 w-4/5">
        <div className="text-field-container container space-y-3">
          <TextField
            fullWidth
            label="Enter your email address"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            )}{" "}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PasswordRecoveryForm;
