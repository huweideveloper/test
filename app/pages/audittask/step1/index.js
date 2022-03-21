import './index.less'
import api from '../api.js'
import TaskNameItem from '@/components/task-name-item'
class CreateauditStepOne extends Interstellar.pagesBase {
  complete() {
    const app = this.app

    app.header.openControl('audittaskc')
    app.header.changeselected(1)
    this.styleModel(1)

    const { type, taskid } = app.parpam // 类型 new, edit, view

    new Vue({
      el: '#auditTaskStepOne',
      components: {
        TaskNameItem
      },
      data() {
        return {
          auditTaskStatus: undefined,
          auditProjectList: [], // 可选择的所属审核项目列表
          auditTaskForm: {
            nameData: '', // 审核任务名称对象
            name: '', // 审核任务名称
            projectId: '', // 请选择审核项目
          },
          description: '', // C端审核任务描述
          remark: '', // C端审核任务备注
          rules: {
            name: [
              { required: true, message: '请输入C端审核任务名称', trigger: ['blur', 'change'] }
            ],
            projectId: [
              { required: true, message: '请选择审核项目', trigger: 'change' }
            ]
          }
        }
      },
      watch: {
        'auditTaskForm.nameData'(val) {
          this.auditTaskForm.name = val
        }
      },
      computed: {
        // 选择的项目
        auditProjectDetail() {
          const { projectId } = this.auditTaskForm
          if (!projectId) return {}
          return this.auditProjectList.find(v => v.auditProjectId === projectId) || {}
        }
      },
      created() {
        this.isAdd = type === 'new'
        this.isView = type === 'view'
        this.isEdit = type === 'edit'
        this.queryAuditProjectList()
        taskid && this.queryAuditTaskDetail()
      },
      methods: {
        // 获取审核任务详情信息
        async queryAuditTaskDetail() {
          if (!taskid) return
          const res = await api.queryAuditTaskDetail({
            id: taskid
          })
          const { name, projectId, description, remark, status } = res.data || {}
          this.auditTaskStatus = status
          this.auditTaskForm = Object.assign({}, this.auditTaskForm, {
            name,
            projectId
          })
          this.description = description
          this.remark = remark
        },
        // 获取任务所属审核项目的下拉列表
        async queryAuditProjectList() {
          const res = await api.queryAuditProjectList({
            clientType: 2
          })
          this.auditProjectList = res.data.list || []
        },
        save() {
          let valid = true
          // 验证名称输入对象
          this.$refs.taskNameRef && this.$refs.taskNameRef.validateForm(val => {
            if (!val) valid = false
          })
          this.$refs.auditTaskForm.validate(async val => {
            if (!valid || !val) return
            const { description, remark, isEdit } = this
            const { name, projectId } = this.auditTaskForm
            const requestParams = {
              name,
              projectId,
              description,
              remark
            }
            let requestHandler
            if (isEdit) {
              requestHandler = api.updateAuditTask
              requestParams.isBasic = true
              requestParams.id = taskid
            } else {
              requestHandler = api.createAuditTask
            }
            const res = await requestHandler(requestParams)
            // 跳转第二步
            app.changePage('createaudittaskc2', {
              type: 'edit',
              taskid: isEdit ? taskid : res.data.id,
              projectid: projectId,
              status: isEdit ? this.auditTaskStatus : 1
            })
          })
        }
      }
    })
  }
}

module.exports = CreateauditStepOne
