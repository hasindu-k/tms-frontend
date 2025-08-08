import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import MoreVert from "@mui/icons-material/MoreVert";
import Edit from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";

export default function PositionedMenu({ onEdit, onDelete }) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "outlined", color: "neutral" } }}
        style={{ transform: "rotate(90deg)" }}
      >
        <MoreVert />
      </MenuButton>
      <Menu placement="bottom-end">
        <MenuItem onClick={onEdit} className="!text-[10px] !md:text-sm">
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>{" "}
          Edit Comment
        </MenuItem>
        <ListDivider />
        <MenuItem
          variant="soft"
          color="danger"
          className="!text-[10px] !md:text-sm"
          onClick={onDelete}
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>{" "}
          Delete Comment
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
