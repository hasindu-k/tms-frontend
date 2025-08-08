import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import { Button, Skeleton } from "@mui/material";
import { useSnackbar } from "notistack";
import { useUser } from "../../context/UserContext";
import PropTypes from "prop-types";
import SearchBar from "../SearchBar";
import IconButton from "../IconButton";

export function InvitationMenu({ onUserAdded, selectedProjectID }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleOptionClick = (e, option) => {
    e.stopPropagation();
    setSelectedUser(option);
  };

  const handleAddClick = async (user) => {
    try {
      const response = await api.post(
        `/manager/projects/assign/${selectedProjectID}`,
        {
          user_ids: [user.id],
        }
      );
      if (response.data.message === "User assigned to project successfully.") {
        enqueueSnackbar("User added successfully", { variant: "success" });
      } else if (response.data.message === "User already added to project.") {
        enqueueSnackbar("User is already added to the project", {
          variant: "info",
        });
      }
      onUserAdded();
    } catch (error) {
      enqueueSnackbar("An error occurred in Adding. Please try again", {
        variant: "error",
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const assigningUser = user.id;
    try {
      const response = await api.get("/dashboard/managers/users");
      if (response?.data?.data) {
        const Options = response.data.data
          .filter((item) => item.id !== assigningUser)
          .map((item) => ({
            label: item.email, // Use the email as the label
            id: item.id, // Use the id from the response
            avatar: item.avatar, // Use the avatar from the response
          }));
        setOptions(Options);
      }
      return response.data.data;
    } catch (error) {
      enqueueSnackbar("An error occurred in fetching users. Please try again", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  return (
    <Menu open={isOpen} handler={() => setIsOpen(!isOpen)}>
      {user?.role === "manager" && (
        <MenuHandler>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center"
          >
            {isHovered ? (
              <button className="text-[7px] px-[1px] py-[1px] text-white bg-secondary-green rounded-[2px] hover:bg-primary-green/50 md:text-[13px] md:font-medium md:px-2 md:rounded-[4px]  duration-300 ">
                Add Users
              </button>
            ) : (
              <IconButton isAdd={true} handleClick={() => {}} />
            )}
          </div>
        </MenuHandler>
      )}
      <MenuList>
        <MenuItem>
          <div className="flex" onClick={handleClick}>
            {loading ? (
              <Skeleton variant="text" width={300} height={56} />
            ) : (
              <SearchBar />
            )}
          </div>
        </MenuItem>
        <MenuItem>
          {selectedUser ? (
            <Button onClick={() => handleAddClick(selectedUser)}>
              Add {selectedUser.label} - {selectedProjectID}
            </Button>
          ) : (
            <Typography>Select a user to invite</Typography>
          )}
        </MenuItem>
        {options.map((option) => (
          <div key={option.id} onClick={handleClick}>
            <MenuItem
              key={option.id}
              value={option.id}
              className="flex"
              onClick={(e) => handleOptionClick(e, option)} // Pass the option to the handler
            >
              <img
                src={option.avatar}
                alt={option.label}
                className="h-5 w-5 md:h-6 md:w-6 rounded-full mr-2"
              />
              {option.label}
            </MenuItem>
          </div>
        ))}
      </MenuList>
    </Menu>
  );
}

InvitationMenu.propTypes = {
  onUserAdded: PropTypes.func,
  selectedProjectID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
