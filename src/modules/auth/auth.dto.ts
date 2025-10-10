import { GENDER } from "../../utils/common/enum";

export interface RegisterDTO {
      fullName?: string;
      email: string;
      password: string;
      phoneNumber?: string;
      gender: GENDER;
}
export interface LoginDTO {
    email: string;
    password: string;
}
export interface ConfirmEmailDTO {
    email: string;
    otp: string;
}
export interface UpdatePasswordDTO {
    email: string;
    oldPassword: string;
    newPassword: string;
}