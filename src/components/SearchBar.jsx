import React from "react";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <>
      <div className="xl:pl-5 hidden lg:block pt-2 !text-secondary-green focus:text-gray-200">
        <TextField
          className="!-mt-4"
          id="standard-basic"
          label="Search"
          variant="standard"
          sx={{
            "& .MuiInputLabel-root": {
              color: "#024356",
            },
            "& .MuiInputLabel-root:hover": {
              color: "#e5e7eb",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#e5e7eb",
            },
            "& .MuiInputBase-root": {
              color: "#024356",
            },
            "& .MuiInputBase-root:hover": {
              color: "#e5e7eb",
            },
            "& .MuiInputBase-root.Mui-focused": {
              color: "#e5e7eb",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "#024356",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "#e5e7eb",
            },
            "& .MuiInput-underline.Mui-focused:after": {
              borderBottomColor: "#e5e7eb",
            },
          }}
        />
      </div>

      <a className="mx-1 hover:text-gray-200 self-center" href="#">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </a>
    </>
  );
};

export default SearchBar;
