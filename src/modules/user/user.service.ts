import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { error } from "console";
import { NotFoundException } from "../../utils";

class UserService {
  private readonly userRepository = new UserRepository();
  constructor() {}
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user:req.user } });
  };
}

export default new UserService();
