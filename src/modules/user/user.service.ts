import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { success } from "zod";

class UserService {
  private readonly userRepository = new UserRepository();
  constructor() {}
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userRepository.getOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user } });
  };
}

export default new UserService();
