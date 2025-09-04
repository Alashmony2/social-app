import type { NextFunction, Request, Response } from "express";

class AuthService {
  constructor() {}
  register(req: Request, res: Response, next: NextFunction) {
    return res
      .status(200)
      .json({ message: "register route", success: true, data: req.body });
  }
}
export default new AuthService();