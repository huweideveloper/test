import './index.less'
import api from '../api.js'
import FilterContainer from '@/components/filter-container'
import TablePagination from '@/components/table-pagination'
import SelectSearch from '@/components/select-search'

class audittask extends Interstellar.pagesBase {
  complete() {
    const self = this
    const MODULE_TYPE = 'audittask'
    // 所有的权限常量声明
    const [CREATE, READ, EDIT, EDIT_INFO, EXPORT, START, VIEW_SERIES, COPY, END] = ['CREATE', 'READ', 'EDIT', 'EDIT_INFO', 'EXPORT', 'START', 'VIEW_SERIES', 'COPY', 'END']

    new Vue({
      el: `#${MODULE_TYPE}`,
      components: {
        FilterContainer,
        TablePagination,
        SelectSearch
      },
      data() {
        return {
          // 条件筛选相关
          inputTaskId: '', // 输入框输入的taskId值
          taskIdList: [], // 下拉选择的任务(可多选)
          likeTaskList: [], // 根据审核任务名称模糊查询得到的任务list
          queryTasksLoading: false,
          projectIdList: [], // 下拉选择的项目(可多选)
          likeProjectList: [], // 根据审核项目名称模糊查询得到的项目list
          queryProjectsLoading: false,
          auditTaskType: undefined, // 选择的审核任务类型
          sicknessType: null, // 项目标签
          projectFunction: null, // 项目目标
          projectTarget: null, // 项目用途
          // 分页相关
          auditTaskList: {}, // 审核任务列表
          page: 1, // 是从第一页开始
          pageSize: 10,

          sicknessTypeList: Tool.configxlkformat(self.app.constmap["SICKNESS_TYPE"]), // 项目标签
          projectFunctionList: Tool.configxlkformat(self.app.constmap["PROJECT_FUNCTION"]), // 项目目标
          projectTargetList: Tool.configxlkformat(self.app.constmap["AUDIT_PROJECT_TARGET"]), // 项目用途
        }
      },
      filters: {
        auditTaskStatusFilter(status) {
          const allStatusTextArr = ['待发布', '进行中', '已完成', '已终结']
          return allStatusTextArr[status - 1]
        }
      },
      async created() {
        this.auditTaskTypeList = { 1: 'B端审核任务', 2: 'C端审核任务' }
        this.initPermissions()
        this.queryAuditTaskList(true)
        this.queryLikeTaskList()
        this.queryLikeProjectList()
      },
      mounted() { },
      methods: {
        initPermissions() {
          // 将模块所有的权限都赋值到data对应的字段，然后在页面上做权限判断
          const targetPermissionArr = [CREATE, READ, EDIT, EDIT_INFO, EXPORT, START, VIEW_SERIES, COPY, END]
          targetPermissionArr.forEach(item => {
            // 下划线转驼峰并且首字母大写
            const permission = `_${item.toLowerCase()}`.replace(/\_(\w)/g, ($0, $1) => $1.toUpperCase())
            this[`has${permission}Permission`] = self.checkPermission(MODULE_TYPE, item)
          })
        },
        async queryAuditTaskList(resetPage) {
          resetPage && (this.page = 1)
          const taskIdList = this.taskIdList.slice()
          !!this.inputTaskId && taskIdList.push(+this.inputTaskId)
          const res = await api.queryAuditTaskList({
            page: this.page,
            pageSize: this.pageSize,
            isReleased: true,
            taskIdList,
            projectIdList: this.projectIdList,
            clientType: this.auditTaskType,
            sicknessType: this.sicknessType, // 项目标签
            projectFunction: this.projectFunction, // 项目目标
            projectTarget: this.projectTarget, // 项目用途
          })
          res.data.page = this.page
          res.data.pageSize = this.pageSize
          this.auditTaskList = res.data
        },
        // 表格状态更新
        onChange(pagination, filtersArg, sorter) {
          const { pageNo, pageSize } = pagination
          this.page = pageNo
          this.pageSize = pageSize
          this.queryAuditTaskList()
        },
        toQueryLikeTaskList(keyword) {
          this.queryTasksLoading = true
          setTimeout(() => {
            this.queryLikeTaskList(keyword)
            this.queryTasksLoading = false
          }, 500)
        },
        async queryLikeTaskList(keyword = '') {
          const res = await api.queryLikeTaskList({
            noLoading: true,
            type: 2,
            taskNameKey: keyword
          })
          this.likeTaskList = res.data.list
        },
        toQueryLikeProjectList(keyword) {
          this.queryProjectsLoading = true
          setTimeout(() => {
            this.queryLikeProjectList(keyword)
            this.queryProjectsLoading = false
          }, 500)
        },
        async queryLikeProjectList(keyword = '') {
          const res = await api.queryLikeProjectList({
            noLoading: true,
            auditProjectName: keyword
          })
          this.likeProjectList = res.data.list
        },
        handleCreate(type) {
          self.app.changePage(type === 'C' ? 'createaudittaskc1' : 'createaudittask1', { type: 'new' })
        },
        handleCopy({ taskId }) {
          this.$confirm('确认复制吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await api.cloneAuditTask({
              taskId
            })
            this.$message.success('任务复制成功')
            this.queryAuditTaskList(true)
          })
        },
        // C端复制
        handleCopyClone({ taskId }) {
          this.$confirm('确认复制吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await api.cloneCopyClone(null, {
              taskId
            })
            this.$message.success('复制成功')
            this.queryAuditTaskList(true)
          })
        },
        handleViewDetail({ taskId, projectId, status, clientType }) {
          const opt = clientType === 2 ? 'createaudittaskc1' : 'createaudittask1'
          window.open(`${window.location.origin}/#!/${opt}/view/${taskId}/${projectId}/${status}`)
        },
        handleTerminate({ taskId }) {
          this.$confirm('是否确定要终结任务，一旦终结外部医生的任务即结束，本次任务也无法再次发布。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await api.terminateTask({
              taskId
            })
            this.$message.success('任务终结成功')
            this.queryAuditTaskList()
          })
        },
        handleEdit({ taskId, projectId, status, clientType }) {
          const opt = clientType === 2 ? 'createaudittaskc1' : 'createaudittask1'
          window.open(`${window.location.origin}/#!/${opt}/edit/${taskId}/${projectId}/${status}`)
        },
        handleEditInfo({ taskId, projectId, status, clientType }) {
          const opt = clientType === 2 ? 'createaudittaskc1' : 'createaudittask1'
          window.open(`${window.location.origin}/#!/${opt}/edit/${taskId}/${projectId}/${status}`)
        },
        async handleStart({ taskId, clientType }) {
          const params = {
            id: taskId,
            submitTime: Date.now()
          }
          if (clientType === 2) {
            // C端开启任务
            await api.startAuditTaskC(params)
            this.$message.success('任务开启成功')
            this.page = 1
            this.queryAuditTaskList()
          } else {
            const res = await api.queryInfoPreStartAuditTask(params)
            const { status, seriesNum } = res.data
            const msgArr = ['正在计算可审核的序列数量，请等待计算结果', `是否确定开始任务，本次任务的需要审核的序列数量为${seriesNum}个，一旦开始序列数量即为锁定。`, '计算失败']
            const msg = msgArr[status - 1]
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              if (status === 2) {
                await api.startAuditTask({
                  id: taskId
                })
                this.$message.success('任务开启成功')
                this.page = 1
                this.queryAuditTaskList()
              }
            })
          }
        },
        handleViewSeries({ taskId, clientType }) {
          self.app.changePage(clientType === 2 ? 'viewaudittaskc' : 'viewaudittask', { id: taskId, clientType })
        },
        handleExport({ taskId }) {
          const obj = {
            taskId
          }
          const url = `${self.app.domain1}v1/audit/task/series/result/export?param=${encodeURIComponent(JSON.stringify(obj))}`
          self.api.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: self.app.local.get('accessToken')
          })
        },
        // 根据key值idx，获取list对应的值
        getSelectDataByKey(key, list) {
          const data = list.find(v => v.idx === key)
          return data ? data.val : ''
        },
        // 下载
        handleDownload({ projectId }) {
          const url = `${window.location.origin}/aaa/v1/alg/preprocess/result/export?projectId=${projectId}`
          self.api.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: self.app.local.get('accessToken')
          })
        },
        handleAction({ type, data = {} }) {
          const { id: taskId, projectId, status, clientType } = data
          const permissionHandlers = {
            [READ]: this.handleViewDetail,
            [EDIT]: this.handleEdit,
            [EDIT_INFO]: this.handleEditInfo,
            [EXPORT]: this.handleExport,
            [START]: this.handleStart,
            [VIEW_SERIES]: this.handleViewSeries,
            [COPY]: this.handleCopy,
            [END]: this.handleTerminate,
            'COPYCLONE': this.handleCopyClone,
            'DOWNLOAD': this.handleDownload
          }
          permissionHandlers[type]({ taskId, projectId, status, clientType })
        }
      }
    })
  }
}

module.exports = audittask
