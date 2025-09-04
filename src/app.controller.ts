import {type Express } from 'express';
import authRouter from './modules/auth/auth.controller';
export function bootstrap(app:Express,express:any) {
    //parsing body => row json
    app.use(express.json())
    //auth
    app.use("/auth",authRouter)
    app.use("/{*dummy}",(req,res,next)=>{
        return res.status(404).json({message:"invalid router",success:false})
    })
}
