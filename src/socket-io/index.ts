import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";

const connectedUsers = new Map<string, string>();

export const initSocket = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketAuth);
  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user.id, socket.id);
    socket.on("sendMessage", (data: { message: string; destId: string }) => {
      const destSocket = connectedUsers.get(data.destId);
      socket.emit("successMessage", data);
      io.to(destSocket).emit("receiveMessage",data)
    });
  });
};
