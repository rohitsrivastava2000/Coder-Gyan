import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { replace, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  setAllUserProject,
  setCurrentMeetingId,
  setCurrentProjectId,
  setIsJoinProject,
} from "../Features/userDetailSlice";
import { BsPencilSquare } from "react-icons/bs";
import { notify } from "../toastify.js";
import { format } from "date-fns";
import { FiFolder } from "react-icons/fi";
import { Trash2 } from "lucide-react";

function PlayGround() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showJoinProjectModal, setShowJoinProjectModal] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentTitleUpdate, setCurrentTitleUpdate] = useState("");
  const [currentDescriptionUpdate, setCurrentDescriptionUpdate] = useState("");

  const { userData, currentMeetingId } = useSelector(
    (state) => state.app
  );
  const dispatch = useDispatch();
  const baseURL=import.meta.env.VITE_API_URL
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    username: userData.username,
    meetingId: "",
  });
  const [joinData, setJoinData] = useState({
    username: userData.username,
    meetingId: "",
  });

  const createID = (e) => {
    setFormData((prev) => ({ ...prev, meetingId: uuidv4() }));

    toast.success("Created a new room");
  };

  const createRoom = () => {
    setShowNewProjectModal(true);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setShowNewProjectModal(false);
    setShowJoinProjectModal(false);
    setShowUpdateModel(false);
    setFormData({
      title: "",
      description: "",
      username: userData.username,
      meetingId: "",
    });
    setJoinData({
      username: userData.username,
      meetingId: "",
    });
  };

  const handleInputEnterCreate = (e) => {
    // console.log(e.code);
    if (e.code == "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can add logic here to create the project
    if (
      !formData.meetingId ||
      !formData.username ||
      !formData.title ||
      !formData.description
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        baseURL + "/project/new-project",
        {
          title: formData.title,
          description: formData.description,
          username: formData.username,
          meetingId: formData.meetingId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Project Created");
        console.log(response.data.projectId);
        dispatch(setCurrentProjectId(response.data.projectId));
        dispatch(setCurrentMeetingId(formData.meetingId));
        navigator(`/playground/${formData.meetingId}`, {
          state: {
            username: formData.username, // This was also wrongly written
          },
        });
        handleClose();
      }
    } catch (error) {
      console.log(error, "something went wront on handleSubmit");
    }
  };

  //Join Meeting
  const handleInputEnterJoin = (e) => {
    // console.log(e.code);
    if (e.code == "Enter") {
      handleJoinSubmit();
    }
  };
  const joinRoom = () => {
    setShowJoinProjectModal(true);
  };
  const handleChangeForJoin = (e) => {
    setJoinData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", joinData);
    // You can add logic here to create the project
    if (!joinData.meetingId || !joinData.username) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        baseURL + "/project/join-project",
        {
          meetingId: joinData.meetingId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        notify(response.data);
        dispatch(setCurrentProjectId(response.data.projectId));
        dispatch(setCurrentMeetingId(joinData.meetingId));

        console.log(joinData.meetingId);
        console.log(currentMeetingId);
        navigator(`/playground/${joinData.meetingId}`, {
          state: {
            username: joinData.username,
          },
        });
      }
    } catch (error) {
      console.log(error);
      notify(error.response?.data);
    }

    handleClose();
  };

  //API Calling
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const allProject = await axios.get(
          baseURL + "/project/get-all-project",
          {
            withCredentials: true,
          }
        );
        console.log("All project is", allProject);
        dispatch(setAllUserProject(allProject.data.projects));
        setUserProjects(allProject.data.projects);
      } catch (error) {
        console.log("Error on showAllProject: " + error);
      }
    };

    if (activeTab === "projects") {
      fetchProject();
    }
  }, [activeTab]);

  const updateModel = (project) => {
    setCurrentProject(project);
    setCurrentTitleUpdate(project.title);
    setCurrentDescriptionUpdate(project.description);
    setShowUpdateModel(true);
  };

  const handleParticularProject = (project) => {
    setCurrentProject(project);
    console.log(project._id , "yeh hai project id");
    dispatch(setCurrentProjectId(project._id));
    dispatch(setCurrentMeetingId(project.meetingId));
    dispatch(setIsJoinProject(false));

    console.log(project._id);

    navigator(`/playground/${project.meetingId}`, {
      state: {
        username: project.username,
      },
    });
  };

  const handleUpdateModel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL + `/project/update-project/${currentProject._id}`,
        {
          title: currentTitleUpdate,
          description: currentDescriptionUpdate,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.data.success) notify(response.data);

      setShowUpdateModel(false);
    } catch (error) {
      console.log(error);
      console.log("error on handleUpdateModel");
    }
  };

  const handleClear = async (project) => {
    try {
      const response = await axios.post(
        baseURL + `/project/delete-project/${project._id}`, {} ,      
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.data.success) notify(response.data);

     
    } catch (error) {
      console.log(error);
      console.log("error on handleClear");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 tracking-wide cursor-pointer " onClick={()=>navigator('/')} >
            Coder<span className="text-yellow-400">'$</span> Gyan
          </h1>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search Project"
            className="bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
            PV
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-[15%] bg-gray-900 border-r border-gray-700 p-6 space-y-6">
          <div className="space-y-2">
            <button
              onClick={createRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              + New Project
            </button>
            <button
              onClick={joinRoom}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Join Project
            </button>
          </div>

          <div className="space-y-4">
            <button
              className="block w-full text-left hover:text-blue-400 transition"
              onClick={() => setActiveTab("projects")}
            >
              My Projects
            </button>
            <button className="block w-full text-left hover:text-blue-400 transition">
              Settings
            </button>
            <button className="block w-full text-left hover:text-red-400 transition">
              Logout
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="w-[85%] p-10">
          {activeTab === "welcome" && (
            <h1 className="text-3xl font-bold">
              Welcome Back,{" "}
              <span className="text-blue-400">{`${userData.username}`}</span>
            </h1>
          )}

          {activeTab === "projects" && (
            <div className="px-4 py-6 sm:px-6">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
                <p className="mt-1 text-gray-400">Your saved code projects</p>
              </div>

              {/* Projects Grid */}
              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {userProjects.map((project) => (
                    <div
                      key={project._id}
                      className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 transition-all hover:-translate-y-1 hover:border-gray-600 hover:shadow-lg"
                      onClick={() => handleParticularProject(project)}
                    >
                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <h3 className="truncate text-lg font-semibold text-blue-400">
                            {project.title}
                          </h3>
                          <div>
                            <button
                              className="rounded-md p-1 hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateModel(project);
                              }}
                              aria-label="Edit project"
                            >
                              <BsPencilSquare className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClear(project);
                              }}
                              className="p-2 rounded-full  text-red-400 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-gray-300">
                          {project.description || "No description available"}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-3 text-xs">
                          <span className="text-gray-400">
                            {format(new Date(project.createdAt), "dd MMM yyyy")}
                          </span>
                          <span className="text-gray-400">
                            By: {project.username || "Anonymous"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 py-12">
                  <FiFolder className="h-12 w-12 text-gray-500" />
                  <p className="mt-3 text-gray-400">No projects yet</p>
                  <button className="mt-4 text-blue-400 hover:text-blue-300">
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-[90%] max-w-md space-y-4 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold text-blue-400">
              Create New Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={handleInputEnterCreate}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleInputEnterCreate}
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
              ></textarea>
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleInputEnterCreate}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
                readOnly
              />
              <input
                type="text"
                name="meetingId"
                placeholder="Meeting ID"
                value={formData.meetingId}
                onChange={handleChange}
                onKeyDown={handleInputEnterCreate}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <div className="flex justify-end">
                <span
                  onClick={createID}
                  className="inline-block text-sm font-medium text-green-400 bg-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-green-600 hover:text-white transition"
                >
                  + Generate Meeting ID
                </span>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showJoinProjectModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-[90%] max-w-md space-y-4 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold text-blue-400">
              Join Project
            </h2>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                value={joinData.username}
                onChange={handleChangeForJoin}
                onKeyDown={handleInputEnterJoin}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
                readOnly
              />
              <input
                type="text"
                name="meetingId"
                placeholder="Meeting ID"
                value={joinData.meetingId}
                onChange={handleChangeForJoin}
                onKeyDown={handleInputEnterJoin}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUpdateModel && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-[90%] max-w-md space-y-4 border border-gray-700 shadow-xl">
            <form onSubmit={handleUpdateModel} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="enter title"
                value={currentTitleUpdate}
                onChange={(e) => setCurrentTitleUpdate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <textarea
                type="text"
                name="description"
                placeholder="enter description"
                value={currentDescriptionUpdate}
                onChange={(e) => setCurrentDescriptionUpdate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <textarea />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGround;
