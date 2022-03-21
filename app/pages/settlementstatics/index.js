import './index.less'
import commonApi from '@/api/common.api.js'
import api from './api.js'
import FilterContainer from '@/components/filter-container'
import SelectSearch from '@/components/select-search'
import SelectTablePage from '@/components/select-table-page'
import PopConfirm from '@/components/pop-confirm/index.vue'
import Papa from 'papaparse'
import { throttle } from 'lodash'
import Edit from './components/edit'

class settlementstatics extends Interstellar.pagesBase {
  complete() {
    const TASK_TYPE_LIST = { 1: '标注任务', 2: '审核任务', 3: '算法任务' }
    const TASK_STATUS_LIST = { 1: '待发布', 2: '进行中', 3: '已完成', 4: '已终结' }

    new Vue({
      el: '#settlementstatics',
      components: {
        FilterContainer,
        SelectSearch,
        SelectTablePage,
        PopConfirm,
        Edit
      },
      data() {
        return {
          inputTaskId: '',
          queryTasksLoading: false,
          likeTaskList: [],
          taskIdList: [],
          inputProjectId: '',
          queryProjectsLoading: false,
          likeProjectList: [],
          projectIdList: [],
          doctorId: undefined,
          queryDoctorsLoading: false,
          likeDoctorList: [],
          settlementStatusList: { false: '未结算', true: '已结算' },
          settlementStatus: undefined,
          companyId: undefined,
          taskStatusList: TASK_STATUS_LIST,
          taskExportStatusList: { 1: '未导出', 2: '已导出' },
          taskStatus: undefined,
          taskExportStatus: undefined,
          settlementListData: [],
          auditTaskList: [],
          statisticsDesc: '',
          vendorList: [], // 集团列表（所属单位列表）
          settlementRuleList: [], // 政策类型列表
          editModalVisible: false, // 显示弹窗
          editItem: { taskId: '', doctorId: '' }, // 编辑的对象
          uploadAction: api.uploadSettlementUrl + `?accessToken=${window.localStorage.accessToken}`, // 上传地址
        }
      },
      filters: {
        filterTaskType(val) {
          return TASK_TYPE_LIST[val]
        },
        filterTaskStatus(val) {
          return TASK_STATUS_LIST[val]
        }
      },
      created() {
        // 查询筛选条件中的初始数据
        this.toQueryLikeTaskList()
        this.toQueryLikeProjectList()
        this.queryDoctorList()
        this.queryVendorList()
        this.querySettlementRuleList()
      },
      methods: {
        async querySettlementStatics() {
          const tempTaskId = +this.inputTaskId
          const tempTaskIdList = this.taskIdList.slice()
          const tempProjectId = +this.inputProjectId
          const tempProjectIdList = this.projectIdList.slice()
          if (!tempTaskId && !tempTaskIdList.length && !this.doctorId && !tempProjectId && !tempProjectIdList.length) return this.$message.warning('请输入任务ID、任务名称、医生名称、项目ID、项目名称中的至少一个条件')
          let [taskCount, doctorCount, nidusCount, maskCount, pointCount, completedSeriesCount, perimeterCount, hausdorffCount] = new Array(8).fill(0)
          tempTaskId && tempTaskIdList.push(tempTaskId)
          tempProjectId && tempProjectIdList.push(tempProjectId)
          const res = await api.querySettlementStatics({
            doctorId: this.doctorId,
            projectIdList: tempProjectIdList.length ? tempProjectIdList : undefined,
            taskIdList: tempTaskIdList.length ? tempTaskIdList : undefined,
            taskStatus: this.taskStatus,
            taskExportStatus: this.taskExportStatus,
            settlementStatus: this.settlementStatus,
            companyId: this.companyId
          })
          const originDataList = res.data || [] // 后端返回的原始列表是按项目聚合的大列表(项目中包含任务，任务中又包含医生)
          if (!originDataList.length) return this.settlementListData = []
          const settlementListData = []
          const tempSet = new Set() // 用来统计医生总数(去重)
          // 重新组装数据(树形结构(最外层是大的项目列表,每个项目又包含任务列表,每个任务又包含医生列表)改成平铺结构(只有一层,没有嵌套))和计算出整体的统计数据
          originDataList.slice().forEach(({ projectId, projectName, taskVoList: taskList = [] }, index1) => {
            const taskLen = taskList && taskList.length
            if (taskLen) {
              let tempCount = 0 // 用来统计每个项目下所有任务下的所有医生记录的总数
              taskCount += taskLen
              taskList.forEach((task, index2) => {
                const resultList = task.resultVoList || []
                const resultLen = resultList.length
                delete task.resultVoList
                if (resultLen) {
                  tempCount += resultLen
                  resultList.forEach((result, index3) => {
                    tempSet.add(result.doctorId)
                    nidusCount += result.totalImageNumber
                    maskCount += result.maskNumber
                    pointCount += result.pointNumber
                    completedSeriesCount += result.completedSeriesNumber
                    perimeterCount = Tool.plus(perimeterCount, result.perimeter).toFixed(2)
                    hausdorffCount = Tool.plus(hausdorffCount, result.hausdorff).toFixed(2)
                    settlementListData.push({
                      rowspan1: '-1', // 一个项目下的所有东西在合并行时(即该项目需要占多少行)，需要使用该项目对应的第一行数据来合并，非第一行的数据要忽略，初始值先都赋为'1'(表示该条数据不是某个项目下的第一条数据,待后续遍历完毕再将该项目下的第一条数据对应的rowspan1值替换成具体数值,因为在遍历过程中并不知道该项目下共有多少条数据)
                      rowspan2: index3 === 0 ? resultLen : '-1',
                      projectId,
                      projectName,
                      ...task,
                      ...result
                    })
                  })
                } else {
                  tempCount += 1
                  settlementListData.push({
                    rowspan1: '-1',
                    rowspan2: 1,
                    projectId,
                    projectName,
                    ...task
                  })
                }
              })
              settlementListData[settlementListData.length - tempCount].rowspan1 = tempCount
            } else {
              settlementListData.push({
                projectId,
                projectName
              })
            }
          })
          this.settlementListData = settlementListData
          doctorCount = tempSet.size
          this.statisticsDesc = `任务数：${taskCount}，医生总数：${doctorCount}，病灶数：${nidusCount}，mask病灶数：${maskCount}，方体病灶数：${pointCount}，提交有效序列数：${completedSeriesCount}，总周长：${perimeterCount}，总hausdorff值：${hausdorffCount}`
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          const { rowspan1, rowspan2 } = row
          if (typeof rowspan1 !== 'undefined' || typeof rowspan2 !== 'undefined') {
            if (columnIndex === 1 || columnIndex === 2) {
              if (rowspan1 === '-1') {
                return [0, 0]
              } else {
                return [rowspan1, 1]
              }
            } else if (columnIndex >= 3 && columnIndex <= 9) {
              if (rowspan2 === '-1') {
                return [0, 0]
              } else {
                return [rowspan2, 1]
              }
            }
          }
          return [1, 1]
        },
        checkSelectable({ settlementStatus }) {
          return typeof settlementStatus !== 'undefined' && settlementStatus !== true
        },
        handleSelectionChange(val) {
          this.selectedData = val
        },
        // 查询集团列表
        async queryVendorList() {
          const res = await commonApi.queryVendorList({})
          this.vendorList = res.data.list || []
        },

        // 查询政策类型列表
        async querySettlementRuleList() {
          const res = await commonApi.queryTypeEnumList({ key: 'SettlementRuleEnum' })
          this.settlementRuleList = res.data || []
        },

        async queryAuditTaskList(taskId, auditProjectNumber) {
          if (!auditProjectNumber) return
          const res = await api.queryAuditTaskList({
            noLoading: true
          }, {
            taskId
          })
          this.auditTaskList = res.data || []
        },
        // 计算周长为非0个数
        countPerimeterNotEqualsZeroNumber(row) {
          return row.perimeterIsEmptyNumber === 0 ? (row.completedSeriesNumber - row.perimeterEqualsZeroNumber) : '-'
        },

        exportSettlementStatics() {
          const finalSettlementListData = this.settlementListData.map((item) => {
            const { 
              projectId, 
              projectName, 
              id: taskId, 
              name: taskName, 
              type: taskType, 
              status: taskStatus, 
              studyNumber, 
              crossMarkNum, 
              exportStatus, 
              auditProjectNumber, 
              doctorId, 
              doctorName, 
              companyName, 
              settlementStatus, 
              completedSeriesNumber, 
              terminateSeriesNumber, 
              maskNumber, 
              pointNumber, 
              perimeter, 
              perimeterIsEmptyNumber, 
              hausdorff, 
              hausdorffIsEmptyNumber, 
              perimeterMultiplyDice, 
              diceIsEmptyNumber, 
              totalImageNumber, 
              imageResultEqualsZeroNumber, 
              perimeterEqualsZeroNumber, 
              gtEqIarCountSeriesCount, 
              ltIarCountSeriesCount, 
              auditFlowItemCount, 
              settlementInfoRuleList, 
              settlementAmount, 
              totalDice, 
              trueRate, 
              accuracyRate
            } = item;
            return {
              '项目ID': projectId,
              '项目名称': projectName,
              '任务ID': taskId,
              '任务名称': taskName,
              '任务类型': TASK_TYPE_LIST[taskType],
              '任务状态': TASK_STATUS_LIST[taskStatus],
              '序列总数': crossMarkNum ? `${studyNumber}*${crossMarkNum}` : studyNumber,
              '是否导出标注结果': exportStatus ? (exportStatus === 1 ? '未导出' : '已导出') : '—',
              '审核次数': auditProjectNumber,
              '医生ID': doctorId,
              '医生名称': doctorName,
              '集团名称': companyName,
              '结算状态': settlementStatus === true ? '已结算' : '未结算',
              '提交序列总数': (typeof terminateSeriesNumber === 'number' && typeof completedSeriesNumber === 'number') ? (terminateSeriesNumber + completedSeriesNumber) : '—',
              '有效提交序列数': completedSeriesNumber,
              '废片数': terminateSeriesNumber,
              'MASK数': maskNumber,
              '点位数': pointNumber,
              '总周长': perimeter,
              '无周长个数': perimeterIsEmptyNumber,
              '总hausdorff值': hausdorff,
              '无hausdorff个数': hausdorffIsEmptyNumber,
              '病灶数为0个数': imageResultEqualsZeroNumber,
              '周长为0个数': perimeterEqualsZeroNumber,
              '周长为非0个数': this.countPerimeterNotEqualsZeroNumber({perimeterIsEmptyNumber, completedSeriesNumber, perimeterEqualsZeroNumber}),
              'dice*周长总和': perimeterMultiplyDice,
              '无dice个数': diceIsEmptyNumber,
              '有效病灶数': totalImageNumber,
              '病灶数>=200序列数': gtEqIarCountSeriesCount,
              '病灶数<200序列数': ltIarCountSeriesCount,
              '审核流转次数': auditFlowItemCount,
              '结算政策': settlementInfoRuleList ? settlementInfoRuleList.map((v) => `${v.rule}(${v.price}-${v.accuracy})`).join('+') : '',
              '最终结算价': settlementAmount,
              '总dice': totalDice,
              '准确率': typeof trueRate === 'number' ? trueRate : '',
              '精确度': typeof accuracyRate === 'number' ? accuracyRate : ''
            }
          })
          finalSettlementListData.push({ '项目ID': this.statisticsDesc })
          const csvData = Papa.unparse(finalSettlementListData)
          Tool.exportCSVFile(csvData, '统计数据.csv')
        },
        singleSettlement(taskId, doctorId) {
          this.settleSettlement([{
            taskId,
            doctorId
          }])
        },
        batchSettlement() {
          const selectedData = this.selectedData
          if (!selectedData || !selectedData.length) return this.$message.warning('请先勾选要结算的记录')
          const toSettleRecords = selectedData.map(({ id, doctorId }) => {
            return {
              taskId: id,
              doctorId
            }
          })
          this.settleSettlement(toSettleRecords)
        },
        async settleSettlement(params) {
          await api.settleSettlement(params)
          this.$message.success('结算成功')
          this.$refs.settlementTable.clearSelection()
          this.querySettlementStatics()
        },
        // 查询任务名称查询条件
        async toQueryLikeTaskList({ value = '', page = 1, pageSize = 10 } = {}) {
          this.queryTasksLoading = true
          const res = await commonApi.taskNamePageSearch({
            noLoading: true,
            taskName: value,
            // projectType: 2, // projectType: 1是标注 2是审核 3是算法
            page,
            pageSize
          })
          this.likeTaskList = res.data
          this.queryTasksLoading = false
        },
        // 查询项目名称查询条件
        async toQueryLikeProjectList({ value = '', page = 1, pageSize = 10 } = {}) {
          this.queryProjectsLoading = true
          const res = await commonApi.projectNamePageSearch({
            noLoading: true,
            projectName: value,
            // projectType: 2, // projectType: 1是标注 2是审核 3是算法
            page,
            pageSize
          })
          this.likeProjectList = res.data
          this.queryProjectsLoading = false
        },
        toQueryLikeDoctorList: throttle(function(keyword) {
          this.queryDoctorsLoading = true
          this.queryDoctorList(keyword)
          this.queryDoctorsLoading = false
        }, 800),
        async queryDoctorList(keyword = '') {
          const res = await commonApi.queryDoctorList({
            noLoading: true,
            name: keyword
          })
          this.likeDoctorList = res.data
        },
        // 编辑
        edit(taskId, doctorId) {
          this.editModalVisible = true
          this.editItem = { taskId, doctorId }
        },

        // 编辑-成功回调
        handleAddSuccess() {
          this.editModalVisible = false
          this.editItem = { taskId: '', doctorId: '' }
          this.querySettlementStatics()
        },

        // 试算
        async trySettlment(taskId, userId) {
          const res = await api.trySettlement({ taskId, userId })
          const { settlementAmount, trueRate, accuracyRate } = res.data || {}
          this.$alert(`总价：<span style="color: #3AABA2">${settlementAmount}</span> 元、
                       准确率：<span style="color: #3AABA2">${trueRate}</span>、精确度：<span style="color: #3AABA2">${accuracyRate}</span>`, '试算结算结果', {
            dangerouslyUseHTMLString: true
          })
        },

        // 导入
        uploadSettlementStatics(taskId, userId) {
          // this.$refs.uploadFileBtn.$emit('click')
          this.$refs.uploadFileBtn.$el.click()
          // this.actionData = {
          //   accessToken: window.localStorage.accessToken
          // }
        },

        /********** 上传文件相关 ********/
        handleBeforeUpload(file) {
          let filePath = file.name
          if (!/.*\.csv$/.test(filePath)) {
            this.$message.error('请选择CSV文件导入')
            return false
          }
        },
        handleUploadSuccess(res) {
          if (res.code === 0) {
            this.$message.success('导入成功')
          } else {
            this.$message.error(res.msg || '导入失败，请重试')
          }
          this.$refs.uploadFile.clearFiles()
        },
        handleUploadError(err) {
          this.$message.success(err || '导入失败，请重试')
          this.$refs.uploadFile.clearFiles()
        }
        /********** End 上传文件相关 ********/
      }
    })
  }
}

module.exports = settlementstatics
