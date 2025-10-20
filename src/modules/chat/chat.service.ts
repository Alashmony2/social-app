import { Request, Response } from "express";
import { ChatRepository } from "../../DB";

class ChatService {
  private readonly chatRepository = new ChatRepository();
  getChat = async (req: Request, res: Response) => {
    //get data from req
    const { userId } = req.params;
    const userLoggedIn = req.user._id;
    const chat = await this.chatRepository.getOne({
      user: { $all: [userId, userLoggedIn] },
    },{},{populate:[{path:"messages"}]});

    return res.json({
      message: "done",
      success: true,
      data: { chat },
    });
  };
}
export default new ChatService();
