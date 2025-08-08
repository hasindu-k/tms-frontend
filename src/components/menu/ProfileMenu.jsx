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

        <MenuList className="border-none rounded-[4px] shadow-xl px-5 md:px-8 my-2 overflow-hidden">
          <div className="mb-4 md:flex md:justify-center mx-5 text-nowrap">
            <Typography variant="small" className="font-medium">
              {userData?.name || "Guest"}
            </Typography>
          </div>

          <MenuItem
            aria-label="My Profile"
            className="flex items-center gap-x-2 "
            onClick={() => setOpenModal(true)}
          >
            <img
              className="w-7 h-7 rounded-full border border-primary-green"
              src={userData?.avatar}
              alt=""
            />
            <Typography variant="small" className="font-medium">
              My Profile
            </Typography>
          </MenuItem>
          <MenuItem
            aria-label="Logout"
            className="flex items-center gap-x-2 mt-1 ml-1"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <LogoutIcon className="mr-1" />
            )}
            <Typography variant="small" className="font-medium">
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
