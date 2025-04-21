import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';



function RoomPage() {
    //const socket=useContext(SocketContext);

    const [roomID,setRoomID]=useState('');
    const [username,setUsername]=useState('');

    
    const navigator=useNavigate();

    const handleRoom=()=>{
       if(!roomID || !username){
        toast.error('All field are required')
        return;
       }
       navigator(`/room-page/${roomID}`,{
        state:{
          username,
        }
       });

    }
    const createID=(e)=>{
      e.preventDefault();
      setRoomID(uuidv4());
      toast.success("Created a new room");
    }

    const handleInpurEnter=(e)=>{
      // console.log(e.code);
      if(e.code=='Enter'){
        handleRoom();
      }
    }

    return (
    <div className="bg-[rgb(28,26,38)] w-full h-screen flex justify-center items-center px-4">
      <div className="bg-[rgb(35,37,50)] p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 tracking-wide">
            Coder<span className="text-yellow-400">'$</span> Gyan
          </h1>
          <p className="text-gray-400 text-sm">Join a room and start collaborating</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <label className="text-white text-sm">Paste Invitation Room ID</label>
          <input
            type="text"
            placeholder="ROOM ID"
            value={roomID}
            onChange={(e)=>setRoomID(e.target.value)}
            onKeyDown={handleInpurEnter}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-50 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="USERNAME"
            onChange={(e)=>setUsername(e.target.value)}
            onKeyDown={handleInpurEnter}
            className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleRoom} className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-md">
            Join
          </button>
        </div>

        <h3 className="text-sm text-gray-400 text-center">
          Don’t have an invite?{' '}
          <span onClick={createID} className="text-blue-500 hover:underline cursor-pointer">
            Create new room
          </span>
        </h3>
      </div>
    </div>
  );
}

export default RoomPage;
