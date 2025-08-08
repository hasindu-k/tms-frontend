import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const Pagination = ({
  current_page,
  last_page,
  onNext,
  onPrev,
  onPageClick,
}) => {
  const getItemProps = (index) => ({
    variant: current_page === index ? "filled" : "text",
    color: "gray",
    onClick: () => onPageClick(index),
  });

  return (
    <div className="flex flex-wrap items-center sm:gap-x-2 md:my-2 absolute bottom-0">
      <Button
        variant="text"
        className="flex items-center gap-x-2 text-gray-400 hover:text-white"
        onClick={onPrev}
        disabled={current_page === 1}
      >
        <ArrowLeftIcon
          strokeWidth={2}
          className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
        />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-x-1 sm:gap-x-2 flex-wrap justify-center">
        {Array.from({ length: last_page }, (_, i) => i + 1).map((page) => (
          <IconButton
            key={page}
            {...getItemProps(page)}
            className={`text-gray-400 ${
              page === current_page
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800 hover:text-white"
            }`}
          >
            {page}
          </IconButton>
        ))}
      </div>

      <Button
        variant="text"
        className="flex items-center gap-2 text-gray-400 hover:text-white"
        onClick={onNext}
        disabled={current_page === last_page}
      >
        <span className="hidden sm:block">Next</span>
        <ArrowRightIcon
          strokeWidth={2}
          className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
        />
      </Button>
    </div>
  );
};

Pagination.propTypes = {
  current_page: PropTypes.number.isRequired,
  last_page: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
};

export default Pagination;
