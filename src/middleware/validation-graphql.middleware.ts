import { BadRequestException } from "../utils";
import { ZodType } from "zod";

export const isValidGraphql = (schema: ZodType, args: any) => {
  //validation
  const result = schema.safeParse(args);
  if (!result.success) {
    let errMessages = result.error.issues.map((issue) => ({
      path: issue.path[0],
      message: issue.message,
    }));
    throw new BadRequestException(JSON.stringify(errMessages));
  }
};
