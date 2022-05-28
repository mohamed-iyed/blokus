const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const init = require("./socket");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});
const PORT = 4000;

io.on("connection", init);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
