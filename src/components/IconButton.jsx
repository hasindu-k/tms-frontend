import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const IconButton = ({ handleClick, isAdd }) => {
  return (
    <button
      className="py-1 px-2 text-[10px] md:text-[11px] text-white bg-secondary-green rounded-[4px] hover:bg-white hover:text-secondary-green"
      onClick={handleClick}
    >
      {isAdd && <FontAwesomeIcon icon={faPlus} />}
      {!isAdd && <FontAwesomeIcon icon={faMinus} />}
    </button>
  );
};

export default IconButton;
