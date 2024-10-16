import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Reemplaza con el origen de tu frontend
    methods: ["GET", "POST"], // Métodos permitidos
  },
});

let initialCheckboxesState = Array(100).fill(false);
let clientsQty = 0;

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("initialState", initialCheckboxesState);

  clientsQty++;
  io.emit("updateClients", clientsQty);

  socket.on("toggleCheckbox", (data) => {
    const { index, isChecked } = data;
    initialCheckboxesState[index] = isChecked;
    io.emit("updateCheckbox", { index, isChecked });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clientsQty--;
    io.emit("updateClients", clientsQty);
  });
});

httpServer.listen(3000);
