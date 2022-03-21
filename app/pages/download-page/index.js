import './index.less'

class DownloadPage extends Interstellar.pagesBase {
  complete() {
    // 隐藏左边菜单
    this.styleModel(1)
    const { downloadPath } = this.app.parpam // 类型 new, edit, view
    const that = this
    new Vue({
      el: '#downloadPage',
      data() {
        return {
          downloadData: {}
        }
      },
      mounted() {
        this.handleDownload()
        // window.close()
      },
      methods: {
        // 点击下载地址
        async handleDownload() {
          const url = decodeURIComponent(downloadPath)
          window.open(url, '_blank') // 下载
        }
      }
    })
  }
}

module.exports = DownloadPage
