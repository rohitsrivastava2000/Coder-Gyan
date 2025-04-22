import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createServer } from 'node:http';
import { connectToSocket } from "./Controller/socketMangement.js";
// import runCode from "./Controller/runCode.js";
import codeRunRouter from './Routes/runcode.js'

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/api/v1',codeRunRouter);


app.get('/', (req, res) => {
  res.send("Server is Started");
});

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
