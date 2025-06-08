import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import LandingPage from './Component/Landing'
// import RoomPage from './Component/RoomPage'
import { Toaster } from 'react-hot-toast'
import MeetingRoom from './Component/MeetingRoom'
import PlayGround from './Component/PlayGround'
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/verifyOTP";
import Login from "./pages/Login";
import ResetEmail from "./pages/ResetEmail";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Profile from "./Component/Profile";
import PrivateRoute from "./PrivateRoute";
import ProtectedOtpRoute from "./ProtectedOtpRoute";


function App() {


  return (
    <>
      <div>
        <Toaster

              position='top-right'
              toastOptions={{
                success:{
                  theme:{
                    primary:'#4aed88'
                  }
                }
              }}
        ></Toaster>
      </div>
      <BrowserRouter>
       <Routes>
       <Route path='/' element={<LandingPage/>} />
       <Route path='/playground' element={<PlayGround/>} />
       {/* <Route path='/room-page' element={<RoomPage/>} /> */}
       <Route path='/playground/:meetingID' element={<MeetingRoom/>} />

       <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
         <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedOtpRoute />}>
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetEmail />} />
      
       </Routes>
       <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
