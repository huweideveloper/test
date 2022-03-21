/*
  垃圾代码，新需求不要用，http请求请使用http.js文件
*/


import { MessageBox, Message } from 'element-ui'
const ClipboardJS = require("../../libs/clipboard.min.js")
// 实现单例

/**
 * http 请求拦截类
 */

async function filterError(res) {

  if(res.code == -1){
    this.app.alert.show({
      title: ' ',
      msg: '繁忙',
      close: true,
      footer: false,
      sure: ()=> {

      }
    })
  }
  if (res.code == 503) {
    this.app.alert.show({
      title: ' ',
      msg: '账户已被冻结。',
      close: true,
      footer: false,
      sure: ()=> {
        this.app.loading.hide()
        this.app.changePage('login');
      }
    })
    setTimeout(()=> {
      this.app.alert.hide()
      this.app.loading.hide()
      this.app.changePage('login');
    }, 5000)
    throw new Error(JSON.stringify(res))
  }
  if (res.code == 56) {
    this.app.alert.show({
      title: ' ',
      msg: res.msg,
      close: true,
      footer: false,
      sure: ()=> {
        this.app.loading.hide()
        this.app.changePage('login');
      }
    })
    setTimeout(()=> {
      this.app.alert.hide()
      this.app.loading.hide()
      this.app.changePage('login');
    }, 5000)
    throw new Error(JSON.stringify(res))
    return
  }
  if (res.code == 501) {
    this.app.changePage('login');
    return
  }
  // if (res.code != 0) {
  //   this.app.alert.show({
  //     title: '',
  //     msg: res.msg,
  //     close: true,
  //     footer: true
  //   })
  //   throw new Error(JSON.stringify(res))
  // }
  return res
}





/*
  垃圾代码，新需求不要用，http请求请使用http.js文件
*/

class HttpRequest {
  /**
* http post
* @method  POST
* @param  {object}  app  定义的全局方法和变量
* @param  {string}  url  接口名
* @param  {JSON}  params  接口参数json对象
* @param  {string}  contentType 传输格式
* @return {promise}
*/
  constructor(app){
    this.app = app
    this.targetResultCodeClipboard = null // 提取码剪贴板
  }

  async POST(url, params, domin = this.app.domain1, contentType = "application/json") {
    // app.loading.show()
    url.includes('sys/transfer') && (params.client = 'B')
    const requestParams = {
      url: `${domin}v1${url}`,
      type: "POST",
      dataType: "json",
      contentType,
      questring: params
    }
    let res = await ES.ajax(requestParams)
    // if (this.app.apiresult(res)) {
    //   return res
    // }
    return filterError.call(this, res)
  }
  async GET(url, params, domin = this.app.domain1, contentType = "application/json") {
    // app.loading.show()
    url = 'v1' + url// 版本号
    let res = await ES.ajax({
      url: domin + url,
      type: "GET",
      dataType: "json",
      contentType,
      questring: params
    })
    // if (this.app.apiresult(res)) {
    //   return res
    // }
    return filterError.call(this, res)
  }
  /**
   *
   * @param {string} url
   * @param {object} header 传入header的字典
   */
  downLoadFile(url, header) {
    // url = '/v1' + url // 版本号
    this.app.loading.show()
    let xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.responseType = "blob";
    if (header) {
      xhr.setRequestHeader(header.key, header.val)
    }
    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
            var reader = new FileReader()
            reader.onload = e => {
              const targetResultStr = e.target.result
              if(targetResultStr.charAt(0)=='{'){
                const { code, data, msg } = JSON.parse(targetResultStr)
                if(code === 0 && data) {
                  // 弹窗显示提取码
                  MessageBox.alert(
                    `<div id="targetResultCodeModal">
                    <p>请前往跳板机通过小工具下载标注结果，本次的提取码：</p>
                    <a class="target-result-code" data-clipboard-text="${data}" style="word-break: break-word">${data}</a>
                    </div>`,
                    '',
                    { dangerouslyUseHTMLString: true }
                  )
                  // 复制提取码
                  if (!this.targetResultCodeClipboard) {
                    setTimeout(() => {
                      this.targetResultCodeClipboard = new ClipboardJS(".target-result-code", {
                        container: document.getElementById('targetResultCodeModal') // 弹窗的复制，需要设置container，否则剪贴板为空
                      })
                      this.targetResultCodeClipboard.on("success", function(e) {
                        Message.closeAll()
                        Message.success('已复制到粘贴板')
                        e.clearSelection()
                      })
                    }, 300);
                  }
                } else {
                  MessageBox.alert(msg)
                }
                this.app.loading.hide()
              }else{
                // let blob = new Blob([xhr.response], { type: "application/vnd.ms-excel;charset=UTF-8" })
                let blob = new Blob([xhr.response], { type: "application/x-zip-compressed;" })
                // let blob = new Blob([xhr.response])
                console.log(xhr.getResponseHeader('content-disposition'),'333444')
                if (typeof window.chrome !== 'undefined') {
                  let link = document.createElement('a')
                  let name = xhr.getResponseHeader('content-disposition').split('filename=')[1]
                  // console.log(name.charAt(0),name.replace(/"/g,""))
                  link.download = name.replace(/"/g,"");
                  link.href = window.URL.createObjectURL(blob)
                  link.click()
                  this.app.loading.hide()
                } else {
                  alert('请使用最新版本的Chrome浏览器')
                }
              }
            }
            reader.readAsText(xhr.response)
        } catch (err) {

        }
      }
    }
    xhr.onerror = async () => {
      // loadingHide
      this.app.loading.hide()
      reject(new Error(xhr.status || 'Server is fail.'));
    }
    xhr.send();

  }
}

module.exports = HttpRequest
