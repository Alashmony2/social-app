import { config } from "dotenv";
config();
export const devConfig = {
  PORT : process.env.PORT,  
  DB_URL: process.env.DB_URL,
  EMAIL_USER: process.env.EMAIL_USER ,
  EMAIL_PASS: process.env.EMAIL_PASS ,
  JWT_SECRET: process.env.JWT_SECRET
};
