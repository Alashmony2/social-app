import { JwtPayload } from "jsonwebtoken";
import { GENDER, SYS_ROLE, USER_AGENT } from "../enum";
import { ObjectId } from "mongoose";

export interface IAttachment {
  url: string;
  id: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  credentialUpdatedAt?: Date;
  phoneNumber?: string;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string;
  otpExpiryAt: Date;
  isVerified?: boolean;
}

export interface IUser {
  _id: ObjectId;
}

export interface IPost {
  userId: ObjectId;
  content: string;
  likes: ObjectId[];
  attachments: IAttachment[];
}

export interface IPayload extends JwtPayload {
  _id: string;
  role: string;
}

declare module "express" {
  interface Request {
    user?: IUser;
  }
}
