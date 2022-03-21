import './index.less'
import api from './api.js'
import FilterContainer from '@/components/filter-container'
import PopConfirm from '@/components/pop-confirm/index.vue'
import { seriesImgFileTypeList } from '@/api/common.api'
import commonApi from '@/api/common.api'
import TablePagination from '@/components/table-pagination'
import Add from './components/add'

class settlementconfig extends Interstellar.pagesBase {
  complete() {
    const self = this
    new Vue({
      el: '#settlementconfig',
      components: {
        FilterContainer,
        TablePagination,
        PopConfirm,
        Add
      },
      data() {
        return {
          listQuery: {
            page: 1,
            pageSize: 10,
          },
          settlementListData: {},
          addModalVisible: false, // 显示弹窗
          editId: null,

          sicknessTypeList: Tool.configxlkformat(self.app.constmap["SICKNESS_TYPE"]), // 项目标签
          projectFunctionList: Tool.configxlkformat(self.app.constmap["PROJECT_FUNCTION"]), // 项目目标
          seriesImgFileTypeList, // 数据类型列表
          vendorList: [], // 集团列表（所属单位列表）
          settlementRuleList: [], // 政策类型列表
          isAuditMap: { true: '是', false: '否' }
        }
      },
      mounted() {
        this.queryDataList()
        // 查询筛选条件中的初始数据
        this.queryVendorList()
        this.querySettlementRuleList()
      },
      methods: {
        // 查询列表
        async queryDataList(resetPage) {
          resetPage && (this.listQuery.page = 1)
          const res = await api.quereyPageList(this.listQuery)
          res.data.page = this.listQuery.page
          res.data.pageSize = this.listQuery.pageSize
          this.settlementListData = res.data
        },

        // 表格状态更新
        onChange(pagination, filtersArg, sorter) {
          const { pageNo, pageSize } = pagination
          this.listQuery.page = pageNo
          this.listQuery.pageSize = pageSize
          this.queryDataList()
        },

        resetForm() {
          // this.$refs.listQuery.resetFields()
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

        // 删除
        async remove(id) {
          const res = await api.delete({ id })
          this.$message.success('删除成功')
          this.queryDataList()
        },

        // 新增/编辑
        edit(id) {
          this.addModalVisible = true
          this.editId = id
        },

        handleAddSuccess() {
          this.addModalVisible = false
          this.queryDataList()
        },
        // 根据key值idx，获取list对应的值
        getSelectDataByKey(key, list) {
          const data = list.find(v => v.idx === key)
          return data ? data.val : ''
        }
      }
    })
  }
}

module.exports = settlementconfig
