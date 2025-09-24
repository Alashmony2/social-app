import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { error } from "console";
import { NotFoundException } from "../../utils";

class UserService {
  private readonly userRepository = new UserRepository();
  constructor() {}
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.getOne({ _id: req.params.id });
    if(!user) throw new NotFoundException("User not found")
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user:req.user } });
  };
}

export default new UserService();
