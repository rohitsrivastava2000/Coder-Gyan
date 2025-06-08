import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {notify} from '../toastify.js'
// import { createUser } from "../Features/userDetailSlice.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const baseUrl=useSelector((state)=>state.app.baseURL);
 // const dispatch = useDispatch();
  const handleLoginForm =async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      console.log("hy")
      const response=await axios.post(baseUrl+'/auth/login',{email,password},{withCredentials:true})
      console.log(response.data);
      if(response.data.success){
       //dispatch(createUser());

        notify(response.data)
        
        setTimeout(()=>navigate('/'),2000);
      }
    } catch (error) {
      notify(error.response?.data);
      console.log(error.response?.data)
    }finally {
    setIsSubmitting(false); // Stop loading
  }

  };
  return (
    <div className="min-h-screen flex items-center justify-around bg-white">
      <form
        onSubmit={handleLoginForm}
        className="bg-white  border border-transparent shadow-[0_0_10px_2px_rgba(128,128,128,0.3)] rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login Up
        </h2>

        <div className="mb-10">
          <label
            htmlFor="email"
            className="block text-left text-sm font-medium text-gray-700 mb-3"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(108,99,255)]"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-1">
          <label
            htmlFor="password"
            className="block text-left text-sm font-medium text-gray-700 mb-3"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(108,99,255)]"
            placeholder="Enter your password"
          />
        </div>
        <p
          className=" mb-10 hover:text-red-600 cursor-pointer text-end "
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </p>
       <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full cursor-pointer ${
    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[rgb(108,99,255)] hover:bg-[rgb(86,79,204)]"
  } text-white font-semibold py-2 rounded-lg transition duration-300`}
>
  {isSubmitting ? "Verifying..." : "Login"}
</button>
        <p
          className=" mt-3 hover:text-[rgb(86,79,204)] cursor-pointer text-center "
          onClick={() => navigate("/")}
        >
          Go Home
        </p>
      </form>
      <div>
        <img src="/public/login.png" width={700} alt="" />
      </div>
    </div>
  );
}

export default Login;
