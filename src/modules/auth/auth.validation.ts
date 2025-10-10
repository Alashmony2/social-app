import { z } from "zod";
import { GENDER } from "../../utils";
import { RegisterDTO, UpdatePasswordDTO } from "./auth.dto";

export const registerSchema = z.object<RegisterDTO>({
  fullName: z.string().min(2).max(20) as unknown as string,
  email: z.email() as unknown as string,
  password: z.string() as unknown as string,
  phoneNumber: z.string().optional() as unknown as string,
  gender: z.enum(GENDER) as unknown as GENDER,
});

export const updatePasswordSchema = z.object<UpdatePasswordDTO>({
  email: z.email() as unknown as string,
  oldPassword: z.string() as unknown as string,
  newPassword: z.string() as unknown as string,
});
