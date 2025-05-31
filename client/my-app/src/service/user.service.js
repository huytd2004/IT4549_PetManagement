import { get, post } from "../utils/request"

export const login = async (email,password) =>{
    const result = await get(`accounts?email=${email}&password=${password}`);
    return result;
}
export const register = async (option)=>{
    const result = await post("users",option);
    return result;
}
export const ckeckRegister = async (key,value)=>{
    const result = await get(`users?${key}=${value}`);
    return result;
}