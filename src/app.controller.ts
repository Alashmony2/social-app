import { type Express } from "express";
import { authRouter , postRouter, userRouter } from "./modules";
import { connectDB } from "./DB";
import { Request, NextFunction, Response } from "express";
import { AppError } from "./utils";
export function bootstrap(app: Express, express: any) {
  connectDB();
  //parsing body => row json
  app.use(express.json());
  //auth
  app.use("/auth", authRouter);
  //user
  app.use("/user", userRouter);
  //post
  app.use("/post", postRouter);
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
  //global error handler
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(error.statusCode ||500).json({
        message: error.message,
        success: false,
        errorDetails: error.errorDetails,
      });
    }
  );
}
