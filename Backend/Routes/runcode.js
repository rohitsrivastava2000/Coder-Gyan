import express from 'express'
import RunCode from '../Controller/runCode.js';

const route=express.Router();


console.log("i am on routes")
route.post('/runcode',RunCode);

export default route;
