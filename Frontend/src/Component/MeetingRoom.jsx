import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Clients from "./Clients";
import EditorPage from "./EditorPage";
import { SocketContext } from "../Context/myContext";
import toast from "react-hot-toast";
import axios from 'axios';
import WhiteBoard from "./WhitBoard";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMeetingId } from "../Features/userDetailSlice";

function MeetingRoom() {
  const {currentProjectId,baseURL,userData,currentMeetingId}=useSelector((state)=>state.app);
  const  meetingID  = currentMeetingId;
  const [clients, setClients] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const [syncCode, setSyncCode] = useState(false);
  const [inputField,setInputField]=useState("");
  const [outputField,setOutputField]=useState("");
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  
  useEffect(() => {
    // Check if already reloaded once in this session
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("hasReloaded");
      
    }
  }, []);
 
const gettingProjectDetail=async()=>{
      try {
         const response=await axios.get(baseURL+`/project/getting-project-detail/${currentProjectId}`,{withCredentials:true})

      if(response.data.success){
        codeRef.current=response.data.project.code;
        console.log(response.data.project.language,"yeh language aaraha hai");
        setLanguage(response.data.project.language);
      }
      } catch (error) {
        console.log(error,'somthing went wrong on gettingProjectDetail')
      }
    }



  useEffect(() => {
    if (!userData?.username) return;

    

    gettingProjectDetail();
    
    const init = () => {
      socketRef.current = socket;

      // console.log("object")

      const handleError = (err) => {
        console.log("socket Error", err);
        toast.error("Socket connection failed, try again later");
        navigate("/");
      };

      socketRef.current.emit("join", {
        meetingID,
        username: userData.username,
      });

      const handleJoin = ({ clients, username, socketID }) => {
        if (username !== userData.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        console.log(codeRef.current + "meeting room ");

        setTimeout(() => {
          if (codeRef.current) {
            socketRef.current.emit("sync-code", {
              code: codeRef.current,
              socketID,
            });
          }
        }, 300);
      };

      const handleDisconnect = ({ socketID, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketID !== socketID)
        );
      };

      socketRef.current.on("connect_error", handleError);
      socketRef.current.on("connect_failed", handleError);
      socketRef.current.on("joined", handleJoin);
      socketRef.current.on("disconnected", handleDisconnect);

      // Cleanup function
      return () => {
        socketRef.current.off("connect_error", handleError);
        socketRef.current.off("connect_failed", handleError);
        socketRef.current.off("joined", handleJoin);
        socketRef.current.off("disconnected", handleDisconnect);
        socketRef.current.disconnect();
      };
    };

    const cleanup = init();
    return cleanup;
  }, []);

 useEffect(() => {
  let isRemote = false;

  const handleLanguageChange = ({ language: newLang }) => {
    if (newLang !== language) {
      isRemote = true;
      setLanguage(newLang);
    }
  };

  socketRef.current.on("language-change", handleLanguageChange);

  if (!isRemote) {
    socketRef.current.emit("language-change", { language, meetingID });
  }

  return () => {
    socketRef.current.off("language-change", handleLanguageChange);
  };
}, [language]);


   useEffect(() => {
    socketRef.current.emit("enable-whiteboard", { showWhiteBoard, meetingID });
    const enableWhiteBoard = ({ showWhiteBoard }) => {
      setShowWhiteBoard(showWhiteBoard);
    };

    socketRef.current.on("enable-whiteboard", enableWhiteBoard);

    return () => {
      socketRef.current.off("enable-whiteboard", enableWhiteBoard);
    };
  }, [showWhiteBoard]);

  useEffect(()=>{
    socketRef.current.emit('input-field-change',{inputField,meetingID});
    const handleInputFieldChange=({inputField})=>{
        setInputField(inputField);
    }
    socketRef.current.on('input-field-change',handleInputFieldChange);

    return ()=>{
      socketRef.current.off('input-field-change',handleInputFieldChange);
    }
  },[inputField])

  useEffect(()=>{
    socketRef.current.emit('output-field-change',{outputField,meetingID});
    const handleOutputFieldChange=({outputField})=>{
        setOutputField(outputField);
    }
    socketRef.current.on('output-field-change',handleOutputFieldChange);

    return ()=>{
      socketRef.current.off('output-field-change',handleOutputFieldChange);
    }
  },[outputField])



   if (!userData?.username) {
    return <Navigate to="/" />;
  }


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingID);
      toast.success("Meeting ID Copied!");
    } catch (error) {
      toast.error("ID Not Copied");
      console.log(error);
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  const handleRunCode=async ()=>{
    try {
      const response=await axios.post('http://localhost:8000/api/v1/runcode',{
        language:language,
        code:codeRef.current,
        input:inputField,
      })

      console.log(response.data);
      if(response){
        setOutputField(response.data.message);
      }


    } catch (error) {
      toast.error("Something went wrong, Try another language");
      console.log(error);
    }
    
  }

  const handleWhiteBoard=()=>{
   setShowWhiteBoard((pre)=>!pre)
  }
  
  const handleSaveCode=async()=>{
      try {
        console.log(currentProjectId)
        const response=await axios.post(baseURL+'/project/save-project',{
        projectId:currentProjectId,
        code:codeRef.current,
        language:language,
      },{
        withCredentials:true
      })

      console.log(response);
      if(response.data.success){
        toast.success("Project Saved!");
      }
      } catch (error) {
        console.log(error,"something went wron on handleSaveCode");
      }
  }
  

  return (
    <div className="w-full h-screen flex bg-[rgb(28,26,38)] text-white">
      {/* Left Sidebar */}
      <div className="w-[16%] h-full bg-[rgb(35,37,50)] flex flex-col p-4 text-white">
        {/* Logo + Tagline */}
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 tracking-wide" onClick={()=>navigate('/playground')}>
            Coder<span className="text-yellow-400">'$</span> Gyan
          </h1>
          <p className="text-sm text-gray-400 mt-1">Where Code Meets Wisdom</p>
          <hr className="border-t border-white/20 mt-4" />
        </div>

        {/* Connected Users */}
        <div className="mt-4 flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold text-center mb-2">
            Connected Users
          </h2>
          <div className="flex flex-wrap justify-evenly gap-4">
            {clients.map((client, index) => (
              <Clients key={index} username={client.username} />
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <div className="mb-2">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-center text-white mb-1"
            >
              Select Language
            </label>
            <select
              id="language"
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
              className="w-full font-bold p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition  text-center"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-600 font-bold hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition"
          >
            Copy Meeting ID
          </button>
          <button
            onClick={leaveRoom}
            className="bg-red-600 font-bold hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm transition"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Right Side Editor */}
      <div className="w-[84%] flex h-full">
        {showWhiteBoard ? <WhiteBoard socketRef={socketRef} meetingID={meetingID}/> : <div className="h-full w-[65vw]">
          <EditorPage
            socketRef={socketRef}
            meetingID={meetingID}
            language={language}
            onCodeChange={(code) => {
              codeRef.current = code;
              setSyncCode(true);
            }}
          />
        </div>
        }
        {/* Right to Right side   */}
        <div className="h-full w-[35vw] bg-[#1E1C2C] border-l border-gray-700 p-4 flex flex-col">
          {/* Top Buttons */}
          <div className="flex gap-4 mb-4">
            <button className="flex-1 text-sm font-semibold py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition" onClick={()=>handleSaveCode()} >
              Save
            </button>
            <button onClick={handleWhiteBoard} className="flex-1 text-sm font-semibold py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition">
              WhiteBoard
            </button>
          </div>

          {/* Input Field */}
          <div className="flex flex-col mb-4 flex-1">
            <label htmlFor="input" className="text-sm text-gray-300 mb-1">
              Input
            </label>
            <textarea
              id="input"
              value={inputField}
              onChange={(e)=>setInputField(e.target.value)}
              placeholder="Enter input here..."
              className="bg-[#2A273F] text-sm p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-full"
            />
          </div>

          {/* Output Field */}
          <div className="flex flex-col mb-4">
            <label htmlFor="output" className="text-sm text-gray-300 mb-1">
              Output
            </label>
            <textarea
              id="output"
              placeholder="Output will appear here..."
              value={outputField}
              readOnly
              className="bg-[#2A273F] text-sm p-3 rounded-md text-white border border-gray-600 focus:outline-none resize-none h-60"
            />
          </div>

          {/* Run Code Button */}
          <div>
            <button
              onClick={handleRunCode}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-bold transition"
            >
              ▶ Run Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
