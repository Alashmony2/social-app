"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const modules_1 = require("./modules");
const DB_1 = require("./DB");
function bootstrap(app, express) {
    (0, DB_1.connectDB)();
    //parsing body => row json
    app.use(express.json());
    //auth
    app.use("/auth", modules_1.authRouter);
    //user
    app.use("/user", modules_1.userRouter);
    //post
    app.use("/post", modules_1.postRouter);
    //comment
    app.use("/comment", modules_1.commentRouter);
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
