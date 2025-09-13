"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const connection_1 = require("./DB/connection");
function bootstrap(app, express) {
    (0, connection_1.connectDB)();
    //parsing body => row json
    app.use(express.json());
    //auth
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "invalid router", success: false });
    });
    //global error handler
    app.use((error, req, res, next) => {
        return res
            .status(error.statusCode)
            .json({
            message: error.message,
            success: false,
            errorDetails: error.errorDetails,
        });
    });
}
