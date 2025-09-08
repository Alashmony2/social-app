"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../DB/user/user.model");
const error_1 = require("../../utils/error");
const user_repository_1 = require("../../DB/user/user.repository");
class AuthService {
    userRepository = new user_repository_1.UserRepository();
    constructor() { }
    async register(req, res, next) {
        //get data form request
        const registerDto = req.body;
        //check user exist
        const userExist = await user_model_1.User.findOne({ email: registerDto.email });
        if (userExist) {
            throw new error_1.ConflictException("User already exist");
        }
        //save into DB
        await this.userRepository.getAllUsers();
        const user = new user_model_1.User(registerDto);
        const createdUser = await user.save();
        //send response
        return res.status(201).json({
            message: "User Created Successfully",
            success: true,
            data: createdUser,
        });
    }
}
exports.default = new AuthService();
