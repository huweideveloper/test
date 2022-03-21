import './index.less'
import api from '../api.js'
import AddAuditSourceModal from '../components/AddAuditSourceModal.vue'
import AddAuditSourceDetailModal from '../components/AddAuditSourceDetailModal.vue'
import PopConfirm from '@/components/pop-confirm/index.vue'

class CreateauditStepTwo extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('auditprojectc')
    this.app.header.changeselected(2)
    this.styleModel(1)

    const app = this.app

    new Vue({
      el: '#createauditProStepTwo',
      components: {
        AddAuditSourceModal,
        AddAuditSourceDetailModal,
        PopConfirm
      },
      provide: {
        app
      },
      data() {
        return {
          app,
          type: app.parpam.type, // 类型 new, edit
          id: app.parpam.projectid * 1, // 项目ID
          status: parseInt(app.parpam.status),
          projectStatistics: {}, // 选择的审核任务统计数据
          auditProjectDetail: {}, // 项目信息

          visibleAddSourceModal: false, // 显示添加审核源弹窗
          visibleAddSourceDetailModal: false // 显示添加详情
        }
      },
      computed: {
        isView() {
          return this.type === 'view'
        },
        isStart() { // 已开启
          return this.status === 2
        }
      },
      mounted() {
        if (this.id) {
          this.queryAuditProjectDetail()
          this.queryAuditProjectStatistics()
        }
      },
      methods: {
        // 获取项目信息
        async queryAuditProjectDetail() {
          const res = await api.auditProjectRead({
            auditProjectId: this.id
          })
          this.auditProjectDetail = res.data || {}
        },
        // 显示添加审核源弹窗 isSaveSuccess:是否保存成功
        showAddSourceModal(visible = true, isSaveSuccess) {
          this.visibleAddSourceModal = visible
          isSaveSuccess && this.queryAuditProjectStatistics()
        },
        // 显示添加审核源弹窗
        showAddSourceDetailModal(visible = true) {
          this.queryAuditProjectStatistics()
          this.visibleAddSourceDetailModal = visible
        },
        // 删除旧的审核源，并显示添加审核源弹窗
        async deleteAndShowAddSourceModal() {
          await api.auditProjectSourceEdit({
            auditProjectId: this.id,
            taskIdList: [],
            action: 3 // 1:新增 3:删除
          })
          this.showAddSourceModal()
          this.queryAuditProjectStatistics()
        },
        // 查询导入统计数据
        async queryAuditProjectStatistics() {
          if (!this.id) return
          const res = await api.auditProjectStatistics({
            auditProjectId: this.id
          })
          this.projectStatistics = res.data || {}
        }
      }
    })
  }
}

module.exports = CreateauditStepTwo
