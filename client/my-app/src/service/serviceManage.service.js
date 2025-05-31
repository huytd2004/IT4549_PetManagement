import { del, get,post,put } from "../utils/request";

export const getServiceManage = async () => {
    const result = await get(`service`);
    return result;
}
export const createServiceManage = async (option)=>{
    const result = await post("service",option);
    return result;
}

export const editServiceManage = async (id, option) => {
  const result = await put(`service/${id}`, option);
  return result;
};
export const deleteServiceManage = async(id)=>{
    const result = await del(`service/${id}`)
    return result;
}