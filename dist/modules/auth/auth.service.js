"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../utils/error");
const user_repository_1 = require("../../DB/user/user.repository");
const factory_1 = require("./factory");
const hash_1 = require("../../utils/hash");
const email_1 = require("../../utils/email");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
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
            throw new error_1.ConflictException("User already exist");
        }
        //prepare data
        const user = this.authFactoryService.register(registerDto);
        //save into DB
        const createdUser = await this.userRepository.create(user);
        //send email
        await (0, email_1.sendEmail)({
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
    confirmEmail = async (req, res, next) => {
        const confirmEmailDto = req.body;
        const userExist = await this.userRepository.exist({
            email: confirmEmailDto.email,
        });
        if (!userExist) {
            throw new error_1.NotFoundException("User not Found");
        }
        //check otp
        if (userExist.otp !== confirmEmailDto.otp) {
            throw new error_1.NotAuthorizedException("Invalid OTP");
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
            throw new error_1.NotFoundException("User not Found");
        }
        //check is password valid
        const isPasswordValid = (0, hash_1.compareHash)(loginDto.password, userExist.password);
        if (!isPasswordValid) {
            throw new error_1.NotAuthorizedException("Invalid Credentials");
        }
        if (!userExist.isVerified) {
            throw new error_1.NotAuthorizedException("Verify your account first");
        }
        return res.status(200).json({
            message: "User Login Successfully",
            success: true,
            data: userExist,
        });
    };
}
exports.default = new AuthService();
