import type { NextFunction, Request, Response } from "express";
import { ConfirmEmailDTO, LoginDTO, RegisterDTO } from "./auth.dto";
import {
  BadRequestException,
  ConflictException,
  NotAuthorizedException,
  NotFoundException,
  sendMail,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils";
import { authProvider } from "./provider/auth.provider";

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
    const user = await this.authFactoryService.register(registerDto);
    //save into DB
    const createdUser = await this.userRepository.create(user);
    //send response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      data: { id: createdUser.id },
    });
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    //get data from req
    const confirmEmailDto: ConfirmEmailDTO = req.body;
    await authProvider.checkOTP(confirmEmailDto);
    this.userRepository.update(
      { email: confirmEmailDto.email },
      { isVerified: true, $unset:{otp:"",otpExpiryAt:""} }
    );
    //send response
    return res.sendStatus(204)
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
    const isPasswordValid = compareHash(loginDto.password, userExist.password);
    if (!isPasswordValid) {
      throw new NotAuthorizedException("Invalid Credentials");
    }
    if (!userExist.isVerified) {
      throw new NotAuthorizedException("Verify your account first");
    }
    return res.status(200).json({
      message: "User Login Successfully",
      success: true,
      data: userExist,
    });
  };
}
export default new AuthService();
