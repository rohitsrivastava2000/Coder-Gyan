import express from 'express'
import { getInfo } from '../Controller/userDetail.js';
import userAuth from '../Middleware/userAuth.js';

const userRoute=express.Router();

userRoute.get('/get-userDetail',userAuth,getInfo);


export default userRoute;