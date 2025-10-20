import { Server, Socket } from "socket.io";

interface ISendMessage {
  message: string;
  destId: string;
}
export const sendMessage = (
  socket: Socket,
  io: Server,
  connectedUsers: Map<string, string>
) => {
  return (data: ISendMessage) => {
    const destSocket = connectedUsers.get(data.destId);
    socket.emit("successMessage", data);
    io.to(destSocket).emit("receiveMessage", data);
  };
};
