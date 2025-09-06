"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor() { }
    register(req, res, next) {
        //get data form request
        const registerDto = req.body;
    }
}
exports.default = new AuthService();
