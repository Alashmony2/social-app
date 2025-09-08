"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../utils/error");
const user_repository_1 = require("../../DB/user/user.repository");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    constructor() { }
    async register(req, res, next) {
        //get data form request
        const registerDto = req.body;
        //check user exist
        const userExist = await this.userRepository.exist({
            email: registerDto.email,
        });
        if (userExist) {
            throw new error_1.ConflictException("User already exist");
        }
        //save into DB
        const createdUser = await this.userRepository.create(registerDto);
        //send response
        return res.status(201).json({
            message: "User Created Successfully",
            success: true,
            data: createdUser,
        });
    }
}
exports.default = new AuthService();
