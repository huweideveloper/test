import './index.less'
import api from './api.js'
class taskQuery extends Interstellar.pagesBase {
  complete() {
    new Vue({
      el: '#taskQuery',
      data() {
        return {
          seriesStr: ''
        }
      },
      mounted() {
      },
      methods: {
        // 点击下载地址
        async handleExportTask() {
          if (!this.seriesStr || !this.seriesStr.trim()) return this.$message.warning('请输入序列号')
          const seriesList = this.seriesStr.split('\n')
          const res = await api.exportTaskBySeriesList({
            seriesList,
            useCallerHandler: true // 此接口报错功能层不处理，让调用方自行处理
          })
          Tool.exportCSVFile(res, `TASK_${new Date().getTime()}.csv`)
        }
      }
    })
  }
}

module.exports = taskQuery
