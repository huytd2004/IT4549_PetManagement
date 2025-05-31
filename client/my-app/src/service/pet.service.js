import { del, get,post,put } from "../utils/request";

export const getPetManage = async () => {
    const result = await get(`pets`);
    return result;
}
export const createPetManage = async (option)=>{
    const result = await post("pets",option);
    return result;
}

export const editPetManage = async (id, option) => {
  const result = await put(`pets/${id}`, option);
  return result;
};
export const deletePetManage = async(id)=>{
    const result = await del(`pets/${id}`)
    return result;
}


