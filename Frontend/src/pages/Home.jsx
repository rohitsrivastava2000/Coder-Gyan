import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authentication, createUser } from '../Features/userDetailSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notify } from '../toastify';

function Home() {
  

  const dispatch = useDispatch();
  const navigate=useNavigate();
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
    <>
    <div>
      <nav className='flex h-12 bg-amber-200 p-2 justify-end pr-10 gap-4' >
        {!isLogin ? <><button className='bg-amber-800 text-center items-center rounded-md pl-2 pr-2' onClick={()=>navigate('/login')} >Login</button>
        <button className='bg-amber-500 text-center items-center rounded-md pl-2 pr-2' onClick={()=>navigate('/signup')} >Signup</button></>
        :
        <><button className='bg-amber-800 text-center items-center rounded-md pl-2 pr-2' onClick={()=>navigate('/profile')} >Profile</button>
        <button className='bg-amber-500 text-center items-center rounded-md pl-2 pr-2' onClick={()=>handleLogout()} >Logout</button></>
        }
      </nav>
    </div>
    <div className='min-h-screen flex justify-center items-center'>
      
      {!isLogin ? "Where Is The Developer?" : `The Developer is here, ${userData?.username}`}
    </div>
    </>
  );
}

export default Home;
