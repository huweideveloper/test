import './index.less'
import api from './api.js'
import commonApi from '@/api/common.api.js'
import FilterContainer from '@/components/filter-container'
import TablePagination from '@/components/table-pagination'
import AddDoc from './components/add-doc'
import DocPreview from '@/components/doc-preview/index.vue'
import PopConfirm from '@/components/pop-confirm/index.vue'

class DocumentUpload extends Interstellar.pagesBase {
  complete() {
    const self = this
    const MODULE_TYPE = 'documentupload'
    // 所有的权限常量声明
    const [CREATE, READ, START, STOP, EDIT, COPY, VIEW_SERIES, EXPORT] = ['CREATE', 'READ', 'START', 'STOP', 'EDIT', 'COPY', 'VIEW_SERIES', 'EXPORT']

    new Vue({
      el: `#${MODULE_TYPE}`,
      components: {
        FilterContainer,
        TablePagination,
        AddDoc,
        DocPreview,
        PopConfirm
      },
      data() {
        return {
          // 条件筛选相关
          listQuery: {
            bizType: 'PATHOLOGY_PROJECT', // 固定的
            bizName: '', // 文件名称或者文件业务名称
            page: 1,
            pageSize: 10,
          },
          visibleAddModal: false,
          editDoc: {},

          visibleDocPreview: false, // 显示查看文档
          docPreviewUrl: '',  // 文档地址

          // 分页相关
          documentList: {}, // 列表
        }
      },
      created() {
        this.initPermissions()
        this.queryDocumentList()
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
        async queryDocumentList(resetPage) {
          resetPage && (this.listQuery.page = 1)
          const res = await api.queryFileListPage(this.listQuery)
          res.data.page = this.listQuery.page
          res.data.pageSize = this.listQuery.pageSize
          this.documentList = res.data
        },

        // 表格状态更新
        onChange(pagination, filtersArg, sorter) {
          const { pageNo, pageSize } = pagination
          this.listQuery.page = pageNo
          this.listQuery.pageSize = pageSize
          this.queryDocumentList()
        },

        resetForm() {
          this.$refs.listQuery.resetFields()
        },

        // 创建项目
        handleAdd(doc) {
          this.visibleAddModal = true
          this.editDoc = doc || {}
        },
        handleSaveDocSuccess() {
          this.hideAddDoc()
          this.queryDocumentList()
        },
        hideAddDoc() {
          this.visibleAddModal = false
          this.editDoc = {}
        },

        // 查看文档
        handlePreviewDoc(name, url) {
          const isPdf = /.*\.(pdf)$/.test(name.toLocaleLowerCase())
          this.docPreviewUrl = isPdf ? this.getDownloadUrl(name, url) : url
          this.visibleDocPreview = true
        },

        // 因为pdf不能直接通过urlWan访问，所有重新调用接口处理流信息
        getDownloadUrl(name, url) {
          return `${api.fileDownloadUrl()}?fileName=${name}&fileUrl=${encodeURIComponent(url)}&accessToken=${window.localStorage.accessToken}`
        },

        // 删除
        async handleDelete(id) {
          const res = await api.deleteBizFileById({ id })
          this.queryDocumentList()
          this.$message.success('删除成功')
        }
      }
    })
  }
}

module.exports = DocumentUpload
