import { GENDER } from "../../utils/common/enum";

export interface RegisterDTO {
      fullName?: string;
      email: string;
      password: string;
      phoneNumber?: string;
      gender: GENDER;
}