import type { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "./auth.dto";
import { User } from "../../DB/user/user.model";
import { error } from "console";
import { ConflictException } from "../../utils/error";

class AuthService {
  constructor() {}
  async register(req: Request, res: Response, next: NextFunction) {
    //get data form request
    const registerDto:RegisterDTO = req.body;
    //check user exist 
    const userExist = await User.findOne({email:registerDto.email});
    if(userExist){
      throw new ConflictException("User already exist")
    }
  }
}
export default new AuthService();