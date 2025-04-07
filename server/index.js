const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can limit it to your frontend domain in prod
    methods: ["GET", "POST"],
  },
});

let currentText = "";

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current text to new user
  socket.emit("init", currentText);

  socket.on("text-change", (newText) => {
    currentText = newText;
    socket.broadcast.emit("text-change", newText); // send to others
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
