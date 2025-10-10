"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_2 = require("../../utils");
const auth_provider_1 = require("./provider/auth.provider");
const utils_3 = require("../../utils");
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
        //send response
        return res.status(201).json({
            message: "User Created Successfully",
            success: true,
            data: { id: createdUser.id },
        });
    };
    confirmEmail = async (req, res, next) => {
        //get data from req
        const confirmEmailDto = req.body;
        await auth_provider_1.authProvider.checkOTP(confirmEmailDto);
        this.userRepository.update({ email: confirmEmailDto.email }, { isVerified: true, $unset: { otp: "", otpExpiryAt: "" } });
        //send response
        return res.sendStatus(204);
    };
    login = async (req, res, next) => {
        //get data form request
        const loginDto = req.body;
        //check user exist
        const userExist = await this.userRepository.exist({
            email: loginDto.email,
        });
        if (!userExist) {
            throw new utils_1.ForbiddenException("Invalid Credentials");
        }
        //check is password valid
        const isPasswordValid = await (0, utils_2.compareHash)(loginDto.password, userExist.password);
        if (!isPasswordValid) {
            throw new utils_1.ForbiddenException("Invalid Credentials");
        }
        if (!userExist.isVerified) {
            throw new utils_1.NotAuthorizedException("Verify your account first");
        }
        //generate token
        const accessToken = (0, utils_3.generateToken)({
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
    updatePassword = async (req, res, next) => {
        // get data from request
        const updatePasswordDTO = req.body;
        // check user exist
        const userExist = await this.userRepository.exist({
            email: updatePasswordDTO.email,
        });
        if (!userExist) {
            throw new utils_1.ForbiddenException("Invalid Credentials");
        }
        // validate old password
        const isOldValid = await (0, utils_2.compareHash)(updatePasswordDTO.oldPassword, userExist.password);
        if (!isOldValid) {
            throw new utils_1.ForbiddenException("Invalid Credentials");
        }
        // hash new password and update
        const newHashed = await (0, utils_2.generateHash)(updatePasswordDTO.newPassword);
        await this.userRepository.update({ email: updatePasswordDTO.email }, {
            password: newHashed,
            credentialUpdatedAt: new Date(),
        });
        // send response
        return res
            .status(200)
            .json({ message: "Password updated successfully", success: true });
    };
    updateBasicInfo = async (req, res, next) => {
        //get data from request
        const updateBasicInfoDTO = req.body;
        // check user exist
        const userExist = await this.userRepository.exist({
            email: updateBasicInfoDTO.email,
        });
        if (!userExist) {
            throw new utils_1.NotFoundException("User not found");
        }
        //update user
        let firstName = userExist.firstName;
        let lastName = userExist.lastName;
        if (updateBasicInfoDTO.fullName) {
            const [fName, lName] = updateBasicInfoDTO.fullName.split(" ");
            firstName = fName || firstName;
            lastName = lName || lastName;
        }
        await this.userRepository.update({ email: updateBasicInfoDTO.email }, {
            firstName,
            lastName,
            gender: updateBasicInfoDTO.gender,
        });
        return res
            .status(200)
            .json({
            message: "Profile updated successfully",
            success: { data: userExist },
        });
    };
}
exports.default = new AuthService();
