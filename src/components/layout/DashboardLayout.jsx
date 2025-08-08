import { Outlet } from "react-router-dom";
import { WorkspaceList } from "../List/WorkspaceList";
import { ProfileMenu } from "../menu/ProfileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/axios";
import MainDrawer from "../drawer/MainDrawer";
import { faPlus, faBell } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Board from "../KanbanBoard/Board";
import Skeleton from "@mui/material/Skeleton";
import ProjectCreationModal from "../Modal/ProjectCreationModal";
import { InvitationMenu } from "../menu/InvitationMenu";
import GuestProject from "../Modal/GuestProject";
import { useSnackbar } from "notistack";
import LoadingProfileSkeleton from "../Skeleton/LoadingProfileSkeleton";
import PlaceholderAvatars from "../PlaceholderAvatars";
import UserAvatars from "../UserAvatars";
import DrawerButton from "../DrawerButton";
import SearchBar from "../SearchBar";
import FiltersMenu from "../menu/FiltersMenu";
import { useUser } from "../../context/UserContext";

const DashboardLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [isUserAdded, setIsUserAdded] = useState(false);
  const [isProjectsNull, setIsProjectsNull] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({ status: [] });
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (selectedProjectID) {
      fetchProjectData();
    }
  }, [selectedProjectID]);

  useEffect(() => {
    if (isUserAdded) {
      fetchProjectData();
      setIsUserAdded(false);
    }
  }, [isUserAdded]);

  const fetchProjectData = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/projects/show/${selectedProjectID}`);
      setProjectName(response.data.data.title);
      setLoadingUsers(true);

      const usersResponse = await api.get(
        `/projects/users/${selectedProjectID}`
      );
      setProjectUsers(usersResponse.data.users);
    } catch (error) {
      enqueueSnackbar("Error fetching project data", { variant: "error" });
    } finally {
      setLoading(false);
      setLoadingUsers(false);
    }
  };

  const handleUserAdded = useCallback(() => {
    setIsUserAdded(true);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleNewProjectCreation = (newProjectID) => {
    setSelectedProjectID(newProjectID);
    setIsProjectsNull(false);
  };

  const handleProjectIDChange = (newID) => {
    setSelectedProjectID(newID);
  };

  const handleProjectsNullChange = (value) => {
    setIsProjectsNull(value);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };

  const handleApplyFilters = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div className="!bg-background-green h-full">
      <nav className="bg-gradient-to-l from-[#5dd6de]  to-primary-green border-none">
        <div className="max-w-screen-xl flex flex-nowrap items-center justify-between mx-auto lg:pl-6 px-2">
          <div className="flex items-center mr-4 md:mr-10 lg:-ms-5">
            <div
              className="bg-[#024356] hover:bg-white p-1 rounded-[2px]"
              onClick={toggleDrawer(true)}
            >
              <DrawerButton />
            </div>
          </div>
          <a
            href="#"
            className="flex items-center space-x-1 rtl:space-x-reverse"
          >
            <img src="/images/logo_Icon_white.svg" className="h-5" alt="" />
            <img src="/images/only_text_white.svg" className="h-5" alt="" />
          </a>

          <div className="w-full md:w-auto" id="navbar-default">
            <ul className="font-medium flex p-1 md:flex-row md:space-x-8 rtl:space-x-reverse mt-0 md:border-0 w-full justify-between">
              <div className="flex !space-x-4 md:ml-5 lg:ml-14 xl:pl-20">
                <li className="pl-5">
                  <WorkspaceList
                    onProjectIDChange={handleProjectIDChange}
                    onProjectsNullChange={handleProjectsNullChange}
                    selectedProjectID={selectedProjectID}
                  />
                </li>
                {!isProjectsNull ? (
                  <li className="hidden md:block mt-4">
                    <button
                      className="py-1 px-2 text-white bg-secondary-green rounded-[4px] hover:bg-white hover:text-secondary-green"
                      onClick={() => setIsProjectModalOpen(true)}
                    >
                      Create
                    </button>
                  </li>
                ) : null}
              </div>
              <div className="flex xl:pl-60 mt-1 md:pl-[65px]">
                <li className="flex pl-1 pr-1">
                  {!isProjectsNull ? (
                    <div className="md:hidden bg-secondary-green mt-[9px] w-5 h-5 rounded-[4px] flex justify-center items-center hover:bg-white">
                      <button
                        className="text-white hover:text-secondary-green"
                        onClick={() => setIsProjectModalOpen(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ) : null}
                </li>
                <div className="md:ml-auto flex md:space-x-2 ">
                  <li className="flex mt-1">
                    <SearchBar />
                  </li>
                  <li className="flex mt-1 mx-1 self-center hover:text-gray-200">
                    <a href="#">
                      <FontAwesomeIcon icon={faBell} />
                    </a>
                  </li>
                  <li className="ml-1 -mt-0.5 sm:ml-0 sm:mt-0 flex items-center">
                    <ProfileMenu />
                  </li>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>

      <nav className="bg-[#cbcdd1] border-none">
        <div className="max-w-screen-xl flex flex-wrap items-start justify-between mx-auto py-3 px-2">
          {/* First Row: Left Section */}
          <div className="flex flex-wrap items-center space-x-3">
            <a
              href="#"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="font-normal text-[10px] text-secondary-green md:font-semibold md:text-[15px]">
                {loading ? (
                  <Skeleton variant="text" width={150} height={25} />
                ) : (
                  <h1>{projectName}</h1>
                )}
              </span>
            </a>
            <a className="h-[9px] w-[9px] mb-[0.9px]" href="#">
              <svg
                className="h-full w-full fill-secondary-green hover:fill-primary-green"
                viewBox="0 -0.69 31.596 31.596"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(-546.778 -131.249)">
                  <path d="M562.576,133.9l2.281,7.02a3.7,3.7,0,0,0,3.527,2.563h7.38l-5.971,4.338a3.7,3.7,0,0,0-1.347,4.146l2.281,7.019-5.971-4.338a3.709,3.709,0,0,0-4.359,0l-5.972,4.338,2.281-7.019a3.7,3.7,0,0,0-1.347-4.146l-5.971-4.338h7.381a3.7,3.7,0,0,0,3.526-2.563l2.281-7.02m0-2.652a1.678,1.678,0,0,0-1.625,1.18l-2.558,7.874a1.708,1.708,0,0,1-1.624,1.181H548.49a1.708,1.708,0,0,0-1.005,3.09l6.7,4.866a1.708,1.708,0,0,1,.621,1.91l-2.559,7.874a1.714,1.714,0,0,0,1.631,2.243,1.682,1.682,0,0,0,1-.334l6.7-4.866a1.709,1.709,0,0,1,2.008,0l6.7,4.866a1.682,1.682,0,0,0,1,.334,1.714,1.714,0,0,0,1.631-2.243l-2.559-7.874a1.709,1.709,0,0,1,.621-1.91l6.7-4.866a1.708,1.708,0,0,0-1-3.09h-8.279a1.709,1.709,0,0,1-1.625-1.181l-2.558-7.874a1.678,1.678,0,0,0-1.625-1.18Z" />
                </g>
              </svg>
            </a>
          </div>
          {/* Second Row: Right Section */}
          {isProjectsNull ? null : (
            <div className="flex flex-wrap space-x-2 items-center">
              <FiltersMenu onApplyFilters={handleApplyFilters} />
              {(loadingUsers || userLoading) && <LoadingProfileSkeleton />}
              {!loadingUsers && projectUsers.length > 0 && (
                <UserAvatars users={projectUsers} />
              )}
              {!loadingUsers && projectUsers.length === 0 && (
                <PlaceholderAvatars />
              )}
              {user?.role === "manager" && (
                <a className="flex justify-end" href="#">
                  <InvitationMenu
                    onUserAdded={handleUserAdded}
                    selectedProjectID={selectedProjectID}
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </nav>
      <div>
        <Outlet />
        {isProjectsNull && (
          <GuestProject
            onCreateProject={() => {
              setIsProjectModalOpen(true);
            }}
          />
        )}
        {!isProjectsNull && selectedProjectID && (
          <Board
            selectedProjectID={selectedProjectID}
            selectedFilters={selectedFilters}
          />
        )}
        {/* Modal Component */}
        <Modal isOpen={isModalOpen} toggleModal={toggleModal} />
        <ProjectCreationModal
          open={isProjectModalOpen}
          onProjectCreated={handleNewProjectCreation}
          onClose={() => {
            setIsProjectModalOpen(false);
          }}
        />
        {/* <drawer /> */}
        <MainDrawer open={openDrawer} onClose={toggleDrawer(false)} />
      </div>
    </div>
  );
};

export default DashboardLayout;
