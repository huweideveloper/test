import './index.less'
import api from '../api.js'
import commonApi from '@/api/common.api.js'
import FilterContainer from '@/components/filter-container'
import TablePagination from '@/components/table-pagination'
import SelectSearch from '@/components/select-search'
import SelectTablePage from '@/components/select-table-page'

class auditpro extends Interstellar.pagesBase {
  complete() {
    const self = this
    const MODULE_TYPE = 'auditproject'
    // 所有的权限常量声明
    const [CREATE, READ, START, STOP, EDIT, COPY, VIEW_SERIES, EXPORT] = ['CREATE', 'READ', 'START', 'STOP', 'EDIT', 'COPY', 'VIEW_SERIES', 'EXPORT']

    new Vue({
      el: `#${MODULE_TYPE}`,
      components: {
        FilterContainer,
        TablePagination,
        SelectSearch,
        SelectTablePage,
      },
      data() {
        return {
          // 条件筛选相关
          listQuery: {
            auditProjecId: null, // 审核项目Id
            importProjectId: null, // 所属项目Id
            status: null, // 状态类型
            groupId: null, // 项目群组
            clientType: null, // 项目类型
            sicknessType: null, // 项目标签
            projectFunction: null, // 项目目标
            projectTarget: null, // 项目用途
            page: 1,
            pageSize: 10,
          },
          // 下拉选项数据
          likeProjectListLoading: false,
          likeProjectList: [], // 查询审核项目下拉列表
          likeImportProjectListLoading: false,
          likeImportProjectList: [], // 查询所属项目名称下拉列表
          groupIdListLoading: false,
          groupIdList: [], // 查询项目群组下拉列表
          sicknessTypeList: Tool.configxlkformat(self.app.constmap["SICKNESS_TYPE"]), // 项目标签
          projectFunctionList: Tool.configxlkformat(self.app.constmap["PROJECT_FUNCTION"]), // 项目目标
          projectTargetList: Tool.configxlkformat(self.app.constmap["AUDIT_PROJECT_TARGET"]), // 项目用途

          likeProjectListPage: {},

          // 分页相关
          auditProjectList: {}, // 审核项目列表

          statusMap: { 1: '未启用', 2: '已启用' },
          clientTypeMap: { 1: 'B端项目', 2: 'C端项目' },
        }
      },
      created() {
        this.initPermissions()
        this.queryAuditProList()
        this.queryLikeProjectList()
        this.queryLikeImportProjectList()
        this.queryLikeGroupList()
      },
      methods: {
        initPermissions() {
          // 将模块所有的权限都赋值到data对应的字段，然后在页面上做权限判断
          const targetPermissionArr = [CREATE, READ, START, STOP, EDIT, COPY, VIEW_SERIES, EXPORT]
          targetPermissionArr.forEach((item) => {
            // 下划线转驼峰并且首字母大写
            const permission = `_${item.toLowerCase()}`.replace(/\_(\w)/g, ($0, $1) => $1.toUpperCase())
            this[`has${permission}Permission`] = self.checkPermission(MODULE_TYPE, item)
          })
        },

        // 查询列表
        async queryAuditProList(resetPage) {
          resetPage && (this.listQuery.page = 1)
          const res = await api.auditProjectSearch(this.listQuery)
          res.data.page = this.listQuery.page
          res.data.pageSize = this.listQuery.pageSize
          this.auditProjectList = res.data
        },

        // 表格状态更新
        onChange(pagination, filtersArg, sorter) {
          const { pageNo, pageSize } = pagination
          this.listQuery.page = pageNo
          this.listQuery.pageSize = pageSize
          this.queryAuditProList()
        },

        resetForm() {
          this.$refs.listQuery.resetFields()
        },

        // 查询审核项目下拉列表
        queryLikeProjectList(keyword = '') {
          this.likeProjectListLoading = true
          setTimeout(async () => {
            const res = await api.auditProjectNameSearch({
              noLoading: true,
              page: 1,
              pageSize: 10,
              auditProjectName: keyword,
            })
            this.likeProjectList = res.data.list
            this.likeProjectListLoading = false
          }, 500)
        },

        // 查询所属项目名称下拉列表
        queryLikeImportProjectList(keyword = '') {
          this.likeImportProjectListLoading = true
          setTimeout(async () => {
            const res = await api.projectNameSearch({
              noLoading: true,
              projectName: keyword
            })
            this.likeImportProjectList = res.data.list
            this.likeImportProjectListLoading = false
          }, 500)
        },

        // 查询项目群组下拉列表
        queryLikeGroupList(keyword = '') {
          this.groupIdListLoading = true
          setTimeout(async () => {
            const res = await commonApi.groupSearch({
              noLoading: true,
              page: 1,
              name: keyword,
            })
            this.groupIdList = res.data.list
            this.groupIdListLoading = false
          }, 500)
        },

        // 创建项目
        handleCreate(type) {
          self.app.changePage(type === 'C' ? 'createauditproc1' : 'createauditpro1', { type: 'new' })
        },

        // 查看详情
        handleViewDetail({ id, clientType }) {
          const opt = clientType === 2 ? 'createauditproc1' : 'createauditpro1'
          window.open(`${window.location.origin}/#!/${opt}/view/${id}`)
        },

        // 编辑 quotedByAuditTask 是否已开启
        handleEdit({ id, quotedByAuditTask, clientType }) {
          const opt = clientType === 2 ? 'createauditproc1' : 'createauditpro1'
          window.open(`${window.location.origin}/#!/${opt}/edit/${id}/${quotedByAuditTask ? 2 : 1}`)
        },

        // 复制
        handleCopy({ id }) {
          this.$confirm('确认复制吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await api.auditProjectClone({
              auditProjectId: id,
            })
            this.$message({ type: 'success', message: '复制成功!' })
            this.resetForm()
            this.queryAuditProList(true)
          })
        },

        // 启用
        async handleStart({ id }) {
          await api.auditProjectStatusUpdate({
            auditProjectId: id,
            status: 2,
          })
          this.$message({ type: 'success', message: '启用成功!' })
          this.resetForm()
          this.queryAuditProList()
        },

        // 暂停
        handleStop({ id }) {
          this.$confirm('确定暂停启用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await api.auditProjectStatusUpdate({
              auditProjectId: id,
              status: 1,
            })
            this.$message({ type: 'success', message: '暂停成功!' })
            this.resetForm()
            this.queryAuditProList()
          })
        },

        // 查阅审核结果
        handleViewSeries({ id }) {
          window.open(`${window.location.origin}/#!/viewauditres/${id}`, '_blank')
        },

        // 导出审核结果
        handleExport({ id }) {
          const obj = { projectId: id }
          const url = `${self.app.domain1}v1/audit/project/series/result/export?param=${encodeURIComponent(JSON.stringify(obj))}`
          this.HttpRequest.downLoadFile(url, {
            key: 'accessToken',
            val: this.app.local.get('accessToken'),
          })
        },

        handleAction({ type, data }) {
          const permissionHandlers = {
            [READ]: this.handleViewDetail,
            [EDIT]: this.handleEdit,
            [EXPORT]: this.handleExport,
            [START]: this.handleStart,
            [STOP]: this.handleStop,
            [VIEW_SERIES]: this.handleViewSeries,
            [COPY]: this.handleCopy,
          }
          permissionHandlers[type](data)
        },
        // 根据key值idx，获取list对应的值
        getSelectDataByKey(key, list) {
          const data = list.find(v => v.idx === key)
          return data ? data.val : ''
        }
      },
    })
  }
}

module.exports = auditpro
