import './index.less'
import api from '../api.js'
import FilterContainer from '@/components/filter-container'
import TablePagination from '@/components/table-pagination'

class viewaudittaskc extends Interstellar.pagesBase {
  complete() {
    const self = this
    const app = this.app
    this.styleModel(1)
    const {id, clientType} = app.parpam // 类型

    new Vue({
      el: '#viewaudittaskc',
      components: {
        FilterContainer,
        TablePagination
      },
      data() {
        return {
          app,
          id,
          clientType: Number(clientType),
          auditTaskForm: {},
          userInfo: {}, // 当前用户信息
          userlist: [], // 用户列表
          listQuery: {
            serialNumber: '', // 查询序列
            page: 1, // 是从第一页开始
            pageSize: 10
          },
          auditTaskUserSeriesList: {}, // 用户序列列表
          auditChooseMap: {1: '一致部分', 2: '不一致部分', 3: '全集'},
          clusterTypeMap: {1: '序列征象', 2: '影像标注', 3: '阴阳性'},
          joinAuditProjectStatusMap: {0: '合并结果', 1: '合并中', 2: '合并完成', 3: '合并结果'}
        }
      },
      mounted() {
        this.queryAuditTaskDetail()
        this.queryAuditTaskUserList()
      },
      filters: {
        filterAuditStatus(val) {
          if (typeof val === 'number') {
            const auditStatusList = ['待审核', '', '审核通过', '审核未通过'] //（0-待审核，2-审核通过，3-审核未通过）
            return auditStatusList[val]
          }
        }
      },
      methods: {
        goBack() {
          this.app.changePage('audittask')
        },
        // 获取审核任务详情信息
        async queryAuditTaskDetail() {
          if (!this.id) return
          const res = await api.queryAuditTaskDetail({
            id: this.id
          })
          const auditTaskDetail = res.data || {}
          this.auditTaskForm = auditTaskDetail
          const {auditType} = auditTaskDetail
          this.auditType = auditType
        },

        // 获取用户列表
        async queryAuditTaskUserList() {
          if (!this.id) return
          const res = await api.auditTaskUserList({
            id: this.id
          })
          const list = res.data.userList || []
          this.userlist = list

          // 查询第一个用户的列表数据
          this.userInfo = list.length ? list[0] : {}
          list.length && this.handleClickUser(list[0])
        },

        // 点击用户
        handleClickUser(user) {
          this.userInfo = user
          this.listQuery.serialNumber = ''
          this.queryAuditTaskUserSeriesList(true)
        },

        // 获取用户序列数据
        async queryAuditTaskUserSeriesList(resetPage) {
          resetPage && (this.listQuery.page = 1)
          const res = await api.auditTaskUserSeriesSearch({
            id: this.id,
            userId: this.userInfo.id,
            reset: true,
            ...this.listQuery
          })
          res.data.page = this.listQuery.page
          res.data.pageSize = this.listQuery.pageSize
          this.auditTaskUserSeriesList = res.data || {}
        },

        // 表格状态更新
        onChange(pagination, filtersArg, sorter) {
          const {pageNo, pageSize} = pagination
          this.listQuery.page = pageNo
          this.listQuery.pageSize = pageSize
          this.queryAuditTaskUserSeriesList()
        },

        // 查看所有审核结果
        handleShowAllResultPage() {
          const {largeFigure, seriesImgFileType, projectId} = this.auditTaskForm
          const taskId = Number(this.id)
          if (this.clientType === 1) {
            // 跳转B端
            this.app.changePage(largeFigure ? 'drapCanvasAud' : 'markauditview', {
              taskId,
              taskInfo: this.auditTaskUserSeriesList.total + '$$0',
              type: 'check_viewer_all',
              uid: this.userInfo.id
            })
          } else {
            // 跳转到C端  auditType：2-Mask单审 3-Mask双审 4-命名双审 7-mpr双审 8-冠脉斑块双审
            const {auditType} = this
            Tool.goToC(this.app, {
              seriesImgFileType,
              type: [2, 3, 4, 7, 8].includes(auditType) ? ([3, 4, 7, 8].includes(auditType) ? 17 : 13) : 9, // 13是mask审核/冠脉分割审核(或者叫单点追踪审核)管理员查看(所有)
              taskId,
              userId: this.userInfo.id,
              // serialNumber: id.split("$$")[0],
              projectId
            })
          }
        },

        // 查看详情
        handleViewDetail(id) {
          const {largeFigure, seriesImgFileType, projectId} = this.auditTaskForm
          const taskId = Number(this.id)
          if (this.clientType === 1) {
            // 跳转B端
            this.app.changePage(largeFigure ? 'drapCanvasAud' : 'markauditview', {
              taskId,
              taskInfo: id,
              type: 'check_viewer'
            })
          } else {
            // 跳转到C端  auditType：2-Mask单审 3-Mask双审 4-命名双审 7-mpr双审 8-冠脉斑块双审
            const {auditType} = this
            Tool.goToC(this.app, {
              seriesImgFileType,
              type: [2, 3, 4, 7, 8].includes(auditType) ? ([3, 4, 7, 8].includes(auditType) ? 16 : 12) : 8, // 12是mask审核/冠脉分割审核(或者叫单点追踪审核)单个查看
              taskId,
              userId: this.userInfo.id,
              serialNumber: id.split('$$')[0],
              projectId
            })
          }
        },

        // 合并结果
        async handleJoin() {
          const {joinAuditProjectStatus} = this.auditTaskForm
          if (![0, 3].includes(joinAuditProjectStatus)) return
          const res = await api.seriesResultTaskJoin({taskId: this.id})
          this.$message.success('操作成功')
          this.queryAuditTaskDetail()
        }
      }
    })
  }
}

module.exports = viewaudittaskc
