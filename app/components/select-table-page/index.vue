<template>
  <el-select
    ref="selectTableRef"
    :class=" className + '  select-table-page-wrapper'"
    popper-class="select-table-page-popper"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="selectValue"
    :filter-method="handleFilterMethod"
    :multiple="multiple"
    @input.native="handleInput"
    @focus="handleFocus"
    :collapse-tags="collapseTags"
    filterable
    clearable
    reserve-keyword
    default-first-option
    :disabled="disabled"
    :placeholder="placeholder"
  >
    <div v-if="multiple">
      <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate" class="check-all" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <div class="options-wrapper">
      <el-option v-for="item in data.list" :key="item[keyName]" :label="item[valueName]" :value="item[keyName]"></el-option>
    </div>
    <el-pagination
      class="pagination-wrapper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      hide-on-single-page
      :current-page.sync="page"
      :page-size="pageSize"
      :total="data.total"
    ></el-pagination>
  </el-select>
</template>

<script>
import TablePagination from '@/components/table-pagination'
export default {
  inheritAttrs: false,
  components: {
    TablePagination
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    remoteMethod: {
      type: Function,
      default: () => { }
    },
    /**
     * 表格数据对象
     * data: {
     *  list: [], // 列表数据
     *  total: 32,
     *  page: 1,
     *  pageSize: 10
     * }
     */
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    // 类型 当翻页，过滤，排序时，'remote': 从后端取数据 'local': 对当前数据操作
    type: {
      type: String,
      default: 'local'
    },
    // key的值，用于赋值给v-model的的属性
    keyName: {
      type: String
    },
    // option的label值，用于显示的属性
    valueName: {
      type: String
    },
    multiple: Boolean
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      selectValue: this.value,
      keyword: '',
      allChecked: false
    }
  },
  computed: {
    // 是否是全选和全不选的状态，部分选返回true，否则false
    isIndeterminate() {
      const curOptions = this.data.list || []
      const allSelects = this.selectValue || []
      let [isAllSelected, curListSelects] = [true, 0] // 是否全选, 当前列表选择的项目数
      for (let i = 0; i < curOptions.length; i++) {
        const val = curOptions[i][this.keyName]
        const isSelect = allSelects.some(v => v === val) // 是否选中
        isSelect && curListSelects++
        !isSelect && (isAllSelected = false)
        if (curListSelects > 0 && !isAllSelected) break
      }
      this.allChecked = isAllSelected
      return curListSelects > 0 && !isAllSelected
    }
  },
  watch: {
    selectValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    // 全选
    handleCheckAllChange(checked) {
      const listKeys = this.data.list.map(v => v[this.keyName])
      const selKeys = this.selectValue.slice()
      checked && (this.selectValue = Array.from(new Set([...selKeys, ...listKeys]))) // 去除数组重复元素
      !checked && (this.selectValue = selKeys.filter(v => !listKeys.includes(v)))
    },
    // pageSize改变
    handleSizeChange(size) {
      this.pageSize = size
      this.dataChangeHandler()
    },
    // page改变
    handleCurrentChange(page) {
      this.page = page
      this.dataChangeHandler()
    },
    handleFocus(e) {
      const val = e.target.value
      // focus时输入框为空，之前的keyword不为空时，重新查询下拉列表的值
      if (!val && this.keyword) {
        this.handleFilterMethod('')
      }
    },
    dataChangeHandler() {
      this.queryRemoteList()
      // TODO 支持local
      // const { type } = this
      // if (type === 'local') {
      //   // this.dataFilterHandler(arguments[0])
      // } else if (type === 'remote') {
      //   this.queryRemoteList()
      // }
    },
    handleFilterMethod(val) {
      this.page = 1
      this.keyword = val
      this.queryRemoteList()
    },

    queryRemoteList() {
      const { page, pageSize } = this
      this.remoteMethod && this.remoteMethod({ value: this.keyword, page, pageSize })
    },

    handleInput(e) {
      // 当操作只触发input，却无keyup操作时执行。==实际场景是微软输入法，中文通过数字键选择输入文字时，只触发input，不触发keyup事件
      // debounce所以不会触发相同的查询2次
      this.$refs.selectTableRef.debouncedQueryChange(e)
    },
    setValue(value){
      this.selectValue = value;
    }
  }
}
</script>

<style lang="less">
.select-table-page-wrapper {
  padding: 0;
  border-radius: 4px;
  border: 0;
  // min-width: 300px;
  .select-table-input {
    min-width: 300px;
  }
}
.select-table-page-popper {
  &.el-select-dropdown {
    .check-all {
      padding-left: 20px;
    }
    .el-select-dropdown__wrap {
      max-height: unset;
    }
    .el-select-dropdown__list {
      display: flex;
      flex-direction: column;
      .options-wrapper {
        max-height: 340px;
        overflow-y: auto;
      }
      .pagination-wrapper {
        width: 100%;
        height: 32px;
        background: #fff;
        margin-top: 0;
        .el-pager li {
          min-width: 27.5px;
        }
      }
    }
  }
}

.filterarea {
  .select-table-page-wrapper {
    min-width: 360px;
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
    .el-input__icon {
      line-height: 34px;
    }
    .el-input__inner::-webkit-input-placeholder {
      font-size: 12px;
      color: rgb(117, 117, 117);
    }
  }
}
</style>
