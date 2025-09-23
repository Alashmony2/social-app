"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res, next) => {
        //get data form request
        const registerDto = req.body;
        //check user exist
        const userExist = await this.userRepository.exist({
            email: registerDto.email,
        });
        if (userExist) {
            throw new utils_1.ConflictException("User already exist");
        }
        //prepare data
        const user = await this.authFactoryService.register(registerDto);
        //save into DB
        const createdUser = await this.userRepository.create(user);
        //send email
        await (0, utils_1.sendMail)({
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
            data: createdUser,
        });
    };
    confirmEmail = async (req, res, next) => {
        const confirmEmailDto = req.body;
        const userExist = await this.userRepository.exist({
            email: confirmEmailDto.email,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("User not Found");
        }
        //check otp
        if (userExist.otp !== confirmEmailDto.otp) {
            throw new utils_1.NotAuthorizedException("Invalid OTP");
        }
        //update user
        userExist.otp = undefined;
        userExist.otpExpiryAt = undefined;
        userExist.isVerified = true;
        //save into DB
        await this.userRepository.update({ email: confirmEmailDto.email }, userExist, { new: true });
        //send response
        return res.status(200).json({
            message: "User Email Confirmed Successfully",
            success: true,
            data: userExist,
        });
    };
    login = async (req, res, next) => {
        //get data form request
        const loginDto = req.body;
        //check user exist
        const userExist = await this.userRepository.exist({
            email: loginDto.email,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("User not Found");
        }
        //check is password valid
        const isPasswordValid = (0, utils_2.compareHash)(loginDto.password, userExist.password);
        if (!isPasswordValid) {
            throw new utils_1.NotAuthorizedException("Invalid Credentials");
        }
        if (!userExist.isVerified) {
            throw new utils_1.NotAuthorizedException("Verify your account first");
        }
        return res.status(200).json({
            message: "User Login Successfully",
            success: true,
            data: userExist,
        });
    };
}
exports.default = new AuthService();
