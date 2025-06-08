import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import db from './Configs/dbConnection.js'
import { createServer } from 'node:http';
import { connectToSocket } from "./Controller/socketMangement.js";
// import runCode from "./Controller/runCode.js";
import codeRunRouter from './Routes/runcode.js'
import authRoute from './Routes/authRoute.js';
import userRoute from './Routes/userRoute.js';

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5174', // your frontend domain
  credentials: true                //  Allow cookies to be sent
}));

app.use('/api/v1',codeRunRouter);
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);


app.get('/', (req, res) => {
  res.send("Server is Started");
});

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
