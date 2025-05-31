import { del, get,post,put } from "../utils/request";

export const getAccounts = async () => {
    const result = await get(`accounts`);
    return result;
}
export const createAccounts = async (option)=>{
    const result = await post("accounts",option);
    return result;
}

export const editAccounts = async (id, option) => {
  const result = await put(`accounts/${id}`, option);
  return result;
};
export const deleteAccounts = async(id)=>{
    const result = await del(`accounts/${id}`)
    return result;
}