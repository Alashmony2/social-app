import type { NextFunction, Request, Response } from "express";
import { ConfirmEmailDTO, LoginDTO, RegisterDTO } from "./auth.dto";
import {
  ConflictException,
  NotAuthorizedException,
  NotFoundException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils";
import { sendEmail } from "../../utils";

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
    //send email
    await sendEmail({
      to: createdUser.email,
      subject: "verify your email",
      html: `<p>Your otp to verify your account is ${createdUser.otp}</p>`,
    });
    //send response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      data: createdUser,
    });
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const confirmEmailDto: ConfirmEmailDTO = req.body;
    const userExist = await this.userRepository.exist({
      email: confirmEmailDto.email,
    });
    if (!userExist) {
      throw new NotFoundException("User not Found");
    }
    //check otp
    if (userExist.otp !== confirmEmailDto.otp) {
      throw new NotAuthorizedException("Invalid OTP");
    }
    //update user
    userExist.otp = undefined as unknown as string;
    userExist.otpExpiryAt = undefined as unknown as Date;
    userExist.isVerified = true;
    //save into DB
    await this.userRepository.update(
      { email: confirmEmailDto.email },
      userExist,
      { new: true } as any
    );
    //send response
    return res.status(200).json({
      message: "User Email Confirmed Successfully",
      success: true,
      data: userExist,
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
