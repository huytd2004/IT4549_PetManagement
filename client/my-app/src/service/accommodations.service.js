import { del, get,post,put } from "../utils/request";

export const getAccommodations = async () => {
    const result = await get(`accommodations`);
    return result;
}
export const createAccommodations = async (option)=>{
    const result = await post("accommodations",option);
    return result;
}

export const editAccommodations = async (id, option) => {
  const result = await put(`accommodations/${id}`, option);
  return result;
};
export const deleteAccommodations = async(id)=>{
    const result = await del(`accommodations/${id}`)
    return result;
}
