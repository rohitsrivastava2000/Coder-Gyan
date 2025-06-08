import React, { useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { authentication, createUser } from '../Features/userDetailSlice';
import axios from 'axios';
import { notify } from '../toastify';

function LandingPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  const { userData, loading,isLogin ,error } = useSelector((state) => state.app);
  const baseUrl=useSelector((state)=>state.app.baseURL);

  useEffect(() => {
    dispatch(authentication());
    dispatch(createUser());
  }, []);

  const handleLogout=async ()=>{
    console.log("aaya to hu")
    try {
      const response=await axios.get(baseUrl+'/auth/logout',{
        withCredentials:true
      })
      if(response.data.success){
        dispatch(authentication());

        notify(response.data)
        navigate('/')
        
      }

    } catch (error) {
      notify(error.response?.data);
      console.log(error);
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  // if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;


  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-100 to-indigo-200 flex flex-col">
      {/* Navbar */}
      <nav className="w-full  sticky top-0 z-50 bg-white/30 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo & Brand */}

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10 rounded-full shadow-md"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              Coder<span className="text-yellow-500">'$</span> Gyan
            </h1>
          </div>
         
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <p className="hover:text-indigo-600 transition duration-300 cursor-pointer">
              About
            </p>
            {!isLogin ? <><p className="hover:text-indigo-600 transition duration-300 cursor-pointer" onClick={()=>navigate('/login')} >
              Login
            </p>
            <p className="hover:text-indigo-600 transition duration-300 cursor-pointer" onClick={()=>navigate('/signup')} >
              Signup
            </p></>
            :
            <><p className="hover:text-indigo-600 transition duration-300 cursor-pointer" onClick={()=>navigate('/playground')} >
              Dashboard
            </p>
            <p className="hover:text-red-600 transition duration-300 cursor-pointer" onClick={()=>handleLogout()}>
              Logout
            </p></>
            }
            
          </div>
        </div>
      </nav>

      {/* Hero Section - Fully Centered */}
      <div className="flex-grow h-[600px] flex flex-col items-center justify-center text-center px-4">
        {/* Typing Animated Text */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight max-w-4xl min-h-[120px]"
        >
          <Typewriter
            words={[
              "Real-Time Code Collaboration",
              "Shared Whiteboard for Diagrams",
              "Run Code Instantly in Any Language",
              "Track and Save Code History",
              "One Place to Build and Collaborate",
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 text-lg text-gray-600 max-w-xl"
        >
          A unified platform for coding, sharing, and collaborating live — with
          zero friction and maximum productivity.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg backdrop-blur-md hover:from-blue-700 hover:to-purple-700 transition"
        >
          <p onClick={()=>navigate('/playground')} >Get Started</p>
        </motion.button>
      </div>

      <div className="flex flex-col  md:flex-row items-center justify-between px-10 py-16 gap-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/3   p-6   text-center">
          <h1 className="text-4xl font-bold mb-4">Advance Auth System</h1>
          <p className="text-gray-800 text-xl">
            Coder's Gyan provides an advanced authentication system with email
            verification via OTP. It ensures your data is fully secure by using
            strong password encryption and verification mechanisms. This system
            is built to follow industry security standards to protect user
            information.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-2/3 flex justify-center">
          <img
            src="/dashboard.png"
            alt="dashboard preview"
            className="w-[800px] rounded-lg   "
          />
        </div>
        
      </div>

      <div className="flex flex-col  md:flex-row items-center justify-between px-10 py-16 gap-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-2/3 flex justify-center">
          <img
            src="/dashboard.png"
            alt="dashboard preview"
            className="w-[800px] rounded-lg  "
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/3   p-6   text-center">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
          <p className="text-gray-800 text-xl">
            One member creates a project, and others can join using the shared
            project code provided by the creator. The dashboard allows seamless
            collaboration and real-time updates between team members. It also
            keeps track of user activity, project stats, and notifications.
          </p>
        </div>
      </div>

      <div className="flex flex-col  md:flex-row items-center justify-between px-10 py-16 gap-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/3   p-6   text-center">
          <h1 className="text-4xl font-bold mb-4">My Project</h1>
          <p className="text-gray-800 text-xl">
            This section contains a history of your projects — whether you
            created them or joined as a collaborator. It offers a clean and
            structured view for managing, reopening, or continuing your work.
            You can easily filter, search, and access past projects anytime.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-2/3 flex justify-center">
          <img
            src="/dashboard.png"
            alt="dashboard preview"
            className="w-[800px] rounded-lg  "
          />
        </div>
      </div>

      <div className="flex flex-col  md:flex-row items-center justify-between px-10 py-16 gap-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-2/3 flex justify-center">
          <img
            src="/dashboard.png"
            alt="dashboard preview"
            className="w-[800px] rounded-lg  "
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/3   p-6   text-center">
          <h1 className="text-4xl font-bold mb-4">Playground Platform</h1>
          <p className="text-gray-800 text-xl">
            This is a real-time collaborative playground platform where all
            users can connect and start writing code together. One member
            creates a project, and the rest join using a shared project code.
            Collaborate in real time with instant updates to code, real-time
            output display, and visibility of connected users.
            <br />
            <br />
            The platform supports multiple languages such as JavaScript, Java,
            Python, and C++. It also shows how many people are currently
            connected to the project, enabling team collaboration. It’s designed
            for live learning, debugging together, and even conducting live
            coding interviews or mock tests in a synchronized environment.
          </p>
        </div>
      </div>

      <div className="flex flex-col  md:flex-row items-center justify-between px-10 py-16 gap-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/3   p-6   text-center">
          <h1 className="text-4xl font-bold mb-4">Real Time White Board</h1>
          <p className="text-gray-800 text-xl">
            Another key feature is the real-time whiteboard, which allows users
            to discuss code visually using drawing tools. You can draw diagrams,
            structure your code visually, or brainstorm ideas live. It includes
            real-time drawing, erasing, undo/redo, and color-changing
            capabilities.
            <br />
            <br />
            This whiteboard works just like a physical one but in a
            collaborative digital format. Whether you're explaining a flowchart,
            sketching out a database schema, or writing out an algorithm
            step-by-step, it's all updated live for everyone in the session.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-2/3 flex justify-center">
          <img
            src="/dashboard.png"
            alt="dashboard preview"
            className="w-[800px] rounded-lg  "
          />
        </div>
      </div>
      <footer className="bg-black w-full  py-4">
        <div className="container mx-auto px-4 flex  justify-center items-center text-white text-sm">
          <p className="mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} All Rights Reserved by{" "}
            <span className="font-semibold text-cyan-400">Coder's Gyan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
