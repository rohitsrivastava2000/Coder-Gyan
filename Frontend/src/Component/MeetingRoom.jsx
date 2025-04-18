import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Clients from "./Clients";
import EditorPage from "./EditorPage";
import { SocketContext } from "../Context/myContext";
import toast from 'react-hot-toast';

function MeetingRoom() {
  
  const { meetingID } = useParams();
  const [clients, setClients] = useState([]);

  const navigate=useNavigate();
  const socketRef=useRef(null);
  const codeRef=useRef(null);
  const location=useLocation();
  const {socket}=useContext(SocketContext);
  const [syncCode,setSyncCode]=useState(false);

  useEffect(() => {
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
        username: location.state?.username,
      });
      
      const handleJoin = ({ clients, username, socketID }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        console.log(codeRef.current +"meeting room ")

        setTimeout(() => {
          if (codeRef.current) {
            socketRef.current.emit('sync-code', {
              code: codeRef.current,
              socketID,
            });
          } 
        }, 300);
      };
      
      const handleDisconnect = ({ socketID, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketID !== socketID));
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
  

  if(!location.state){
    return <Navigate to='/' />
  }

  const handleCopy=async()=>{
    try {
      await navigator.clipboard.writeText(meetingID);
      toast.success("Meeting ID Copied!")
    } catch (error) {
      toast.error("ID Not Copied")
      console.log(error);
    }
  }

  const leaveRoom=()=>{
    navigate('/');
  }
  

  return (
    <div className="w-full h-screen flex bg-[rgb(28,26,38)] text-white">
      {/* Left Sidebar */}
      <div className="w-[16%] h-full bg-[rgb(35,37,50)] flex flex-col p-4 text-white">
        {/* Logo + Tagline */}
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 tracking-wide">
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
          <button onClick={handleCopy}
           
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition"
          >
            Copy Room ID
          </button>
          <button onClick={leaveRoom}
            
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm transition"
          >
            Leave Room
          </button>
        </div>
      </div>
      {/* Right Side Editor */}
      <div className="w-[84%] h-full" >
        <EditorPage socketRef={socketRef} meetingID={meetingID} onCodeChange={(code)=>{codeRef.current=code ;setSyncCode(true)}}  />
      </div>
    </div>
  );
}

export default MeetingRoom;
