import { Server, Socket } from "socket.io";

export const userStatus = (
  socket: Socket,
  io: Server,
  connectedUsers: Map<string, string>
) => {
  const userId = socket.data.user.id;

  // online
  io.emit("userOnline", { userId });

  //offline
  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
    io.emit("userOffline", { userId });
  });

  // typing
  socket.on("typing", (data: { destId: string; isTyping: boolean }) => {
    const destSocket = connectedUsers.get(data.destId);
    if (destSocket) {
      io.to(destSocket).emit("userTyping", {
        from: userId,
        isTyping: data.isTyping,
      });
    }
  });
};
