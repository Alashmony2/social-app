import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils";
import { ZodType } from "zod";

export const isValid = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //validation
    let data = {...req.body,...req.params,...req.query}
    const result = schema.safeParse(data);
    if (!result.success) {
      let errMessages = result.error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      }));
      throw new BadRequestException("Validation Failed", errMessages);
    }
    next();
  };
};
