import { del, get,post,put } from "../utils/request";

export const getListPet = async () => {
    const result = await get(`pet_list`);
    return result;
}
export const createListPet = async (option)=>{
    const result = await post("pet_list",option);
    return result;
}

export const editListPet = async (id, option) => {
  const result = await put(`pet_list/${id}`, option);
  return result;
};
export const deleteListPet = async(id)=>{
    const result = await del(`pet_list/${id}`)
    return result;
}
export const getPetDetail = async (id) => {
    const result = await get(`pet_list/${id}`);
    return result;
}