import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp,  verifyEmail } from '../Controller/authController.js';
import userAuth from '../Middleware/userAuth.js';

const authRoute=express.Router();


authRoute.post('/register',register);
authRoute.post('/login',login);
authRoute.get('/logout',logout);

// authRoute.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRoute.post('/verify-account',userAuth,verifyEmail);
authRoute.get('/is-auth',userAuth,isAuthenticated);

authRoute.post('/send-reset-otp',sendResetOtp);
authRoute.post('/reset-password',resetPassword);

export default authRoute