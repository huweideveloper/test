import axios from 'axios'
import { Message, Loading } from 'element-ui'
const app = require('../app')

const pendingArr = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = config => {
  for (const p in pendingArr) {
    if (pendingArr[p].u === config.url + '&' + config.method) {
      // 当前请求在数组中存在时执行函数体
      pendingArr[p].f() // 执行取消操作
      pendingArr.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

const baseURL = ''
const instance = axios.create({
  baseURL,
  timeout: 3600000, // 请求超时时间
  responseType: 'json',
  headers: {
    'Content-type': 'application/json'
  }
})

let loading
let useCallerHandler
instance.interceptors.request.use(
  config => {
    removePending(config) // 在一个ajax发送前执行一下取消操作

    const token = window.localStorage.accessToken
    config.headers.accessToken = token

    const configData = config.data || {}
    const { noLoading = false, useCallerHandler: tempUseCallerHandler } = configData
    if (!noLoading) {
      loading = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
    }
    useCallerHandler = tempUseCallerHandler
    delete configData.noLoading
    delete configData.useCallerHandler
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    loading && loading.close()
    removePending(response.config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    if (response.status !== 200) {
      return Promise.reject(response.message)
    } else {
      const { data = {} } = response
      const { code, result, msg } = data
      if (code === 0 || useCallerHandler) {
        return data instanceof ArrayBuffer ? response : data // 为了兼容接口返回的二进制字节流
      } else {
        const tempMsg = msg || result || '系统开小差'
        Message.error(tempMsg)
        switch (code) {
          case 501:
            app.changePage("login")
            break
        }
        // Message.closeAll()
        return Promise.reject(tempMsg)
      }
    }
  },
  error => {
    loading && loading.close()
    if (error.msg === 'Network Error') {
      error.msg = '网络异常，请检查您的网络连接'
    }
    if (error && error.response) {
    }
    return Promise.reject(error)
  }
)

export default instance
