"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app_controller_1 = require("./app.controller");
const socket_io_1 = require("./socket-io");
const app = (0, express_1.default)();
const port = 3000;
(0, app_controller_1.bootstrap)(app, express_1.default);
const server = app.listen(port, () => {
    (0, console_1.log)("Server is running on port", port);
});
(0, socket_io_1.initSocket)(server);
