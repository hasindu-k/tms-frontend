import { getPriorityColor } from "../../../utils/getPriorityColor ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { useUser } from "../../../context/UserContext";
import CircularProgress from "@mui/material/CircularProgress";

export const RenderCard = ({ card, onClick, removeCard }) => {
  const { background, label } = getPriorityColor(card?.priority);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useUser();

  const deleteCard = useCallback(
    async (cardId) => {
      setLoading(true);
      try {
        const response = await api.delete(
          `/dashboard/managers/tasks/delete/${cardId}`
        );
        enqueueSnackbar(response.data.message, { variant: "success" });
        removeCard(cardId);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Unexpected error";
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar, removeCard]
  );

  const handleDeleteCard = useCallback(
    (cardId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Delete your Task",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        customClass: {
          popup: "bg-white rounded-[8px] shadow-2xl w-[300px]",
          title: "text-lg font-semibold text-secondary-green",
          confirmButton:
            "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
          cancelButton:
            "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteCard(cardId);
        }
      });
    },
    [deleteCard]
  );

  const renderLoadingState = () => {
    if (loading || userLoading) {
      return (
        <CircularProgress
          x={{ color: "#0899A3" }}
          className="!absolute right-0"
          size={20}
        />
      );
    } else {
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCard(card?.id);
          }}
          className="text-red-500 mt-2 ml-5 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
        >
          {user?.role === "manager" && (
            <FontAwesomeIcon
              className="hover:text-red-500/80 cursor-pointer text-[15px]"
              icon={faTrash}
            />
          )}
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => onClick(card)}
      className={`relative rounded-lg p-4 shadow-sm mb-2 w-[300px] m-1 group 
        ${background}`}
    >
      <div className="color-labels flex gap-1 mb-1">
        <div className={`w-7 h-1 rounded-lg ${label}`}></div>
      </div>
      <div className="flex">
        <h5 className="font-medium text-sm break-words text-wrap max-w-[270px] text-gray-800">
          {card?.title}
        </h5>
      </div>

      <div className="flex relative mt-1">
        <p className="text-gray-600 mt-2">#{card?.id}</p>
        {renderLoadingState()}
        <div className="absolute right-0 avatar-container flex gap-1 mt-2">
          {card?.assigned_users?.length > 0 ? (
            <ul className="flex">
              {card.assigned_users.map((user, index) => (
                <li key={user.id}>
                  <img
                    className="bg-[#D3B3FF] h-5 w-5 md:h-6 md:w-6 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                </li>
              ))}
            </ul>
          ) : (
            user?.role === "manager" && (
              <ul className="flex">
                <li>
                  <img
                    className="bg-[#D3B3FF] h-5 w-5 md:h-6 md:w-6 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                </li>
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};
