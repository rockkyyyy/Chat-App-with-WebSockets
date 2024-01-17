const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Object to store user colors
const userColors = {};

// Function to generate a random color
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Socket.io
io.on("connection", (socket) => {
  // Assign a random color to each user
  userColors[socket.id] = generateRandomColor();
  
  socket.on("user-message", (message) => {
    io.emit("message", { ...message, color: userColors[socket.id] });
  });

  // Remove user's color when disconnected
  socket.on("disconnect", () => {
    delete userColors[socket.id];
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(9000, () => console.log(`Server Started at PORT:9000`));
