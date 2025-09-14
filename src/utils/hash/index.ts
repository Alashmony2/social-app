import bcrypt from 'bcryptjs';
export const generateHash = async(planText:string)=>{
    return await bcrypt.hash(planText,10)
}
export const compareHash = async(password:string,hashPassword:string)=>{
    return await bcrypt.compare(password,hashPassword)
}