import { useEffect, useCallback, useState } from "react";
import Menu from "../menu/MenuComponent";
import api from "../../api/axios";
import { useSnackbar } from "notistack";

const AssignUsers = ({ task, project, onAssignedUsersChange }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [assigned_users, setAssignedUsers] = useState([]);

  useEffect(() => {
    fetchProjectUsers();
  }, [project]);

  useEffect(() => {
    onAssignedUsersChange(assigned_users);
  }, [assigned_users]);

  useEffect(() => {
    fetchTaskUsers(task);
  }, [task, onAssignedUsersChange]);

  const fetchProjectUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await api.get(`/projects/users/${project}`);

      if (usersResponse?.data) {
        const Options = usersResponse.data.users.map((item) => ({
          label: item.email,
          id: item.id,
          avatar: item.avatar,
        }));
        setOptions(Options);
      }
    } catch (error) {
      enqueueSnackbar("An error occurred in fetching users. Please try again", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignUserToTask = async (userID) => {
    try {
      const response = await api.post(
        `/dashboard/managers/tasks/assign/${task}`,
        {
          user_ids: [userID],
        }
      );
      if (
        response.data.message === "Task assigned successfully to new users."
      ) {
        enqueueSnackbar("User assigned successfully", { variant: "success" });
        fetchTaskUsers(task);
      } else if (
        response.data.message ===
        "No new users were assigned. All provided users are already assigned to this task."
      ) {
        enqueueSnackbar("User is already assigned to the task", {
          variant: "warning",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred in assigned. Please try again", {
        variant: "error",
      });
    } finally {
      fetchProjectUsers();
    }
  };

  const unassignUserFromTask = async (userID) => {
    try {
      const response = await api.post(
        `/dashboard/managers/tasks/unassign/${task}`,
        {
          user_ids: [userID],
        }
      );
      if (response.status === 200) {
        enqueueSnackbar("User unassigned successfully", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred in unassigning. Please try again", {
        variant: "error",
      });
    } finally {
      fetchTaskUsers(task);
    }
  };

  const fetchTaskUsers = useCallback(async (task) => {
    setLoading(true);
    try {
      const usersResponse = await api.get(
        `/dashboard/managers/tasks/show/${task}`
      );

      if (usersResponse?.data) {
        const Options = usersResponse.data.data.assigned_users.map((item) => ({
          label: item.email,
          id: item.id,
          avatar: item.avatar,
        }));
        setOptions(Options);
        setAssignedUsers(usersResponse.data.data.assigned_users);
      }
    } catch (error) {
      enqueueSnackbar("An error occurred in fetching users. Please try again", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleButtonClicked = useCallback((button) => {
    if (button === "add") {
      setIsAddClicked(true);
      fetchTaskUsers(task);
      fetchProjectUsers();
    } else {
      fetchTaskUsers(task);
      setIsAddClicked(false);
    }
  }, []);

  const handleUserAdded = useCallback(
    (option) => {
      if (isAddClicked) {
        assignUserToTask(option.id);
      } else {
        unassignUserFromTask(option.id);
      }
    },
    [isAddClicked]
  );

  return (
    <Menu
      options={options}
      loading={loading}
      onSelection={handleUserAdded}
      onClickedButton={handleButtonClicked}
      isAdding={true}
      isRemoving={true}
    />
  );
};

export default AssignUsers;
