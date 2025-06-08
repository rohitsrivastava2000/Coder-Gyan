import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOtpSend } from "../Features/userDetailSlice";
import axios from "axios";
import { notify } from "../toastify.js";

function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userDatail, setUserDatail] = useState({});
  const [isStrong, setIsStrong] = useState(false);

  const navigate = useNavigate();
  const dispatch=useDispatch();
  const baseUrl = useSelector((state) => state.app.baseURL);

  const handleData = {
    userName: username,
    email: email,
    password: password,
  };
  // const handleData=(e)=>{
  //   setUserDatail({...prev,[e.target.name]:[e.target.value]})
  // }

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword); // Set the new value

    if (isValidPassword(newPassword)) {
      setIsStrong(true);
    } else {
      setIsStrong(false);
    }
  };

  const handleSignupForm = async (e) => {
    e.preventDefault();
    console.log(handleData);
    // Add your API call here

    if (!isStrong) {
      notify({
        success: false,
        message: "Make Strong Password",
      });
      return;
    }
    setIsSubmitting(true); // Start loading

    try {
      const response = await axios.post(
        baseUrl + "/auth/register",
        handleData,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.success) {
        dispatch(setOtpSend(true))
        notify(response.data);
        setTimeout(() => navigate("/verify-otp"), 1000);
      }
    } catch (error) {
      console.log(error.data);
      notify(error.response?.data);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-white">
      <div>
        <img src="/public/signup.png" width={700} alt="" />
      </div>
      <form
        onSubmit={handleSignupForm}
        className="bg-white  border border-transparent shadow-[0_0_10px_2px_rgba(128,128,128,0.3)] rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Sign Up
        </h2>

        <div className="mb-10">
          <label
            htmlFor="username"
            className="block text-left text-sm font-medium text-gray-700 mb-3"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(108,99,255)]"
            placeholder="Enter your username"
            required
          />
        </div>

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
            required
          />
        </div>

        <div className="mb-10">
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
            onChange={(e) => handlePassword(e)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(108,99,255)]"
            placeholder="Enter your password"
            required
          />
          {password.length > 0 && !isStrong && (
            <p className="text-[10px] mt-1 text-red-600">
              * Password must be at least 8 characters long and include
              uppercase, lowercase, and a special character.
            </p>
          )}

          {password.length >= 8 && isStrong && (
            <p className="text-[10px] mt-1 text-green-600">✔ Strong password</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full cursor-pointer ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[rgb(108,99,255)] hover:bg-[rgb(86,79,204)]"
          } text-white font-semibold py-2 rounded-lg transition duration-300`}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <p
          className=" mt-3 hover:text-[rgb(86,79,204)] cursor-pointer text-center "
          onClick={() => navigate("/")}
        >
          Go Home
        </p>
      </form>
    </div>
  );
}

export default Signup;
// 22 173 74
