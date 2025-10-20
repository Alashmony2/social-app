import { Server, Socket } from "socket.io";
import { ChatRepository, MessageRepository } from "../../DB";
import { ObjectId } from "mongoose";

interface ISendMessage {
  message: string;
  destId: string;
}
export const sendMessage = (
  socket: Socket,
  io: Server,
  connectedUsers: Map<string, string>
) => {
  return async (data: ISendMessage) => {
    const destSocket = connectedUsers.get(data.destId);
    socket.emit("successMessage", data);
    io.to(destSocket).emit("receiveMessage", data);
    //create message id
    const messageRepo = new MessageRepository();
    const sender = socket.data.user.id;
    const createdMessage = await messageRepo.create({
      content: data.message,
      sender,
    });
    const chatRepo = new ChatRepository();
    const chat = await chatRepo.getOne({
      users: { $all: [sender, data.destId] },
    });
    //create new chat if not exist
    if (!chat) {
      chatRepo.create({
        users: [sender, data.destId],
        messages: [createdMessage._id as unknown as ObjectId],
      });
    } else {
      await chatRepo.update(
        { id: chat._id },
        { $push: { messages: createdMessage._id } }
      );
    }
  };
};
