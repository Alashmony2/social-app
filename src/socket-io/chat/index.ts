import { Server, Socket } from "socket.io";
import { ChatRepository, MessageRepository } from "../../DB";
import { ObjectId } from "mongoose";
import { messageSchema } from "./chat.validation";

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
    //validate message
    const validation = messageSchema.safeParse(data);
    if (!validation.success) {
      socket.emit("validationError", validation.error.issues);
      return;
    }
    const { message, destId } = validation.data;
    const destSocket = connectedUsers.get(destId);
    socket.emit("successMessage", { message, destId });
    io.to(destSocket).emit("receiveMessage", { message, destId });
    //create message id
    const messageRepo = new MessageRepository();
    const sender = socket.data.user.id;
    const createdMessage = await messageRepo.create({
      content: message,
      sender,
    });
    const chatRepo = new ChatRepository();
    const chat = await chatRepo.getOne({
      users: { $all: [sender, destId] },
    });
    //create new chat if not exist
    if (!chat) {
      chatRepo.create({
        users: [sender, destId],
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
