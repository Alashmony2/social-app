"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const modules_1 = require("./modules");
const DB_1 = require("./DB");
const cors_1 = __importDefault(require("cors"));
const express_1 = require("graphql-http/lib/use/express");
const app_schema_1 = require("./app.schema");
function bootstrap(app, express) {
    (0, DB_1.connectDB)();
    //parsing body => row json
    app.use(express.json());
    app.use((0, cors_1.default)({ origin: "*" }));
    //auth
    app.use("/auth", modules_1.authRouter);
    //user
    app.use("/user", modules_1.userRouter);
    //post
    app.use("/post", modules_1.postRouter);
    //comment
    app.use("/comment", modules_1.commentRouter);
    //chat
    app.use("/chat", modules_1.chatRouter);
    //graphql
    app.all("/graphql", (0, express_1.createHandler)({ schema: app_schema_1.appSchema }));
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "invalid router", success: false });
    });
    //global error handler
    app.use((error, req, res, next) => {
        return res.status(error.statusCode || 500).json({
            message: error.message,
            success: false,
            errorDetails: error.errorDetails,
        });
    });
}
