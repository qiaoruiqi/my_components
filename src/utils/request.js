import axios from "axios";
import {  serverUrl } from "./tools";

const instance = axios.create({
  baseURL: serverUrl, //请求的基础地址
  timeout: 5000,//超时处理
  withCredentials: true,//是否跨域
});

//add a request interceptor,发起请求之前执行
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//add a response interceptor，请求返回之后拦截
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * get请求
 * @param  url 地址
 * @param  params 参数
 * @returns
 */
export const get = (url, params = {}) =>
  instance.get(url, { params }).then((res) => res.data);

/**
 * post请求
 * @param  url 地址
 * @param  data 参数
 * @returns
 */
export const post = (url, data) =>
  instance.post(url, data).then((res) => res.data);

  
/**
 * put请求
 * @param  url 地址
 * @param  data 参数
 * @returns
 */
export const put = (url, data) =>
  instance.put(url, data).then((res) => res.data);

/**
 * patch请求
 * @param  url 地址
 * @param  data 参数
 * @returns
 */
export const patch = (url, data) =>
  instance.patch(url, data).then((res) => res.data);

/**
 * delete请求
 * @param  url 地址
 * @returns
 */

export const del = (url) => instance.delete(url);
