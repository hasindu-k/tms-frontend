import React, { useEffect, useState } from "react";
import { MenuCustomList } from "../dropdown/MenuCustomList";
import api from "../../api/axios";
import PropTypes from "prop-types";
import { useUser } from "../../context/UserContext";

export function WorkspaceList({
  selectedProjectID,
  onProjectIDChange,
  onProjectsNullChange,
}) {
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const { user, loading: userLoading } = useUser();
  const [hasFetchedProjects, setHasFetchedProjects] = useState(false);

  const fetchProjects = async () => {
    if (!user || !user.role || hasFetchedProjects) return;
    try {
      setLoadingWorkspaces(true);
      let response;

      if (user.role === "user") {
        response = await api.get("users/projects");
      } else if (user.role === "manager") {
        response = await api.get("/projects/index");
      }
      const data = response.data;

      const projects = data.data;

      if (projects.length === 0) {
        onProjectsNullChange(true);
        setWorkspaceItems([]);
        return;
      }
      setHasFetchedProjects(true);
      setWorkspaceItems(
        projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
        }))
      );

      onProjectsNullChange(false);
      if (!selectedProjectID) {
        handleDefaultProject(projects);
      }
    } catch (error) {
      setLoadingWorkspaces(false);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user?.role && !hasFetchedProjects) {
      fetchProjects();
    }
  }, [userLoading, user?.role, hasFetchedProjects]);

  const handleTitleUpdate = (newID) => {
    onProjectIDChange(newID);
  };

  const handleDefaultProject = (projects) => {
    if (projects && projects.length > 0) {
      const defaultID = projects[0].id;
      handleTitleUpdate(defaultID);
      return defaultID;
    }
    return undefined;
  };

  return (
    <MenuCustomList
      onTitleChange={handleTitleUpdate}
      buttonText="Workspace"
      menuItems={workspaceItems}
      loading={loadingWorkspaces}
    />
  );
}

WorkspaceList.propTypes = {
  onProjectIDChange: PropTypes.func.isRequired,
  onProjectsNullChange: PropTypes.func.isRequired,
  selectedProjectID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
