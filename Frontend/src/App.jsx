import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import LandingPage from './Component/Landing'
import RoomPage from './Component/RoomPage'
import { Toaster } from 'react-hot-toast'
import MeetingRoom from './Component/MeetingRoom'
import PlayGround from './Component/PlayGround'

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
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
