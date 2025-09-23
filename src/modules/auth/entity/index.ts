import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";

export class User {
  public fullName!: string;
  public email!: string;
  public password!: string;
  public credentialUpdatedAt!: Date;
  public phoneNumber!: string;
  public role!: SYS_ROLE;
  public gender!: GENDER;
  public userAgent!: USER_AGENT;
  public otp!: string;
  public otpExpiryAt!: Date;
  public isVerified!: boolean;

}
