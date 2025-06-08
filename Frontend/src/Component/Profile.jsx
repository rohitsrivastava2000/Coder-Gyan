import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authentication, createUser } from '../Features/userDetailSlice';

function Profile() {
    const {userData,isLogin,loading,error}=useSelector((state)=>state.app);
    const dispatch=useDispatch();
    useEffect(() => {
        dispatch(authentication());
        dispatch(createUser());
      }, []);


    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  return (
    <div>
      <div className='min-h-screen flex justify-center items-center'>
        {`User Name is :${userData?.username}`}<br/>
        {`Email Id is: ${userData?.email}`}
      </div>
    </div>
  )
}

export default Profile
