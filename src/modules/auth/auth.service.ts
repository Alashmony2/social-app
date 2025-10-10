import type { NextFunction, Request, Response } from "express";
import {
  ConfirmEmailDTO,
  LoginDTO,
  RegisterDTO,
  UpdatePasswordDTO,
} from "./auth.dto";
import {
  ConflictException,
  ForbiddenException,
  NotAuthorizedException,
} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { compareHash, generateHash } from "../../utils";
import { authProvider } from "./provider/auth.provider";
import { generateToken } from "../../utils";

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
      { isVerified: true, $unset: { otp: "", otpExpiryAt: "" } }
    );
    //send response
    return res.sendStatus(204);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    //get data form request
    const loginDto: LoginDTO = req.body;
    //check user exist
    const userExist = await this.userRepository.exist({
      email: loginDto.email,
    });
    if (!userExist) {
      throw new ForbiddenException("Invalid Credentials");
    }
    //check is password valid
    const isPasswordValid = await compareHash(
      loginDto.password,
      userExist.password
    );
    if (!isPasswordValid) {
      throw new ForbiddenException("Invalid Credentials");
    }
    if (!userExist.isVerified) {
      throw new NotAuthorizedException("Verify your account first");
    }
    //generate token
    const accessToken = generateToken({
      payload: { _id: userExist._id, role: userExist.role },
      options: {
        expiresIn: "1d",
      },
    });

    return res.status(200).json({
      message: " Login Successfully",
      success: true,
      data: { accessToken },
    });
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    // get data from request
    const updatePasswordDTO: UpdatePasswordDTO = req.body;
    // check user exist
    const userExist = await this.userRepository.exist({ email: updatePasswordDTO.email });
    if (!userExist) {
      throw new ForbiddenException("Invalid Credentials");
    }
    // validate old password
    const isOldValid = await compareHash(updatePasswordDTO.oldPassword, userExist.password);
    if (!isOldValid) {
      throw new ForbiddenException("Invalid Credentials");
    }
    // hash new password and update
    const newHashed = await generateHash(updatePasswordDTO.newPassword);
    await this.userRepository.update(
      { email: updatePasswordDTO.email },
      {
        password: newHashed,
        credentialUpdatedAt: new Date() as unknown as Date,
      }
    );
    // send response
    return res.status(200).json({message:"Password updated successfully",success:true});
  };
}
export default new AuthService();
