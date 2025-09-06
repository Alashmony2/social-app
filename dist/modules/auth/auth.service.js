"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../DB/user/user.model");
const error_1 = require("../../utils/error");
class AuthService {
    constructor() { }
    async register(req, res, next) {
        //get data form request
        const registerDto = req.body;
        //check user exist 
        const userExist = await user_model_1.User.findOne({ email: registerDto.email });
        if (userExist) {
            throw new error_1.ConflictException("User already exist");
        }
    }
}
exports.default = new AuthService();
