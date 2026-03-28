import React from "react";
import { TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  return (
    <>
      <div className="hidden lg:block relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm rounded-full block w-64 pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-white/40 focus:bg-white/15 transition-all placeholder-white/40"
        />
      </div>

      <button className="lg:hidden p-2 text-white/80 hover:text-white transition-colors">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </>
  );
};

export default SearchBar;
