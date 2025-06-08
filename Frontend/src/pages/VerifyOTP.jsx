import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {notify} from '../toastify.js'
import { setOtpSend } from '../Features/userDetailSlice.js';

function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""))
  const inputsRef = useRef([])
const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl=useSelector((state)=>state.app.baseURL);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Move to next input
      if (index < 5) {
        inputsRef.current[index + 1].focus()
      }
    } else if (value === "") {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalOtp = otp.join("")
    console.log("OTP entered:", finalOtp)
    // API call to verify finalOtp
setIsSubmitting(true); // Start loading

    try {
      const response=await axios.post(baseUrl+'/auth/verify-account',{otp:finalOtp},{
        withCredentials:true
      })

      // console.log(response.data);
      if(response.data.success){
        //TODO Add Toast
        dispatch(setOtpSend(false));
        notify(response.data)
        console.log("hi")
        setTimeout(()=>navigate('/login'),1000)
      }
      

    } catch (error) {
      notify(error.response?.data);
      console.log(error);
    }finally {
    setIsSubmitting(false); // Stop loading
  }
  }

  return (
    <div className="min-h-screen flex items-center justify-around bg-white">
      <div>
        <img src="/public/otpsend.png" width={600} alt="" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-[0_0_10px_2px_rgba(128,128,128,0.3)] rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter OTP</h2>

        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(108,99,255)]"
              required
            />
          ))}
        </div>

        <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full cursor-pointer ${
    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[rgb(108,99,255)] hover:bg-[rgb(86,79,204)]"
  } text-white font-semibold py-2 rounded-lg transition duration-300`}
>
  {isSubmitting ? "Verifying..." : "Verify OTP"}
</button>
      </form>
    </div>
  )
}

export default VerifyOTP
