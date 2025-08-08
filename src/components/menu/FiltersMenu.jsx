import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";

const FiltersMenu = ({ onApplyFilters }) => {
  const initialFilters = {
    status: [],
    priority: [],
    date_range: "",
    date_field: "created_at",
    sort_by: "created_at",
    sort_order: "asc",
    assigned_by_manager: false,
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const { user, loading: userLoading } = useUser();

  const resetFilters = () => {
    setSelectedFilters(initialFilters);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleStatusChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) => {
      const newStatus = checked
        ? [...prevFilters.status, value]
        : prevFilters.status.filter((status) => status !== value);
      return { ...prevFilters, status: newStatus };
    });
  };

  const handlePriorityChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) => {
      const newPriority = checked
        ? [...prevFilters.priority, value]
        : prevFilters.priority.filter((priority) => priority !== value);
      return { ...prevFilters, priority: newPriority };
    });
  };

  const handleDateRangeChange = (event) => {
    const { value } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      date_range: value,
    }));
  };

  const handleSortByChange = (event) => {
    const { value } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      sort_by: value,
    }));
  };

  const handleSortOrderChange = (event) => {
    const { value } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      sort_order: value,
    }));
  };

  const applyFilters = () => {
    onApplyFilters(selectedFilters);
    setIsMenuOpen(false);
  };

  const handleAssignFilterChange = (e) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      assigned_by_manager: e.target.checked,
    }));
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleMenu}
        className="text-[9px] px-[2px] py-[1px] text-white bg-secondary-green rounded-[2px] hover:bg-primary-green md:text-[15px] md:font-semibold md:px-2 md:rounded-[4px]"
      >
        <FontAwesomeIcon className="mr-1" icon={faBars} />
        Filters
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-3 mt-5 w-[182px] md:w-[230px] lg:w-65 bg-white/90 shadow-md rounded-md p-2 px-5 z-50">
          <h3 className="text-center text-secondary-green text-sm font-semibold mb-2">
            Filter by Status
          </h3>
          <div className="flex flex-col text-[13px] md:text-[15px]">
            {["todo", "in-progress", "completed"].map((status) => (
              <div key={status} className="inline-flex items-center md:mb-1">
                <label className="flex items-center cursor-pointer relative">
                  <input
                    value={status}
                    onChange={handleStatusChange}
                    checked={selectedFilters.status.includes(status)}
                    type="checkbox"
                    className="peer h-3 w-3 md:h-5 md:w-5 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-primary-green/50 checked:border-primary-green"
                  />
                  <span className="absolute text-white text-[9px] md:text-[12px] font-bold opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>
                <span className="ml-2 capitalize">
                  {status.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
          <hr className="md:my-2 lg:my-5" />
          <h3 className="text-center text-sm font-semibold my-2 lg:my-4 text-secondary-green">
            Filter by Priority
          </h3>
          <div className="flex flex-col text-[13px] md:text-[15px]">
            {["1", "2", "3"].map((priority) => (
              <div key={priority} className="inline-flex items-center mb-1">
                <label className="flex items-center cursor-pointer relative">
                  <input
                    value={priority}
                    onChange={handlePriorityChange}
                    checked={selectedFilters.priority.includes(priority)}
                    type="checkbox"
                    className="peer h-3 w-3 md:h-5 md:w-5 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-primary-green/50 checked:border-primary-green"
                  />
                  <span className="absolute text-white text-[9px] md:text-[12px] font-bold opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>
                <span className="ml-2">
                  {priority === "1"
                    ? "Low"
                    : priority === "2"
                    ? "Medium"
                    : "High"}
                </span>
              </div>
            ))}
          </div>

          <hr className="md:my-2 lg:my-5" />

          <h3 className="text-center text-sm font-semibold my-2 lg:my-4 text-secondary-green">
            Filter by Assign
          </h3>
          {user?.role === "manager" && (
            <div className="flex flex-col text-[13px] md:text-[15px]">
              <div className="inline-flex items-center mb-1">
                <label className="flex items-center cursor-pointer relative">
                  <input
                    value="assignedByManager"
                    onChange={handleAssignFilterChange}
                    checked={selectedFilters.assigned_by_manager || false}
                    type="checkbox"
                    className="peer h-3 w-3 md:h-5 md:w-5 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-primary-green/50 checked:border-primary-green"
                  />
                  <span className="absolute text-white text-[9px] md:text-[12px] font-bold opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </label>
                <span className="ml-2">Assigned by You</span>
              </div>
            </div>
          )}

          <hr className="md:my-2 lg:my-5" />

          <h3 className="text-center text-sm font-semibold my-1 md:my-2 lg:my-4 text-secondary-green">
            Filter by Date Range
          </h3>
          <select
            value={selectedFilters.date_range}
            onChange={handleDateRangeChange}
            className="border rounded-md p-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 text-[13px] md:text-sm text-secondary-green"
          >
            <option
              className="focus:bg-primary-green hover:text-white  text-[13px] md:text-sm"
              value=""
            >
              Select Date Range
            </option>
            <option
              className="hover:bg-primary-green hover:text-white text-[13px] md:text-sm"
              value="last_24_hours"
            >
              Last 24 Hours
            </option>
            <option
              className="hover:bg-primary-green hover:text-white text-[13px] md:text-sm"
              value="last_7_days"
            >
              Last 7 Days
            </option>
            <option
              className="hover:bg-primary-green hover:text-white text-[13px] md:text-sm"
              value="last_14_days"
            >
              Last 14 Days
            </option>
            <option
              className="hover:bg-primary-green hover:text-white text-[13px] md:text-sm"
              value="last_month"
            >
              Last Month
            </option>
          </select>

          <hr className="my-1 md:3 lg:my-5" />

          <h3 className="text-center text-sm font-semibold my-1 lg:my-4 text-secondary-green">
            Sort by
          </h3>
          <div>
            <select
              value={selectedFilters.sort_by}
              onChange={handleSortByChange}
              className="border rounded-md p-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 text-[13px] md:text-sm text-secondary-green"
            >
              <option value="created_at">Created At</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>

            <hr className="my-2 md:my-3 lg:my-5" />

            <div className="flex gap-1 lg:gap-10">
              <div className="inline-flex items-center">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    value="asc"
                    className="peer h-3 w-3 md:h-5 md:w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary-green transition-all"
                    onChange={handleSortOrderChange}
                    checked={selectedFilters.sort_order === "asc"}
                  />
                  <span className="absolute bg-primary-green/50 w-2 h-2 md:w-3 md:h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                </label>
                <label className="ml-2 text-secondary-green cursor-pointer text-[13px] md:text-sm">
                  Asc
                </label>
              </div>

              <div className="inline-flex">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sortOrder"
                    value="desc"
                    className="peer h-3 w-3 md:h-5 md:w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-primary-green transition-all"
                    onChange={handleSortOrderChange}
                    checked={selectedFilters.sort_order === "desc"}
                  />
                  <span className="absolute bg-primary-green/50 w-2 h-2 md:w-3 md:h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                </label>
                <label className="ml-2 text-secondary-green cursor-pointer text-[13px] md:text-sm">
                  Desc
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={applyFilters}
              className="py-1 px-2 text-[13px] md:text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80"
            >
              Apply Filter
            </button>
            <button
              onClick={resetFilters}
              className="bg-red-500 px-2 text-white py-1 rounded-[4px] text-[13px] md:text-sm font-semibold hover:bg-red-500/80"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersMenu;
