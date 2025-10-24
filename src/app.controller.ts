import { type Express } from "express";
import { authRouter, postRouter, userRouter, commentRouter, chatRouter } from "./modules";
import { connectDB } from "./DB";
import { Request, NextFunction, Response } from "express";
import { AppError } from "./utils";
import cors from "cors"
import { createHandler } from "graphql-http/lib/use/express";
import { appSchema } from "./app.schema";
export function bootstrap(app: Express, express: any) {
  connectDB();
  //parsing body => row json
  app.use(express.json());
  app.use(cors({origin:"*"}))
  //auth
  app.use("/auth", authRouter);
  //user
  app.use("/user", userRouter);
  //post
  app.use("/post", postRouter);
  //comment
  app.use("/comment", commentRouter);
  //chat
  app.use("/chat", chatRouter);
  //graphql
  app.all("/graphql",createHandler({schema:appSchema}))
  app.use("/{*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "invalid router", success: false });
  });
  //global error handler
  app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(error.statusCode || 500).json({
        message: error.message,
        success: false,
        errorDetails: error.errorDetails,
      });
    }
  );
}
