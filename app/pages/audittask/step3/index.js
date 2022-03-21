import './index.less'
import api from '../api.js'
import InputNumber from '@/components/input-number/index.vue'
import PopConfirm from '@/components/pop-confirm/index.vue'

class CreateauditStepThree extends Interstellar.pagesBase {
  complete() {
    const app = this.app

    app.header.openControl('audittaskc')
    app.header.changeselected(3)
    this.styleModel(1)

    const { type, taskid } = app.parpam // 类型 new, edit, view

    new Vue({
      el: '#auditTaskStepThree',
      components: {
        InputNumber,
        PopConfirm
      },
      data() {
        return {
          canEdit: true,
          auditTaskStatus: undefined,
          userCountForAudit: 0, // 可参与审核的人数
          vendorList: [], // 可供选择的单位列表
          costVisible: false, // 开放式时的价格是否可见
          auditTaskForm: {
            taskMode: undefined, // 审核任务方式
            taskAssignMode: 2, // 任务分配方式
            cost: '', // 开放式时的审核单价
            venderAssignList: [this.getOneVenderAssignData()],
            stenosisDetectionCopy: false
          },
          rules: {
            taskMode: [
              { required: true, message: '请选择任务方式', trigger: 'change' }
            ],
            taskAssignMode: [
              { required: true, message: '请选择任务分配方式', trigger: 'change' }
            ],
            cost: [
              { required: true, message: '请输入审核单价', trigger: ['blur', 'change'] }
            ]
          }
        }
      },
      created() {
        this.isView = type === 'view'
        this.taskModeList = [{ label: '承包式', value: 1 }, { label: '开放式', value: 2 }]
        this.taskAssignModeList = [{ label: '抢单式', value: 2 }]
      },
      mounted() {
        this.queryUserCountForAudit()
        this.queryVendorList()
        taskid && this.queryAuditTaskDetail()
      },
      methods: {
        handleTaskModeChange(taskMode) {
          if (taskMode === 1) {
            this.auditTaskForm.venderAssignList = [this.getOneVenderAssignData()]
          } else if (taskMode === 2) {
            this.auditTaskForm.cost = ''
            this.costVisible = false
          }
        },
        async queryAuditTaskDetail() {
          const res = await api.queryAuditTaskDetail({
            id: taskid
          })
          const { method, assignMethod, cost, costVisible, venderAssignList, status, stenosisDetectionCopy } = res.data || {}
          const newAuditTaskForm = {
            taskMode: method === 0 ? undefined : method, // 第三步没有点过保存时会返回0
            taskAssignMode: assignMethod === 0 ? 2 : assignMethod, // 第三步没有点过保存时会返回0
            stenosisDetectionCopy,
            cost
          }
          if (venderAssignList && venderAssignList.length) {
            const tempVenderAssignList = []
            venderAssignList.forEach(({ venderId, cost, costVisible, userList = [] }) => {
              const obj = {
                venderId,
                cost,
                costVisible,
                hasExisted: true
              }
              const userIdList = []
              userList.forEach(({ id, selected }) => {
                selected && userIdList.push(id)
              })
              obj.vendorUserList = userList
              obj.userList = userIdList
              tempVenderAssignList.push(obj)
            })
            newAuditTaskForm.venderAssignList = tempVenderAssignList
          }
          this.auditTaskForm = Object.assign({}, this.auditTaskForm, newAuditTaskForm)
          this.costVisible = costVisible || false // 第三步没有点过保存时会返回null
          this.auditTaskStatus = status
          this.canEdit = !this.isView && status === 1
        },
        async queryUserCountForAudit() {
          const res = await api.queryUserCountForAudit({
            hasAudit: true,
            taskType: 2
          })
          this.userCountForAudit = res.data.count || 0
        },
        async queryVendorList() {
          const res = await api.queryVendorList({})
          this.vendorList = res.data.list || []
        },
        async handleVendorChange(venderId, index) {
          const { venderAssignList } = this.auditTaskForm
          const currentRowData = venderAssignList[index]
          // 先判断是否选择了重复的所属单位
          const tempVenderAssignList = venderAssignList.slice() // 克隆
          tempVenderAssignList.splice(index, 1)
          const venderAssignIndex = tempVenderAssignList.findIndex(({ venderId: id }) => id === venderId)
          if (venderAssignIndex !== -1) { // 说明之前已经选择了此所属单位
            const repeatedlySelectedVendor = this.vendorList.find(({ id }) => id === venderId)
            this.$message.warning(`选择了重复的所属单位：${repeatedlySelectedVendor.name}`)
            currentRowData.venderId = undefined
            currentRowData.userList = []
            currentRowData.vendorUserList = []
            return
          }
          const res = await api.queryVendorUserList({
            venderId,
            taskType: 2
          })
          const tempVendorUserList = currentRowData.vendorUserList = res.data.list || []
          currentRowData.userList = tempVendorUserList.map(({ id }) => id)
        },
        handleAdd() {
          // if (this.isView) return false
          const { venderAssignList } = this.auditTaskForm
          venderAssignList.splice(venderAssignList.length, 0, this.getOneVenderAssignData())
        },
        handleDelete(index) {
          // if (this.isView) return false
          const { venderAssignList } = this.auditTaskForm
          if (this.auditTaskStatus !== 1) {
            const { hasExisted } = venderAssignList[index]
            if (hasExisted) {
              this.$alert('已添加的不能删除')
              return
            }
          }
          venderAssignList.splice(index, 1)
          // 没有数据，默认加一行空的所属单位数据
          !venderAssignList.length && (venderAssignList.push(this.getOneVenderAssignData()))
        },
        // 初始化一行所属单位数据
        getOneVenderAssignData() {
          return {
            venderId: undefined,
            userList: [],
            cost: undefined,
            costVisible: false
          }
        },
        save() {
          this.$refs.auditTaskForm.validate(async valid => {
            if (!valid) return
            let { costVisible } = this
            let { taskMode, taskAssignMode, cost, venderAssignList, stenosisDetectionCopy } = this.auditTaskForm
            if (taskMode === 2) {
              venderAssignList = []
            } else {
              cost = null
              costVisible = false
              venderAssignList.forEach(item => delete item.vendorUserList)
            }
            const requestParams = {
              id: +taskid,
              cost,
              costVisible,
              method: taskMode,
              isBasic: false,
              assignMethod: taskAssignMode,
              venderAssignList,
              stenosisDetectionCopy
            }
            this.auditTaskStatus !== 1 && (requestParams.editTaskUser = true)
            await api.updateAuditTask(requestParams)
            this.$message.success('编辑成功')
            setTimeout(() => {
              app.changePage('audittask')
            }, 1000)
          })
        },
        handleVendorUserClear(vendorUserList) {
          return this.auditTaskStatus === 1 || (vendorUserList && vendorUserList.findIndex(({ selected }) => selected) === -1)
        },
        handleVendorUserDisabled(selected, hasExisted) {
          return hasExisted && this.auditTaskStatus !== 1 && selected === true
        }
      }
    })
  }
}

module.exports = CreateauditStepThree
