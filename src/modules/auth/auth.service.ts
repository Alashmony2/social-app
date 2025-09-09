import type { NextFunction, Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import { User } from "../../DB/user/user.model";
import { ConflictException, NotAuthorizedException, NotFoundException } from "../../utils/error";
import { AbstractRepository } from "../../DB/abstract.repository";
import { IUser } from "../../utils/common/interface";
import { UserRepository } from "../../DB/user/user.repository";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils/hash";
import { sendEmail } from "../../utils/email";

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
    const createdUser = await this.userRepository.create(user) ;
    //send email
    await sendEmail({
      to: createdUser.email,
      subject: "verify your email",
      html: `<p>Your otp to verify your account is ${createdUser.otp}</p>`,
    })
    //send response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      data: createdUser,
    });
  };


  login = async (req: Request, res: Response, next: NextFunction) => {
    //get data form request
    const loginDto: LoginDTO = req.body;
    //check user exist
    const userExist = await this.userRepository.exist({
      email: loginDto.email,
    });
    if (!userExist) {
      throw new NotFoundException("User not Found");
    }
    //check is password valid
    const isPasswordValid = compareHash(loginDto.password,userExist.password)
    if(!isPasswordValid){
        throw new NotAuthorizedException("Invalid Credentials")
    }
    return res.status(200).json({
      message: "User Login Successfully",
      success: true,
      data: userExist,
    })
  }
}
export default new AuthService();
