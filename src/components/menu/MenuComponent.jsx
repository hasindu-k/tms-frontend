import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import IconButton from "../IconButton";
import SearchBar from "../SearchBar";
import { useUser } from "../../context/UserContext";
import { Button, Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const MenuComponent = ({
  options,
  loading,
  onSelection,
  isAdding,
  isRemoving,
  onClickedButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [isRemoveClicked, setIsRemoveClicked] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleOptionClick = (e, option) => {
    e.stopPropagation();
    setSelectedOption(option);
  };

  const handleSelection = (option) => {
    onSelection(option);
  };

  const handleAdd = () => {
    setIsAddClicked(true);
    setIsRemoveClicked(false);
    onClickedButton("add");
  };

  const handleRemove = () => {
    setIsRemoveClicked(true);
    setIsAddClicked(false);
    onClickedButton("remove");
  };

  return (
    <Menu open={isOpen} handler={() => setIsOpen(!isOpen)}>
      {user?.role === "manager" && (
        <MenuHandler>
          <div className="relative flex items-center">
            {isAdding && <IconButton isAdd={true} handleClick={handleAdd} />}
            {isRemoving && (
              <IconButton isAdd={false} handleClick={handleRemove} />
            )}
          </div>
        </MenuHandler>
      )}
      <MenuList className="z-50">
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
          {selectedOption ? (
            <Button onClick={() => handleSelection(selectedOption)}>
              {isAddClicked ? "Add" : "Remove"} {selectedOption.label}
            </Button>
          ) : (
            <>
              {isAddClicked && <Typography>Select a user to add</Typography>}
              {isRemoveClicked && (
                <Typography>Select a user to remove</Typography>
              )}
            </>
          )}
        </MenuItem>
        {isAddClicked &&
          options.map((option) => (
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
        {isRemoveClicked &&
          options.map((option) => (
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
};

export default MenuComponent;

MenuComponent.propTypes = {
  buttonText: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelection: PropTypes.func.isRequired,
  isAdding: PropTypes.bool.isRequired,
  isRemoving: PropTypes.bool.isRequired,
};
