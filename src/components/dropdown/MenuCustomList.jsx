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
  cardIcon = <CursorArrowRaysIcon strokeWidth={1} className="h-10 w-10 text-white" />,
  onTitleChange,
  loading = false,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [cardTitle, setCardTitle] = useState(menuItems[0]?.title || "Select a project");
  const [cardDescription, setCardDescription] = useState(
    menuItems[0]?.description || "Choose from your workspace projects"
  );

  // Sync card content with menuItems when they load
  React.useEffect(() => {
    if (menuItems.length > 0 && cardTitle === "Select a project") {
      setCardTitle(menuItems[0].title);
      setCardDescription(menuItems[0].description);
    }
  }, [menuItems]);

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
          className="flex items-center gap-3 text-base capitalize tracking-normal font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all rounded-lg px-3 py-2"
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
      <MenuList className="w-[15rem] md:w-[36rem] grid-cols-7 gap-3 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl md:grid text-white p-2 shadow-2xl ring-1 ring-white/10 z-[9999]">
        <Card
          color="transparent"
          shadow={false}
          className="col-span-3 flex h-full w-full items-center justify-center rounded-xl p-4 bg-white/5 border border-white/10 text-white"
        >
          {cardIcon}
          <Typography className="mt-5 text-center text-white" variant="h5">
            {cardTitle}
          </Typography>
          <Typography className="mt-2 text-center text-white/70" variant="small">
            {cardDescription}
          </Typography>
        </Card>
        <ul className="col-span-4 flex w-full flex-col gap-1">
          {menuItems.map(({ id, title, description }, index) => (
            <MenuItem
              key={id || index}
              onClick={() => handleMenuItemClick(id, title, description)}
              className="hover:bg-white/10 active:bg-white/20 transition-all rounded-lg p-3 group focus:bg-white/10 outline-none"
            >
              {loading ? (
                <>
                  <Skeleton variant="text" width={150} height={25} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <Skeleton
                    variant="text"
                    width={250}
                    height={15}
                    className="mt-1"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  />
                </>
              ) : (
                <div className="w-full">
                  <Typography variant="h6" className="mb-0.5 text-white font-bold group-hover:text-white transition-colors">
                    {title}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-white/60 group-hover:text-white/80 transition-colors line-clamp-1"
                  >
                    {description}
                  </Typography>
                </div>
              )}
            </MenuItem>
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  cardIcon: PropTypes.element,
  onTitleChange: PropTypes.func,
  loading: PropTypes.bool,
};
