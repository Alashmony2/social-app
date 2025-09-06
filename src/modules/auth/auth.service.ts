import type { NextFunction, Request, Response } from "express";
import { RegisterDTO } from "./auth.dto";

class AuthService {
  constructor() {}
  register(req: Request, res: Response, next: NextFunction) {
    //get data form request
    const registerDto:RegisterDTO = req.body;
  }
}
export default new AuthService();