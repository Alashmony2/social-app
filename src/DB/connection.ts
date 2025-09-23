import mongoose from "mongoose";
import { devConfig } from "../config/env/dev.config";

export const connectDB = async () => {
    await mongoose.connect(devConfig.DB_URL as string).then(()=>{
        console.log("DB connected successfully");
    }).catch((err)=>{
        console.log('Fail to connect to DB',err);
    })
}