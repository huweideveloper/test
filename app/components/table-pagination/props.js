const props = {
  tableStyle: {
    type: String,
    default: ''
  },
  /**
   * 类型 当翻页，过滤，排序时，'remote': 从后端取数据 'local': 对当前数据操作
   */
  type: {
    type: String,
    default: 'remote',
    validator(value) {
      const types = ['remote', 'local']
      const validType = types.indexOf(value) !== -1
      if (!validType) {
        throw new Error(`Invalid type of '${value}', please set one type of 'remote' or 'local'.`)
      }
      return validType
    }
  },
  /**
   * 表格数据对象
   * data: {
   *    page: 1,
   *    pageSize: 10,
   *    total: 45,
   *    list: []
   * }
   */
  data: {
    type: Object
  },
  /**
   * 当pagination, filter, sorter发生变化时触发
   * @ pagination 分页信息
   * @ filtersArg 过滤信息
   * @ sorter 排序信息
   */
  onChange: {
    type: Function
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  },
  pageSizes: {
    type: Array,
    default: () => {
      return [10, 20, 50, 100]
    }
  },
  paginationLayout: {
    type: String,
    default: 'total, prev, pager, next, jumper, sizes'
  },
  pageBackground: {
    type: Boolean,
    default: true
  },
  pageSmall: {
    type: Boolean,
    default: false
  },
  // 当只有一页时隐藏分页
  hideOnSinglePage: {
    type: Boolean,
    default: false
  },
  stripe: {
    type: Boolean,
    default: true
  },
  showOverflowTooltip: {
    type: Boolean,
    default: true
  }
}

export default props
