import { z } from "zod";
import { GENDER } from "../../utils";
import { RegisterDTO } from "./auth.dto";

export const registerSchema = z.object<RegisterDTO>({
  fullName: z.string().min(2).max(20) as unknown as string,
  email: z.email() as unknown as string,
  password: z.string() as unknown as string,
  phoneNumber: z.string().optional() as unknown as string,
  gender: z.enum(GENDER) as unknown as GENDER,
});

