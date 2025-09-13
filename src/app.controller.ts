import { type Express } from "express";
import authRouter from "./modules/auth/auth.controller";
import { connectDB } from "./DB/connection";
import type { Request, NextFunction, Response } from "express";
import { AppError } from "./utils/error";
export function bootstrap(app: Express, express: any) {
  connectDB();
  //parsing body => row json
  app.use(express.json());
  //auth
  app.use("/auth", authRouter);
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
  //global error handler
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res
        .status(error.statusCode)
        .json({
          message: error.message,
          success: false,
          errorDetails: error.errorDetails,
        });
    }
  );
}
