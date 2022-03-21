<template>
  <div>
    <el-table
      ref="table"
      v-bind="$attrs"
      v-on="$listeners"
      class="el-table-input-wrapper"
      v-loading.lock="loading"
      :show-overflow-tooltip="showOverflowTooltip"
      :stripe="stripe"
      :data="tableData"
      :style="tableStyle"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <slot />
    </el-table>
    <div v-if="showPagination" class="el-pagination-wrapper" style="text-align: right;">
      <el-pagination
        :background="pageBackground"
        :small="pageSmall"
        :hide-on-single-page="hideOnSinglePage"
        :current-page="pagination.pageNo"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import props from './props'

export default {
  name: 'ElTablePagination',
  inheritAttrs: false,
  props,
  data() {
    const _this = this
    return {
      pagination: {
        pageNo: 1,
        pageSize: (() => {
          const { pageSizes } = _this
          return pageSizes.length ? pageSizes[0] : 20
        })()
      },
      filtersArg: {}, // 筛选
      sorter: {}, // 排序
      total: 0,
      loading: false,
      tableData: [],
      originTableData: []
    }
  },
  watch: {
    data: function(value) {
      // props中父组件传递过来的table数据，需要重新组装
      this.rebuildInitData(value)
    }
  },
  methods: {
    // 排序
    handleSortChange(args) {
      if (this.type === 'local') {
        this.emitEventHandler('sort-change', args)
      } else {
        this.sorter = args
        this.fetchHandler()
      }
    },
    // 过滤
    handleFilterChange(filters) {
      if (this.type === 'local') {
        this.emitEventHandler('filter-change', filters)
      } else {
        this.filtersArg = filters
        this.fetchHandler()
      }
    },
    // pageSize改变
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.dataChangeHandler()
    },
    // pageNo改变
    handleCurrentChange(pageNo) {
      this.pagination.pageNo = pageNo
      this.dataChangeHandler()
    },
    dataChangeHandler() {
      const { type } = this
      if (type === 'local') {
        this.dataFilterHandler(arguments[0])
      } else if (type === 'remote') {
        this.fetchHandler(arguments[0])
      }
    },
    dataFilter(data) {
      const { pageNo, pageSize } = this.pagination
      return data.filter((v, i) => {
        return i >= (pageNo - 1) * pageSize && i < pageNo * pageSize
      })
    },
    dataFilterHandler(formParams) {
      const { originTableData } = this
      this.total = originTableData.length
      this.tableData = this.dataFilter(originTableData)
    },
    fetchHandler(formParams = {}) {
      const { pagination, filtersArg, sorter } = this
      // this.onChange && this.onChange(pagination, filtersArg, sorter)
      this.$emit('onchange', pagination, filtersArg, sorter)
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    rebuildInitData(data) {
      const { type } = this
      if (!data) {
        this.showPagination = false
        throw new Error(`When the type is 'local', you must set attribute 'data' and 'data' must be a array.`)
      }
      const clonedListData = JSON.parse(JSON.stringify(data.list || []))
      this.originTableData = clonedListData

      const { page, pageSize, total } = data
      this.total = total
      this.pagination.pageNo = page
      this.pagination.pageSize = pageSize
      this.tableData = type === 'local' ? this.dataFilter(clonedListData) : data.list
    },
    // 将表格数据传递给父组件
    emitTableData() {
      this.$emit('emit-table-data', this.tableData)
    },
    selectRows(rows) {
      if (!rows || !rows.length) return
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
    },
    clearAllSelectedRows() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>
