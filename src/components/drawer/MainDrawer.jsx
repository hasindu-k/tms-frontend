import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";

export default function MainDrawer({ open, onClose }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
        <div className="p-4">
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 hover:bg-gray-200 rounded"
              >
                <HomeIcon className="mr-3" />
                <span>Home</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 hover:bg-gray-200 rounded"
              >
                <GitHubIcon className="mr-3" />
                <span>GitHub</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 hover:bg-gray-200 rounded"
              >
                <MailIcon className="mr-3" />
                <span>Contact</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center p-2 hover:bg-gray-200 rounded"
              >
                <InfoIcon className="mr-3" />
                <span>About Us</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-4 right-4  p-2 hover:bg-gray-200 rounded cursor-pointer">
          <LogoutIcon className="mr-3" />
          <span>LogOut</span>
        </div>
      </Box>
    </Drawer>
  );
}
