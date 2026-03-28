import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import ProfileModal from "../Modal/ProfileModal";
import LogoutIcon from "@mui/icons-material/Logout";
import Skeleton from "@mui/material/Skeleton";

export function ProfileMenu() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
      } finally {
        setFetchingUserData(false);
      }
    };
    fetchUserData();
  }, [enqueueSnackbar]);

  const handleClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Logging out will end your current session. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      customClass: {
        popup: "bg-white rounded-[4px] shadow-2xl ",
        title: "text-lg font-semibold text-secondary-green",
        confirmButton:
          "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
        cancelButton:
          "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/logout");
      enqueueSnackbar("Logged out successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
      Cookies.remove("token");
      navigate("/login");
    }
  };

  if (fetchingUserData) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  return (
    <>
      <Menu className="p-3">
        <MenuHandler>
          <Avatar
            aria-label="User Profile"
            variant="circular"
            alt="Profile Avatar"
            className="cursor-pointer rounded-[180px] w-[40px] h-[37px] max-w-[40px] max-h-[40px]"
            src={userData?.avatar ? userData.avatar : null}
          />
        </MenuHandler>

        <MenuList className="border border-white/20 rounded-2xl shadow-2xl bg-slate-900/95 backdrop-blur-2xl p-2 min-w-[220px] text-white ring-1 ring-white/10 z-[9999]">
          <div className="px-4 py-3 border-b border-white/10 mb-2">
            <Typography variant="small" className="font-bold text-white tracking-wide">
              {userData?.name || "Guest"}
            </Typography>
            <Typography variant="small" className="text-white/60 text-[10px] uppercase font-bold mt-0.5">
              Personal Account
            </Typography>
          </div>

          <MenuItem
            aria-label="My Profile"
            className="flex items-center gap-x-3 px-4 py-3 hover:bg-white/10 transition-colors rounded-xl"
            onClick={() => setOpenModal(true)}
          >
            <div className="p-1 bg-white/10 rounded-full border border-white/20 shadow-inner">
              <Avatar
                size="sm"
                variant="circular"
                src={userData?.avatar}
                alt=""
                className="w-6 h-6"
              />
            </div>
            <Typography variant="small" className="font-semibold text-white">
              My Profile
            </Typography>
          </MenuItem>
          <MenuItem
            aria-label="Logout"
            className="flex items-center gap-x-3 px-4 py-3 mt-1 hover:bg-red-500/20 text-red-200 transition-colors rounded-xl"
            onClick={handleClick}
            disabled={loading}
          >
            <div className={`p-1 rounded-full ${loading ? '' : 'bg-red-500/10 border border-red-500/20'}`}>
              {loading ? (
                <Spinner size="sm" className="h-5 w-5" />
              ) : (
                <LogoutIcon className="text-red-300 !text-xl" />
              )}
            </div>
            <Typography variant="small" className="font-semibold">
              {loading ? "Logging out..." : "Log Out"}
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
      {/* Modal component */}
      <ProfileModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userData={userData}
      />
    </>
  );
}
