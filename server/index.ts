import dotenv from "dotenv";
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import init from "./src/socket";

dotenv.config();
const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 4000;

io.on("connection", init);

server.listen(PORT, (): void => {
  console.log(`Server Listen on port : ${PORT}`);
});
