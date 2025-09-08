import type { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "./auth.dto";
import { User } from "../../DB/user/user.model";
import { error } from "console";
import { ConflictException } from "../../utils/error";
import { AbstractRepository } from "../../DB/abstract.repository";
import { IUser } from "../../utils/common/interface";
import { UserRepository } from "../../DB/user/user.repository";

class AuthService {
  private userRepository = new UserRepository();
  constructor() {}
  async register(req: Request, res: Response, next: NextFunction) {
    //get data form request
    const registerDto: RegisterDTO = req.body;
    //check user exist
    const userExist = await User.findOne({ email: registerDto.email });
    if (userExist) {
      throw new ConflictException("User already exist");
    }
    //save into DB
    await this.userRepository.getAllUsers()
    const user = new User(registerDto);
    const createdUser = await user.save();
    //send response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      data: createdUser,
    });
  }
}
export default new AuthService();
