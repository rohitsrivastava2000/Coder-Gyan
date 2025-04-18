import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createServer } from 'node:http';
import { connectToSocket } from "./Controller/socketMangement.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
  res.send("Server is Started");
});

server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
