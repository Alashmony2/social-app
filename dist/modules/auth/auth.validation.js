"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBasicInfoSchema = exports.updatePasswordSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(20),
    email: zod_1.z.email(),
    password: zod_1.z.string(),
    phoneNumber: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utils_1.GENDER),
});
exports.updatePasswordSchema = zod_1.z.object({
    email: zod_1.z.email(),
    oldPassword: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
exports.updateBasicInfoSchema = zod_1.z.object({
    email: zod_1.z.email(),
    fullName: zod_1.z.string().min(2).max(40).optional(),
    gender: zod_1.z.enum(utils_1.GENDER).optional(),
});
