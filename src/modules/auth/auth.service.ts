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
    //send email
    await sendMail({
      to: registerDto.email,
      subject: "Confirm your email",
      html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px;">
    <h2 style="color: #333; margin-bottom: 10px;">Confirm Your Email</h2>
    <p style="font-size: 14px; color: #555; margin: 0 0 15px;">
      Use the following OTP to confirm your account:
    </p>
    <div style="display: inline-block; padding: 12px 20px; font-size: 20px; font-weight: bold; color: #fff; background: #06b6d4; border-radius: 6px; letter-spacing: 3px;">
      ${user.otp}
    </div>
    
  </div>
`,
    });

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
