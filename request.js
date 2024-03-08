import axios from "axios";
// 创建axios实例
const request = axios.create({
  timeout: 60 * 1000, // 请求超时时间
});
// request请求拦截器
request.interceptors.request.use(
  (config) => {
    const { data = {}, method } = config;
    if (method === "post") {
      config.data = data.data;
    }
    // get请求转参数key为params
    if (method === "get" || method === "delete") {
      config.params = data;
    }
    if (method === "put") {
      config.data = { ...data.data };
    }
    return config;
  },
  (error) => error
);

// 请求成功回调
function successCallback(response) {
  // console.log(response);
  return Promise.resolve(response);
}
// 请求错误回调
function errorCallback(error) {
  console.log(error);
  return Promise.reject(error);
}
// response返回拦截器
request.interceptors.response.use(successCallback, errorCallback);

export default request;
