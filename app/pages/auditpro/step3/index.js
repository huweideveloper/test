import './index.less'
import api from '../api.js'
import { Message } from 'element-ui'

class CreateauditStepThree extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('auditprojectc')
    this.app.header.changeselected(3)
    this.styleModel(1)

    const self = this
    const app = this.app
    new Vue({
      el: '#createauditProStepThree',
      data() {
        return {
          app,
          type: app.parpam.type, // 类型 new, edit, view
          id: app.parpam.projectid * 1, // 项目ID
          status: parseInt(app.parpam.status),
          hasExportPermission: false, // 是否有批量导出权限
          tableData: [],
          selTasks: [] // 选择的任务
        }
      },
      mounted() {
        this.hasExportPermission = self.checkPermission('audittask', 'EXPORT')
        this.id && this.queryAuditTaskSearch()
      },
      methods: {
        // 获取项目信息
        async queryAuditTaskSearch() {
          if (!this.id) return
          const res = await api.auditTaskSearch({
            page: 1,
            projectIdList: [this.id],
            isReleased: false
          })
          this.tableData = res.data.list || []
        },
        // 选择的项目
        handleSelectionChange(val) {
          this.selTasks = val
        },
        // 批量导出
        handleBatchExport() {
          const { selTasks } = this
          if (!selTasks.length) {
            Message.warning('请先选择需要导出的任务')
            return
          }
          const taskIdList = selTasks.map(v => v.id)
          const json = { taskIds: taskIdList }
          const url = `${this.app.domain1}v1/audit/task/series/result/batch_export?param=${encodeURIComponent(JSON.stringify(json))}`
          self.api.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: this.app.local.get('accessToken')
          })
        }
      }
    })
  }
}

module.exports = CreateauditStepThree
