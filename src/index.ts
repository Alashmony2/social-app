import { log } from "console";
import express from "express";
import { config } from "dotenv";
config();
import { bootstrap } from "./app.controller";
import { initSocket } from "./socket-io";
const app = express();
const port = 3000;
bootstrap(app, express);
const server = app.listen(port, () => {
  log("Server is running on port", port);
});
initSocket(server)