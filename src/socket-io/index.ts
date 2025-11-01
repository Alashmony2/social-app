import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";
import { sendMessage } from "./chat";
import { userStatus } from "./status";

const connectedUsers = new Map<string, string>();

export const initSocket = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketAuth);
  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user.id, socket.id);
    socket.on("sendMessage", sendMessage(socket, io,connectedUsers));
    userStatus(socket, io, connectedUsers);
  });
};
