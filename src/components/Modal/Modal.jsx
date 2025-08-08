import Tags from "./components/Tags";
import PositionedMenu from "../dropdown/PositionedMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faClipboardList,
  faComment,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { getPriorityColor } from "../../utils/getPriorityColor ";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import { useSnackbar } from "notistack";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";
import { useUser } from "../../context/UserContext";
import AssignUsers from "../List/AssignUsers";

function Modal({ isOpen, toggleModal, task: task, initialTask, project }) {
  const [taskId, setTaskId] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [inputComment, setInputComment] = useState("");
  const { user, loading } = useUser();
  const { background, label } = getPriorityColor(task?.priority);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [taskState, setTaskState] = useState(initialTask);

  useEffect(() => {
    if (isOpen && task) {
      setTaskId(task?.id);
      fetchComments(task?.id);
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (isOpen && task?.assigned_users && assignedUsers) {
      setTaskState((prevTask) => ({
        ...prevTask,
        assigned_users: assignedUsers,
      }));
    }
  }, [isOpen, assignedUsers]);

  const handleAssignedUsersChange = useCallback((users) => {
    setAssignedUsers(users);
  }, []);

  const fetchComments = useCallback(async (taskId) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/comments/${taskId}`);
      const commentsArray = response.data.data.flat();
      setComments(commentsArray);
    } catch (error) {
      enqueueSnackbar("Cannot retrieve comments", { variant: "error" });
    } finally {
      setLoading(false);
    }
  });

  const handlePostComment = useCallback(async () => {
    if (!inputComment.trim()) {
      enqueueSnackbar("Comment cannot be empty", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        `/dashboard/managers/comments/create/${taskId}`,
        { comment: inputComment }
      );
      enqueueSnackbar(response.data.message, { variant: "success" });
      fetchComments(taskId);

      setInputComment("");
    } catch (error) {
      enqueueSnackbar("Failed to post comment", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [inputComment, enqueueSnackbar, taskId, fetchComments]);

  const handleDelete = useCallback(
    async (commentId) => {
      try {
        const response = await api.delete(
          `/dashboard/managers/comments/delete/${commentId}`
        );
        enqueueSnackbar(response.data.message, { variant: "success" });
        fetchComments(taskId);
      } catch (error) {
        enqueueSnackbar("Failed to delete comment", { variant: "error" });
      }
    },
    [enqueueSnackbar, fetchComments, taskId]
  );

  const handleDeleteComment = useCallback(
    (commentId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Delete your comment",
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
          handleDelete(commentId);
        }
      });
    },
    [handleDelete]
  );
  const handleUpdateComment = useCallback(
    async (commentId) => {
      const { value: updatedText } = await Swal.fire({
        input: "textarea",
        inputLabel: "Update Comment",
        inputPlaceholder: "Type your updated comment here...",
        confirmButtonText: "Update",
        inputAttributes: {
          "aria-label": "Type your updated comment here",
        },
        customClass: {
          popup: "bg-white rounded-[4px] shadow-2xl",
          title: "text-lg font-semibold text-secondary-green",
          input:
            "rounded-[4px] p-2 outline-none focus:outline-none focus:ring-2 focus:ring-primary-green",
          confirmButton:
            "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
          cancelButton:
            "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
        },
        showCancelButton: true,
      });
      if (updatedText) {
        setLoading(true);
        try {
          const response = api.patch(
            `/dashboard/managers/comments/update/${commentId}`,
            { comment: updatedText }
          );
          enqueueSnackbar("Comment Updated Successfully", {
            variant: "success",
          });
          fetchComments(taskId);
        } catch (error) {
          enqueueSnackbar("Failed to update comment", { variant: "error" });
        } finally {
          setLoading(false);
        }
      }
    },
    [enqueueSnackbar, fetchComments, taskId]
  );

  const handleUpdateDescription = useCallback(
    async (taskId) => {
      const { value: updatedText } = await Swal.fire({
        input: "textarea",
        inputLabel: "Update Description",
        inputPlaceholder: "Type your updated Description here...",
        confirmButtonText: "Update",
        inputAttributes: {
          "aria-label": "Type your updated Description here",
        },
        customClass: {
          popup: "bg-white rounded-[4px] shadow-2xl",
          title: "text-lg font-semibold text-secondary-green",
          input:
            "rounded-[4px] p-2 outline-none focus:outline-none focus:ring-2 focus:ring-primary-green",
          confirmButton:
            "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
          cancelButton:
            "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
        },
        showCancelButton: true,
      });

      if (updatedText) {
        setLoading(true);
        try {
          const response = await api.patch(
            `/dashboard/managers/tasks/edit/description/${taskId}`,
            {
              description: updatedText,
            }
          );

          if (response.status === 200) {
            task.description = updatedText;
            enqueueSnackbar("Description updated successfully", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update description", {
              variant: "error",
            });
          }
        } catch (error) {
          enqueueSnackbar("An error occurred while updating the description", {
            variant: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [task, enqueueSnackbar]
  );

  const updatePriority = useCallback(
    async (taskId) => {
      const inputOptions = {
        1: "Low",
        2: "Medium",
        3: "High",
      };

      const { value: inputOption } = await Swal.fire({
        title: "Select Priority",
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
          if (!value) {
            return "You need to choose a priority!";
          }
        },
        customClass: {
          popup: "bg-white rounded-[4px] shadow-2xl",
          title: "text-lg font-semibold text-secondary-green",
          confirmButtonText: "Update",
          confirmButton:
            "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
          cancelButton:
            "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
        },
        showCancelButton: true,
      });

      if (inputOption) {
        setLoading(true);
        try {
          const response = await api.patch(
            `/dashboard/managers/tasks/edit/priority/${taskId}`,
            {
              priority: inputOption,
            }
          );

          if (response.status === 200) {
            task.priority = inputOption;
            enqueueSnackbar("Priority updated successfully", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update priority", {
              variant: "error",
            });
          }
        } catch (error) {
          enqueueSnackbar("An error occurred while updating the priority", {
            variant: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [enqueueSnackbar, task]
  );

  const updateEstimatedTime = useCallback(
    async (taskId) => {
      const { value: updatedTime } = await Swal.fire({
        input: "text",
        inputLabel: "Update Estimated Time",
        inputPlaceholder: "e.g., 5.30",
        confirmButtonText: "Update",
        customClass: {
          popup: "bg-white rounded-[4px] shadow-2xl",
          title: "text-lg font-semibold text-secondary-green",
          input:
            "rounded-[4px] p-1 outline-none focus:outline-none focus:ring-2 focus:ring-primary-green",
          confirmButton:
            "py-1 px-2 text-sm font-semibold mr-2 text-white bg-secondary-green rounded-[4px] hover:bg-secondary-green/80",
          cancelButton:
            "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
        },
        showCancelButton: true,
      });
      if (updatedTime) {
        setLoading(true);
        try {
          const response = await api.patch(
            `/dashboard/managers/tasks/edit/estimated-time/${taskId}`,
            {
              estimated_time: updatedTime,
            }
          );

          if (response.status === 200) {
            task.estimated_time = updatedTime;
            enqueueSnackbar("Estimated time updated successfully", {
              variant: "success",
            });
          } else {
            enqueueSnackbar("Failed to update Estimated time", {
              variant: "error",
            });
          }
        } catch (error) {
          enqueueSnackbar(
            "An error occurred while updating the Estimated time",
            {
              variant: "error",
            }
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [enqueueSnackbar, task]
  );

  return (
    <div className="body-container">
      {/* Modal and background blur */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background blur */}
          <div className="fixed z-40 inset-0 bg-black bg-opacity-50 backdrop-blur-sm " />

          {/* Modal with transition */}
          <div
            onClick={toggleModal}
            className="max-h-screen overflow-y-auto z-50 lg:w-full lg-max-w-[800px] rounded-lg md:p-5 mb-10"
          >
            {/* Modal content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative body-row flex flex-col w-[90%] md:w-[100%] lg:w-[55%] gap-4 px-3 md:px-5 mx-auto mt-10 overflow-x-hidden lg:mt-20 bg-[#D9D9D9] h-auto rounded-[4px] py-4  mb-5"
            >
              {/* Project Section */}
              <div className="project-info flex flex-col">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-secondary-green">
                  <span className="flex gap-2 md:gap-3 lg:gap-4">
                    <FontAwesomeIcon icon={faListCheck} />
                    <a
                      className="flex-1 break-words text-wrap text-sm max-w-[150px] md:max-w-[400px] lg:max-w-[420px]"
                      href="#"
                    >
                      {task?.title}
                    </a>
                    {/* Close button */}
                    <button
                      className="absolute right-3 flex justify-end
                        text-gray-500 hover:text-gray-700"
                      onClick={toggleModal}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                  </span>
                </h3>
                <span className="underline text-[12px] md:text-[14px] lg:text-[15px] font-normal text-secondary-green ml-4 md:ml-6 lg:ml-10">
                  {task?.status}
                </span>
              </div>

              {/* Members, Priority, Card No, Estimated Time */}
              <div className="data-row flex flex-col mt-4 md:flex-row justify-between px-4 md:px-[24px]">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* Members Section */}
                  <div className="members-container px-1">
                    <h3 className="text-sm md:text-base font-semibold text-secondary-green">
                      Members
                    </h3>
                    <div className="avatar-container flex gap-1">
                      {taskState?.assigned_users?.length > 0 ? (
                        <ul className="flex">
                          {taskState?.assigned_users?.map((user, index) => (
                            <li
                              className={index === 0 ? "" : "-ml-[4%]"}
                              key={user?.id}
                            >
                              <img
                                className="bg-[#D3B3FF] h-5 w-5 md:h-6 md:w-6 rounded-full"
                                src={user?.avatar}
                                alt={user?.name}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="flex ">
                          <li className="bg-[#D3B3FF] h-5 w-5 md:h-6 md:w-6 rounded-full"></li>
                          <li className="bg-[#7a6def] h-5 w-5 md:h-6 md:w-6  rounded-full -ml-[10%]"></li>
                          <li className="bg-[#FFD27F] h-5 w-5  md:h-6 md:w-6 rounded-full -ml-[10%]"></li>
                        </ul>
                      )}
                      <AssignUsers
                        task={task.id}
                        project={project}
                        className="z-52"
                        onAssignedUsersChange={handleAssignedUsersChange}
                      />
                    </div>
                  </div>

                  {/* Priority Section */}
                  <div className="priority-container px-1">
                    <h3 className="text-sm md:text-base font-semibold text-secondary-green pl-1">
                      Priority
                    </h3>
                    <div className="relative tag-container flex hover:cursor-pointer group">
                      <div className="w-full h-full object-cover rounded-full text-center">
                        {task.priority == 1 && (
                          <Tags tagName="Low" tagColor={label} />
                        )}
                        {task.priority == 2 && (
                          <Tags tagName="Medium" tagColor={label} />
                        )}
                        {task.priority == 3 && (
                          <Tags tagName="High" tagColor={label} />
                        )}
                      </div>

                      {user?.role === "manager" && (
                        <div className="absolute rounded-[4px] inset-1 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300 ease-in-out">
                          <div
                            onClick={() => updatePriority(task?.id)}
                            className="text-white font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          >
                            Edit
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card No and Estimated Time aligned to the right */}
                <div className="flex items-end gap-3 mt-4 md:mt-0">
                  <div className="card-no-container px-1">
                    <h3 className="text-sm md:text-base font-semibold text-secondary-green">
                      Card No
                    </h3>
                    <Tags tagName={`#${task?.id}`} tagColor="bg-[#969696]" />
                  </div>

                  <div className="estimated-time-container px-1">
                    <h3 className="text-sm md:text-base font-semibold text-secondary-green">
                      Estimated Time
                    </h3>
                    <div className="relative tag-container flex  hover:cursor-pointer group">
                      <div className="text-nowrap">
                        <Tags
                          tagName={`Hours - ${task?.estimated_time ?? 0}`}
                          tagColor="bg-[#969696]"
                        />
                      </div>

                      {user?.role === "manager" && (
                        <div className="absolute rounded-[4px] inset-1 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300 ease-in-out">
                          <div
                            onClick={() => updateEstimatedTime(task?.id)}
                            className="text-white font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          >
                            Edit
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="data-row flex justify-between px-4 md:px-[24px] pt-4 md:pt-5">
                <div className="flex">
                  <h3 className="text-sm md:text-base font-semibold text-secondary-green">
                    <span className="flex gap-2 pl-1">
                      <FontAwesomeIcon icon={faClipboardList} />
                      <a className="-mt-1.5" href="#">
                        Description
                      </a>
                    </span>
                  </h3>
                </div>
                <div className="pr-2">
                  <button
                    onClick={() => handleUpdateDescription(task?.id)}
                    className="py-1 px-2 text-[10px] md:text-[11px] text-white bg-secondary-green rounded-[4px] hover:bg-white hover:text-secondary-green"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p className="w-full md:w-[70%] text-sm md:text-base font-normal text-black -mt-2 pl-4 md:pl-6">
                {Loading ? (
                  <Skeleton variant="text" className="h-4 w-3/4" />
                ) : (
                  <p className="text-xs md:text-sm text-wrap px-5 max-w-full whitespace-normal break-words">
                    {task?.description}
                  </p>
                )}
              </p>

              {/* Comments */}
              <div className="flex w-full gap-4 px-3 md:px-5 mt-10 h-auto rounded-[4px] pb-4">
                <div className="items-center shadow-lg w-full bg-[#f0f1f3] h-auto p-2 rounded-[4px]">
                  <div className="pb-5">
                    <h1 className="text-base font-semibold text-secondary-green mb-5">
                      <FontAwesomeIcon className="mr-1" icon={faComment} />
                      Comments
                    </h1>
                    <TextareaAutosize
                      className="w-full h-24 text-sm font-normal p-3 rounded-[4px] border border-slate-300 focus:border-primary-green focus:outline-none"
                      aria-label="empty textarea"
                      placeholder="Write your comment here..."
                      value={inputComment}
                      onChange={(e) => setInputComment(e.target.value)}
                    />
                    <button
                      className="py-1 px-2 ml-[3px] !mb-2 mt-2 md:mt-4 text-[10px] md:text-[11px] text-white bg-secondary-green rounded-[4px] hover:bg-white hover:text-secondary-green"
                      onClick={handlePostComment}
                    >
                      Post
                    </button>
                  </div>

                  {Loading ? (
                    <div className="flex flex-col p-5">
                      {[...Array(1)].map((_, index) => (
                        <div
                          key={index}
                          className="flex mt-4 gap-2 items-start"
                        >
                          <div className="flex flex-col h-6 w-6 rounded-full">
                            <Skeleton variant="circular" />
                          </div>
                          <div className="flex flex-col flex-auto">
                            <div className="flex justify-between items-center w-full">
                              <Skeleton variant="text" className="h-4 w-1/2" />
                              <div className="pr-2">
                                <Skeleton
                                  variant="rectangular"
                                  width={30}
                                  height={30}
                                />
                              </div>
                            </div>
                            <Skeleton variant="text" className="h-3 w-1/4" />
                            <Skeleton variant="text" className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index}>
                        <div className="flex mt-4 gap-2 items-start">
                          <img
                            src={comment?.user?.avatar}
                            className="bg-[#D3B3FF] h-6 w-6 md:h-8 md:w-8 rounded-full"
                            alt="User Avatar"
                          />
                          <div className="flex flex-col flex-auto">
                            <div className="flex justify-between items-center w-full">
                              <span className="-mt-3 text-xs md:text-sm font-medium">
                                {comment?.user?.email}
                              </span>
                              <div className="pr-2">
                                <PositionedMenu
                                  onDelete={() =>
                                    handleDeleteComment(comment?.id)
                                  }
                                  onEdit={() =>
                                    handleUpdateComment(comment?.id)
                                  }
                                />
                              </div>
                            </div>
                            <span className="-mt-3 text-[10px] md:text-[11px] font-thin text-gray-500">
                              {comment?.updated_at &&
                              comment.updated_at !== comment.created_at
                                ? comment.updated_at
                                : comment.created_at}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pl-9 w-full">
                          <p className="text-xs md:text-sm text-wrap max-w-full whitespace-normal break-words">
                            {comment?.comment}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
