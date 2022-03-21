const app = require("../../app/app.js")
import axios from 'axios'
import { Message } from 'element-ui'
const http = axios.create({
  baseURL: '/',
  timeout: 10000
})
const defaultMsg = '系统开小差，请稍后重试'
http.interceptors.request.use(
  config => {
    config.headers['accessToken'] = window.localStorage.accessToken;
    return config
  },
  error => {
    Message.closeAll()
    Message.error(error.msg || defaultMsg)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  res => {
    const resData = res.data || {}
    const { code, data, msg } = resData
    if ( code === 0 ) return data;
    if ( code === undefined  ) return resData; // 上传、下载文件的接口如果访问正常会直接返回文件数据，不会有code值
    Message.closeAll();
    handleError(code, msg);
    return Promise.reject(resData);
  },
  error => {
    Message.closeAll()
    Message.error(error.msg || defaultMsg)
    return Promise.reject(error)
  }
)
// 暂时只覆盖了如下部分的code值，可能会有遗漏
function handleError(code, msg){
    switch (code) {
        case 503 : 
            Message.error("账户已被冻结");
            break;
        case 501 : 
            app.changePage && app.changePage("login");
            break;
        default :
            Message.error(msg);
            break;
    }
}
export default http;
