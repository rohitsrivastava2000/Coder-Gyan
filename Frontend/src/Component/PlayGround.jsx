import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function PlayGround() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showJoinProjectModal, setShowJoinProjectModal] = useState(false);
  const navigator=useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    username: "",
    meetingId: "",
  });
  const [joinData, setJoinData] = useState({
    username: "",
    meetingId: "",
  });

  const userProjects = [
    "React Portfolio",
    "Chat App",
    "Blog Website",
    "Task Manager",
  ];

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
      setFormData({
          title: "",
          description: "",
          username: "",
          meetingId: "",
        });
        setJoinData({
            username: "",
            meetingId: "",
        });
    };
    

    const handleInputEnterCreate=(e)=>{
        // console.log(e.code);
        if(e.code=='Enter'){
            handleSubmit();
        }
      }

      const handleSubmit = (e) => {
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
          
          navigator(`/playground/${formData.meetingId}`, {
            state: {
              username: formData.username, // This was also wrongly written
            },
          });
          handleClose();
          
      };  
    
    
    //Join Meeting 
    const handleInputEnterJoin=(e)=>{
        // console.log(e.code);
        if(e.code=='Enter'){
            handleJoinSubmit();
        }
      }
    const joinRoom = () => {
      setShowJoinProjectModal(true);
    };
  const handleChangeForJoin = (e) => {
    setJoinData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", joinData);
    // You can add logic here to create the project
    if (!joinData.meetingId || !joinData.username) {
        toast.error("All fields are required");
        return;
      }
      
      navigator(`/playground/${joinData.meetingId}`, {
        state: {
          username: joinData.username,
        },
      });
      
    handleClose();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 tracking-wide">
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
              <span className="text-blue-400">Rohit Kumar Srivastava</span>
            </h1>
          )}

          {activeTab === "projects" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
              <div className="flex flex-wrap gap-6">
                {userProjects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 w-[30%] min-w-[200px] p-4 rounded-xl hover:bg-gray-700 transition"
                  >
                    <h3 className="text-lg font-bold text-blue-400">
                      {project}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      Project description goes here.
                    </p>
                  </div>
                ))}
              </div>
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
                onKeyDown={handleInpurEnter}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                onKeyDown={handleInpurEnter}
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
              ></textarea>
              <input
                type="text"
                name="username"
                placeholder="Your Username"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleInpurEnter}
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:outline-none"
                required
              />
              <input
                type="text"
                name="meetingId"
                placeholder="Meeting ID"
                value={formData.meetingId}
                onChange={handleChange}
                onKeyDown={handleInpurEnter}
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
    </div>
  );
}

export default PlayGround;
