import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Card,
  Typography,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import Skeleton from "@mui/material/Skeleton";

// MenuCustomList Component
export function MenuCustomList({
  buttonText = "Dropdown",
  menuItems = [],
  cardIcon = <CursorArrowRaysIcon strokeWidth={1} className="h-10 w-10" />,
  onTitleChange,
  loading = false,
}) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [cardTitle, setCardTitle] = useState("Default project title");
  const [cardDescription, setCardDescription] = useState(
    "Default project description"
  );

  const handleMenuItemClick = (id, title, description) => {
    setCardTitle(title);
    setCardDescription(description);
    onTitleChange(id, title);
  };

  return (
    <Menu open={openMenu} handler={setOpenMenu} allowHover>
      <MenuHandler>
        <Button
          variant="text"
          className="flex items-center gap-3 text-base capitalize tracking-normal font-medium mt-0.5 text-gray-200 hover:text-secondary-green"
        >
          <span className="hidden md:block">{buttonText}</span>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="w-[15rem] md:w-[36rem] grid-cols-7 gap-3 bg-gray-300/95 rounded-[4px] md:grid text-secondary-green">
        <Card
          color="gray"
          shadow={false}
          className="col-span-3 flex h-full w-full items-center justify-center rounded-2xl p-4"
        >
          {cardIcon}
          <Typography className="mt-5 text-center" variant="h5">
            {cardTitle}
          </Typography>
          <Typography className="mt-2 text-center" variant="small">
            {cardDescription}
          </Typography>
        </Card>
        <ul className="col-span-4 flex w-full flex-col gap-1">
          {menuItems.map(({ id, title, description }, index) => (
            <div
              key={index}
              onClick={() => handleMenuItemClick(id, title, description)}
              className="cursor-pointer"
            >
              <MenuItem>
                {loading ? (
                  <>
                    <Skeleton variant="text" width={150} height={25} />
                    <Skeleton
                      variant="text"
                      width={250}
                      height={15}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      {title}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {description}
                    </Typography>
                  </>
                )}
              </MenuItem>
            </div>
          ))}
        </ul>
      </MenuList>
    </Menu>
  );
}

// Define PropTypes for the component
MenuCustomList.propTypes = {
  buttonText: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  cardIcon: PropTypes.element,
  cardTitle: PropTypes.string,
  cardDescription: PropTypes.string,
};
