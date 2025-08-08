import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import {
  ControlledBoard,
  moveCard,
  moveColumn,
} from "@caldwell619/react-kanban";
import "@caldwell619/react-kanban/dist/styles.css";
import { RenderCard } from "./components/renderCard";
import Modal from "../Modal/Modal";
import { useUser } from "../../context/UserContext";
import Skeleton from "@mui/material/Skeleton";
import { getStatusByColumnId } from "../../utils/taskUtils";
import { debounce } from "lodash";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../pagination/Pagination";

const COLUMN_TITLES = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const COLUMN_IDS = {
  TODO: 1,
  IN_PROGRESS: 2,
  DONE: 3,
};

const Board = ({ selectedProjectID, selectedFilters }) => {
  const [board, setBoard] = useState({
    columns: [
      { id: COLUMN_IDS.TODO, title: COLUMN_TITLES.TODO, cards: [] },
      {
        id: COLUMN_IDS.IN_PROGRESS,
        title: COLUMN_TITLES.IN_PROGRESS,
        cards: [],
      },
      { id: COLUMN_IDS.DONE, title: COLUMN_TITLES.DONE, cards: [] },
    ],
  });
  const [formVisibility, setFormVisibility] = useState({});

  const [newCardDetails, setNewCardDetails] = useState({
    title: "",
    description: "",
    estimated_time: "",
    priority: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { user, loading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  });

  const mapTasksToCards = useCallback((tasks) => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      estimated_time: task.estimated_time,
      priority: task.priority,
      project_id: task.project_id,
      assigned_users: task.assigned_users,
    }));
  }, []);

  const fetchManagerTasks = useCallback(
    async (url = null, page = null) => {
      if (!selectedProjectID) {
        enqueueSnackbar("No project selected.", { variant: "info" });
        return;
      }
      setIsLoading(true);
      setBoard({
        columns: [
          { id: COLUMN_IDS.TODO, title: COLUMN_TITLES.TODO, cards: [] },
          {
            id: COLUMN_IDS.IN_PROGRESS,
            title: COLUMN_TITLES.IN_PROGRESS,
            cards: [],
          },
          { id: COLUMN_IDS.DONE, title: COLUMN_TITLES.DONE, cards: [] },
        ],
      });
      try {
        const baseUrl = selectedFilters.assigned_by_manager
          ? `/dashboard/managers/tasks/assigned/${selectedProjectID}`
          : `/users/tasks/created/${selectedProjectID}`;

        const requestUrl = url || `${baseUrl}${page ? `?page=${page}` : ""}`;
        const requestPayload = {
          ...(selectedFilters?.status?.length > 0 && {
            status: selectedFilters.status,
          }),
          ...(selectedFilters?.priority?.length > 0 && {
            priority: selectedFilters.priority,
          }),
          ...(selectedFilters?.date_range && {
            date_range: selectedFilters.date_range,
          }),
          ...(selectedFilters?.date_field && {
            date_field: selectedFilters.date_field || "created_at",
          }),
          ...(selectedFilters?.sort_by && { sort_by: selectedFilters.sort_by }),
          ...(selectedFilters?.sort_order && {
            sort_order: selectedFilters.sort_order,
          }),
        };

        const response = await api.post(requestUrl, requestPayload);

        const groupedTasks = response.data?.grouped_tasks || {};
        const paginationData = response.data?.pagination || {};

        if (Object.keys(groupedTasks).length === 0) {
          enqueueSnackbar("No tasks found", { variant: "info" });
        } else {
          setPagination({
            current_page: paginationData.current_page,
            last_page: paginationData.last_page,
            next_page_url: paginationData.next_page_url,
            prev_page_url: paginationData.prev_page_url,
          });
          setBoard({
            columns: [
              {
                id: COLUMN_IDS.TODO,
                title: COLUMN_TITLES.TODO,
                cards: mapTasksToCards(groupedTasks["todo"]?.tasks || []),
              },
              {
                id: COLUMN_IDS.IN_PROGRESS,
                title: COLUMN_TITLES.IN_PROGRESS,
                cards: mapTasksToCards(
                  groupedTasks["in-progress"]?.tasks || []
                ),
              },
              {
                id: COLUMN_IDS.DONE,
                title: COLUMN_TITLES.DONE,
                cards: mapTasksToCards(groupedTasks["completed"]?.tasks || []),
              },
            ],
          });
        }
      } catch (error) {
        enqueueSnackbar(
          "Error occurred while fetching tasks. Please try again.",
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProjectID, enqueueSnackbar, mapTasksToCards, selectedFilters]
  );

  useEffect(() => {
    setPagination({
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    });
    fetchManagerTasks();
  }, [selectedProjectID, fetchManagerTasks]);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleNextPage = () => {
    if (pagination.next_page_url) {
      fetchManagerTasks(null, pagination.current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.prev_page_url) {
      fetchManagerTasks(null, pagination.current_page - 1);
    }
  };

  const handlePageClick = (page) => {
    fetchManagerTasks(null, page);
  };

  const handleCardClick = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleAddCard = useCallback(
    (columnId, newCard) => {
      const updatedColumns = board.columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: [...col.cards, newCard] };
        }
        return col;
      });

      setBoard((prevBoard) => ({
        ...prevBoard,
        columns: updatedColumns,
      }));
    },
    [board.columns]
  );

  const handleSubmit = useCallback(
    async (columnId) => {
      if (newCardDetails.title.trim() !== "" && selectedProjectID) {
        const newStatus = getStatusByColumnId(columnId);
        const newCard = {
          title: newCardDetails.title,
          estimated_time: newCardDetails.estimated_time,
          description: newCardDetails.description,
          status: newStatus,
          priority: newCardDetails.priority,
        };
        try {
          const response = await api.post(
            `/dashboard/managers/tasks/create/${selectedProjectID}`,
            newCard
          );

          const createdTask = response.data.data;
          enqueueSnackbar("Task created successfully!", { variant: "success" });

          handleAddCard(columnId, {
            id: createdTask.id,
            title: createdTask.title,
            estimated_time: createdTask.estimated_time,
            description: createdTask.description,
            priority: createdTask.priority,
          });
          setNewCardDetails({
            title: "",
            estimated_time: "",
            description: "",
            priority: "",
          });
          setFormVisibility((prev) => ({ ...prev, [columnId]: false }));
        } catch (error) {
          enqueueSnackbar("Error creating task", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Please provide a valid title", { variant: "warning" });
      }
    },
    [
      newCardDetails.title,
      newCardDetails.estimated_time,
      newCardDetails.description,
      newCardDetails.priority,
      selectedProjectID,
      enqueueSnackbar,
      handleAddCard,
    ]
  );

  const saveTaskStatus = useCallback(
    debounce(async (task, newColumnId) => {
      const newStatus = getStatusByColumnId(newColumnId);
      try {
        await api.patch(`/users/tasks/edit/status/${task.id}`, {
          status: newStatus,
        });
        enqueueSnackbar(`Task ${task.id} status updated to ${newStatus}`, {
          variant: "info",
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          enqueueSnackbar("You don't have permission", { variant: "warning" });
        } else {
          enqueueSnackbar("Error updating task status", { variant: "warning" });
        }
      }
    }, 300),
    []
  );

  const toggleFormVisibility = useCallback((id) => {
    setFormVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCardMove = useCallback(
    (card, source, destination) => {
      setBoard((currentBoard) => moveCard(currentBoard, source, destination));
      saveTaskStatus(card, destination.toColumnId);
    },
    [saveTaskStatus]
  );

  const handleColumnMove = useCallback((card, source, destination) => {
    setBoard((currentBoard) => moveColumn(currentBoard, source, destination));
  }, []);

  const removeCard = (cardId) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      })),
    }));
  };

  const handleCardDelete = useCallback((card, column) => {
    setBoard((currentBoard) => removeCard(currentBoard, column, card));
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Modal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        task={selectedTask}
        project={selectedProjectID}
      />
      {isLoading || userLoading ? (
        <div className="flex space-x-5 p-5">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col w-[320px]">
              <Skeleton
                variant="rectangular"
                className="!bg-slate-900 rounded-lg !h-[10vh] animate-pulse shadow-lg"
              />
              <div className="mt-2">
                <Skeleton
                  variant="text"
                  className="!bg-slate-700 rounded h-4 mb-1"
                />
                <Skeleton
                  variant="text"
                  className="!bg-slate-700 rounded h-3 mb-1 w-4/5"
                />
                <Skeleton
                  variant="text"
                  className="!bg-slate-700 rounded h-3 mb-1 w-3/5"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ControlledBoard
          renderColumnHeader={({ title, id }) => (
            <div className="column-header relative">
              <div className="title-container flex place-content-center text-lg font-semibold mb-2">
                <h2 className="tracking-wide text-secondary-green">{title}</h2>
              </div>
              <hr className=" bg-slate-400" />
              {user?.role === "manager" && (
                <div className="mb-2 absolute top-1 right-1">
                  <button
                    type="button"
                    onClick={() => toggleFormVisibility(id)}
                    className="bg-primary-green/50 text-white px-2 py-1 rounded-md flex items-center text-sm justify-center hover:bg-primary-green/90"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                  </button>
                </div>
              )}

              {formVisibility[id] && (
                <div className="card-form border border-gray-300 p-4 m-1 min-w-16 rounded-[4px] shadow-md bg-white">
                  <h3 className="text-md font-semibold mb-2">Add New Card</h3>
                  <div className="card-form-container flex flex-col">
                    <input
                      type="text"
                      placeholder="Card Title"
                      value={newCardDetails.title}
                      onChange={(e) =>
                        setNewCardDetails((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="border border-gray-300 p-2 mb-2 rounded-[4px] focus:border-secondary-green"
                    />
                    <input
                      type="number"
                      placeholder="Estimated time"
                      value={newCardDetails.estimated_time}
                      onChange={(e) =>
                        setNewCardDetails((prev) => ({
                          ...prev,
                          estimated_time: e.target.value,
                        }))
                      }
                      className="border border-gray-300 p-2 mb-2 rounded-[4px] focus:border-secondary-green"
                    />
                    <textarea
                      placeholder="Card Description"
                      value={newCardDetails.description}
                      onChange={(e) =>
                        setNewCardDetails((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="border border-gray-300 p-2 rounded-[4px] w-full focus:border-secondary-green"
                      rows="3"
                    />
                    <div className="flex items-center">
                      <InputLabel
                        sx={{ minWidth: "fit-content", marginRight: "3px" }}
                        id="priority"
                      >
                        Priority
                      </InputLabel>
                      <Select
                        id="priority"
                        value={newCardDetails.priority}
                        onChange={(e) =>
                          setNewCardDetails((prev) => ({
                            ...prev,
                            priority: e.target.value,
                          }))
                        }
                        sx={{
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          shadow: "none",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                        placeholder="Priority"
                      >
                        <MenuItem
                          className="!bg-green-500 !text-sm !text-white !flex !justify-center !rounded-full !mb-[1px]"
                          value={1}
                        >
                          Low
                        </MenuItem>
                        <MenuItem
                          className="!bg-blue-500 !text-sm !text-white !flex !justify-center !rounded-full !mb-[1px]"
                          value={2}
                        >
                          Medium
                        </MenuItem>
                        <MenuItem
                          className="!bg-red-500 !text-sm !text-white !flex !justify-center !rounded-full"
                          value={3}
                        >
                          High
                        </MenuItem>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSubmit(id)}
                      className="border border-gray-300 bg-secondary-green hover:bg-secondary-green/90 px-2 text-white py-1 rounded-[4px] text-sm font-semibold mr-2"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, [id]: false }))
                      }
                      className="bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          allowAddCard={false}
          allowRemoveCard={true}
          allowRemoveColumn
          allowAddColumn
          onCardDragEnd={handleCardMove}
          onColumnDragEnd={handleColumnMove}
          onCardRemove={({ card, column }) => handleCardDelete(card, column)}
          renderCard={(card) => (
            <RenderCard
              card={card}
              onClick={handleCardClick}
              removeCard={removeCard}
            />
          )}
        >
          {board}
        </ControlledBoard>
      )}
      <Pagination
        current_page={pagination.current_page}
        last_page={pagination.last_page}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        onPageClick={handlePageClick}
      />
    </div>
  );
};

export default Board;
