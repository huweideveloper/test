import './index.less'
import commonApi from '@/api/common.api.js'
import api from './api.js'
import FilterContainer from '@/components/filter-container'
import SelectSearch from '@/components/select-search'
import SelectTablePage from '@/components/select-table-page'
import { throttle } from 'lodash'
import XLSX from 'xlsx'

class pathologystatistics extends Interstellar.pagesBase {
  complete() {
    new Vue({
      el: '#pathologystatistics',
      components: {
        FilterContainer,
        SelectSearch,
        SelectTablePage,
      },
      data() {
        const self = this
        return {
          inputTaskId: '',
          queryTasksLoading: false,
          likeTaskList: [],
          taskIdList: [],
          inputProjectId: '',
          queryProjectsLoading: false,
          likeProjectList: [],
          projectIdList: [],
          userIdList: [],
          queryDoctorsLoading: false,
          likeDoctorList: [],
          beginSubmitTime: '',
          endSubmitTime: '',

          startTimeOptions: {
            disabledDate(curDate) {
              if (!self.endSubmitTime) return false
              return curDate.getTime() > new Date(self.endSubmitTime).getTime()
            }
          },
          endTimeOptions: {
            disabledDate(curDate) {
              if (!self.beginSubmitTime) return false
              return curDate.getTime() < new Date(self.beginSubmitTime).getTime()
            }
          },

          pathologyListData: []
        }
      },
      created() {
        // 查询筛选条件中的初始数据
        this.toQueryLikeTaskList()
        this.toQueryLikeProjectList()
        this.queryDoctorList()
      },
      methods: {
        async queryPathologystatistics() {
          const tempTaskId = +this.inputTaskId
          const tempTaskIdList = this.taskIdList.slice()
          const tempProjectId = +this.inputProjectId
          const tempProjectIdList = this.projectIdList.slice()
          if (!tempTaskId && !tempTaskIdList.length && !this.userIdList.length && !tempProjectId && !tempProjectIdList.length && !this.beginSubmitTime && !this.endSubmitTime) {
            this.$message.warning('请输入至少一个查询条件')
            return false
          }

          tempTaskId && tempTaskIdList.push(tempTaskId)
          tempProjectId && tempProjectIdList.push(tempProjectId)
          const { userIdList, beginSubmitTime, endSubmitTime } = this
          const res = await api.queryPathologyStatistics({
            projectIdList: tempProjectIdList.length ? tempProjectIdList : undefined,
            taskIdList: tempTaskIdList.length ? tempTaskIdList : undefined,
            userIdList: userIdList.length ? userIdList : undefined,
            beginSubmitTime: beginSubmitTime || undefined,
            endSubmitTime: endSubmitTime || undefined
          })
          const dataList = res.data.list || [] // 后端返回的原始列表是按项目聚合的大列表(项目中包含任务，任务中又包含医生)

          // 格式化表格按照项目任务分组显示
          this.pathologyListData = this.formatTableData(dataList)
          return true
        },

        // 重新组装数据(树形结构(最外层是大的项目列表,每个项目又包含任务列表,每个任务又包含医生列表)改成平铺结构(只有一层,没有嵌套))和计算出整体的统计数据
        formatTableData(dataList) {
          if (!dataList.length) return []
          const pathologyListData = []
          const summaryList = dataList.filter(v => v.type === 1) // 汇总的数据
          const commonList = dataList.filter(v => v.type !== 1)  // 非汇总的数据
          commonList.sort((v1, v2) => {
            return v1.parojectId === v2.projectId ? (v2.taskId - v1.taskId) : (v2.projectId - v1.projectId)
          })
          let [c_projectId, c_taskId, fst_pro_idx, fst_task_idx, pro_rows, task_rows] = ['', '', 0, 0, 0, 0]

          // 拆分分类数组数据变成一行数据
          const toRowIarStatisticsList = function(data) {
            const { iarStatisticsList, ...rest } = data
            iarStatisticsList.forEach((iar, i) => {
              const row = { ...rest, ...iar }
              // 设置当前用户的rowspan
              i === 0 && (row.rowspan3 = iarStatisticsList.length)
              pathologyListData.push(row)
              pro_rows++
              task_rows++
            })
          }

          commonList.forEach((data, index1) => {
            const { projectId, taskId } = data
            // 到下一个任务
            if (c_taskId !== taskId) {
              // 相同任务下的数据加完，添加统计的数据
              const preSummaryData = summaryList.find(v => v.taskId === c_taskId)
              preSummaryData && toRowIarStatisticsList(preSummaryData)
              // 更新当前任务的rowspan
              c_taskId !== '' && pathologyListData[fst_task_idx] && (pathologyListData[fst_task_idx].rowspan2 = task_rows)
              // 重置任务统计
              c_taskId = taskId
              fst_task_idx = pathologyListData.length === 0 ? 0 : pathologyListData.length
              task_rows = 0
            }

            // 到下一个项目
            if (c_projectId !== projectId) {
              // 更新当前项目的rowspan
              c_projectId !== '' && pathologyListData[fst_pro_idx] && (pathologyListData[fst_pro_idx].rowspan1 = pro_rows)
              // 重置项目统计
              c_projectId = projectId
              fst_pro_idx = pathologyListData.length === 0 ? 0 : pathologyListData.length
              pro_rows = 0
            }


            // 平铺类型到行
            toRowIarStatisticsList(data)

            // 到最后一条数据
            if (index1 === commonList.length - 1) {
              // 相同任务下的数据加完，添加统计的数据
              const preSummaryData = summaryList.find(v => v.taskId === c_taskId)
              preSummaryData && toRowIarStatisticsList(preSummaryData)
              // 更新当前任务的rowspan
              c_taskId !== '' && pathologyListData[fst_task_idx] && (pathologyListData[fst_task_idx].rowspan2 = task_rows)

              // 更新当前项目的rowspan
              pathologyListData[fst_pro_idx] && (pathologyListData[fst_pro_idx].rowspan1 = pro_rows)
            }
          })
          return pathologyListData
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          const { rowspan1, rowspan2, rowspan3 } = row
          if (columnIndex < 2) {
            return rowspan1 > 0 ? [rowspan1, 1] : [0, 0]
          } else if (columnIndex >= 2 && columnIndex < 4) {
            return rowspan2 > 0 ? [rowspan2, 1] : [0, 0]
          } else if (columnIndex >= 4 && columnIndex < 8) {
            return rowspan3 > 0 ? [rowspan3, 1] : [0, 0]
          } else {
            return [1, 1]
          }
        },

        // 导出文档
        async exportPathologystatistics() {
          // 重新获取数据
          const res = await this.queryPathologystatistics()
          if (!res) return

          // 构造下载数据
          const finalData = []
          if (!this.pathologyListData || !this.pathologyListData.length) {
            finalData.push({
              '项目ID': '',
              '项目名称': '',
              '任务号': '',
              '任务名称': '',
              '用户姓名': '',
              '用户手机号': '',
              '有效序列数': '',
              '废片序列数': '',
              '细胞类型': '',
              '标注（审核）数量': '',
              '金标数量': ''
            })
          } else {
            this.pathologyListData.forEach(v => {
              finalData.push({
                '项目ID': v.projectId,
                '项目名称': v.projectName,
                '任务号': v.taskId,
                '任务名称': v.taskName,
                '用户姓名': v.userName,
                '用户手机号': v.mobile,
                '有效序列数': v.submitSeriesNum,
                '废片序列数': v.discardSeriesNum,
                '细胞类型': v.imageName,
                '标注（审核）数量': v.iarNum,
                '金标数量': v.goldNum
              })
            })
          }
          const sheets = { '病理统计结果': XLSX.utils.json_to_sheet(finalData) }
          const blob = Tool.sheet2blob(sheets)
          Tool.openDownloadDialog(blob, `病理统计.xlsx`)
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
        // 查询项目名称下拉列表
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
        }
      }
    })
  }
}

module.exports = pathologystatistics
