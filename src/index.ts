import { log } from "console";
import express from "express";
import { config } from "dotenv";
config({path:"./config/dev.env"});
import { bootstrap } from "./app.controller";
const app = express();
const port = 3000;
bootstrap(app,express);
app.listen(port,()=>{
    log("Server is running on port",port)
})