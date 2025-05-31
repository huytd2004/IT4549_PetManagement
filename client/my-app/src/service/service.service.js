import { del, get,post } from "../utils/request";

export const getListService = async () => {
    const result = await get(`service_list`);
    return result;
}
export const serviceRegister = async (option)=>{
    const result = await post("service_register",option);
    return result;
}

export const getListServiceRegister = async () => {
    const result = await get(`service_register`);
    return result;
}
export const deleteServiceRegisterById = async(id)=>{
    const result = await del(`service_register/${id}`)
    return result;
}