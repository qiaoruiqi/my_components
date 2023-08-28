import { get, post, patch, del } from "../utils/request";
/**
 * 新增
 * @param data
 * @returns 
 */
export const UploadFileAPI = (data) => 
post('/admin/medicines/', data);

