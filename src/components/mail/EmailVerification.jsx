import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import api from "../../api/axios";

const EmailVerification = () => {
  const { userId, hash } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // Directly extract query parameters using URLSearchParams
  const searchParams = new URLSearchParams(location.search);
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/email/verify/${userId}/${hash}`, {
          params: { expires, signature },
        });
        const { message } = response.data;
        if (response.status === 200) {
          enqueueSnackbar(message, { variant: "success" });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data;
          if (error.response.status === 401) {
            enqueueSnackbar(message, { variant: "warning" });
          } else {
            enqueueSnackbar(message, { variant: "error" });
          }
        } else {
          enqueueSnackbar("An unknown error occurred", { variant: "error" });
        }
      }
    };

    verifyEmail();
  }, [userId, hash, navigate, expires, signature, enqueueSnackbar]);
};

export default EmailVerification;
