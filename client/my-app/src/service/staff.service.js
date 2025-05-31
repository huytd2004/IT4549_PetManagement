import { del, get,post,put } from "../utils/request";

export const getStaffManage = async () => {
    const result = await get(`staff`);
    return result;
}
export const createStaffManage = async (option)=>{
    const result = await post("staff",option);
    return result;
}

export const editStaffManage = async (id, option) => {
  const result = await put(`staff/${id}`, option);
  return result;
};
export const deleteStaffManage = async(id)=>{
    const result = await del(`staff/${id}`)
    return result;
}
