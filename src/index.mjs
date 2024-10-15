import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Reemplaza con el origen de tu frontend
    methods: ["GET", "POST"], // Métodos permitidos
  },
});

let checkboxes = Array(24).fill(false);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("initialState", checkboxes);

  socket.on("toggleCheckbox", (data) => {
    const { index, isChecked } = data;
    checkboxes[index] = isChecked;
    io.emit("updateCheckbox", { index, isChecked });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(3000);
