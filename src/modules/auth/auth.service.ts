import type { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "./auth.dto";
import { User } from "../../DB/user/user.model";
import { ConflictException } from "../../utils/error";
import { AbstractRepository } from "../../DB/abstract.repository";
import { IUser } from "../../utils/common/interface";
import { UserRepository } from "../../DB/user/user.repository";
import { AuthFactoryService } from "./factory";

class AuthService {
  private userRepository = new UserRepository();
  private authFactoryService = new AuthFactoryService();
  constructor() {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    //get data form request
    const registerDto: RegisterDTO = req.body;
    //check user exist
    const userExist = await this.userRepository.exist({
      email: registerDto.email,
    });
    if (userExist) {
      throw new ConflictException("User already exist");
    }
    //prepare data
    const user = this.authFactoryService.register(registerDto);
    //save into DB
    const createdUser = await this.userRepository.create(user);
    //send response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      data: createdUser,
    });
  };
}
export default new AuthService();
