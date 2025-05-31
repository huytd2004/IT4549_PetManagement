import { del, get, post, put } from "../utils/request";

export const getCustomersManage = async () => {
    return await get(`customers`);
};

export const createCustomersManage = async (option) => {
    return await post("customers", option);
};

export const editCustomersManage = async (id, option) => {
    return await put(`customers/${id}`, option);
};

export const deleteCustomersManage = async (id) => {
    return await del(`customers/${id}`);
};
