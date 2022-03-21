<template>
  <el-dialog custom-class="component-list-wrapper" :visible.sync="visible" :close-on-click-modal="false" :show-close="false">
    <div slot="title">
      <span style="font-size: 16px">选择标注组件</span>
      (<span style="color: red;font-size: 12px">已添加的额外征象可在父页面删除</span>)
    </div>
    <el-row style="margin-bottom: 12px">
      <el-col :span="6">
        <el-input v-model.trim="markFieldName" placeholder="请输入标注字段名称" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-input v-model.trim="tag" placeholder="请输入标签关键字" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="componentType" placeholder="请选择控件类型" clearable>
          <el-option v-for="(name, value) in componentTypeList" :key="value" :label="name" :value="value"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="6" style="text-align: center">
        <el-button type="primary" size="medium" @click="queryComponentList">查询</el-button>
      </el-col>
    </el-row>
    <table-pagination :data="componentListData" ref="componentListTable" row-key="id" @onchange="onChange" @selection-change="handleSelectionChange" max-height="330">
      <el-table-column type="selection" width="50" reserve-selection :selectable="checkSelectable"></el-table-column>
      <el-table-column label="标注字段编码" prop="code"></el-table-column>
      <el-table-column label="标注字段名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" @click="viewComponentDetail(scope.row.id)">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="控件类型">
        <template slot-scope="scope">{{componentTypeList[scope.row.type]}}</template>
      </el-table-column>
      <el-table-column label="标签">
        <template slot-scope="scope">{{formatTagList[scope.row.tagList]}}</template>
      </el-table-column>
    </table-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleHideDialog">取消</el-button>
      <el-button type="primary" size="medium" @click="handleAddComponents">确认</el-button>
    </div>

    <component-detail-modal :visible.sync="componentDetailModalVisible" :component-id="currentComponentId" :append-to-body="true"></component-detail-modal>
  </el-dialog>
</template>

<script>
import commonApi from '@/api/common.api.js'
import api from '../api.js'
import TablePagination from '@/components/table-pagination'
import ComponentDetailModal from '../components/ComponentDetailModal.vue'

export default {
  name: 'SelectSeriesModal',
  components: {
    TablePagination,
    ComponentDetailModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      default: 0
    },
    intersectCompList: { // 所有交集征象列表(包括已选和未选的)
      type: Array,
      default: () => []
    },
    extraCompList: { // 已选的额外征象列表，做回显用
      type: Array,
      default: () => []
    },
    isNeedCheckSelectable: { // 是否需要验证之前选过的项目不可编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      markFieldName: '',
      tag: '',
      componentTypeList: { 'text': '文本框', 'select': '下拉框', 'radiobox': '单选框', 'checkbox': '复选框', 'child_select': '二级下拉菜单' },
      componentType: '',
      componentListData: {}, // 序列列表数据
      page: 1, // 是从第一页开始
      pageSize: 10,
      componentDetailModalVisible: false, // 是否弹窗展示组件明细
      currentComponentId: 0 // 要查看的控件id
    }
  },
  watch: {
    async visible(val) {
      if (!val) return
      this.queryComponentList()
    }
  },
  methods: {
    generateUniqueRandomValue() {
      return Number(Math.random().toString().substr(2) + Date.now()).toString(36)
    },
    async queryComponentList() {
      const res = await commonApi.queryFormComponentList({
        page: this.page,
        pagesize: this.pageSize,
        name: this.markFieldName,
        text: this.tag,
        type: this.componentType
      })
      const resData = res.data || {}
      resData.page = this.page
      resData.pageSize = this.pageSize
      // 之前已选中的额外征象需要回显
      resData.list.forEach(row => {
        this.extraCompList.findIndex(({ componentId, id }) => (componentId || id) === row.id) !== -1 && this.$refs.componentListTable.$refs.table.toggleRowSelection(row, true)
      })
      this.componentListData = resData
    },
    checkSelectable({ id: currentComponentId }) {
      if(this.isNeedCheckSelectable === false) return true // 如果设置不要检验就返回true
      // 只能选额外征象，所有交集征象都不能选择(不管之前已选还是未选)
      return this.intersectCompList.concat(this.extraCompList).findIndex(({ componentId, id }) => (componentId || id) === currentComponentId) === -1
    },
    async viewComponentDetail(componentId) {
      this.currentComponentId = componentId
      this.componentDetailModalVisible = true
    },
    // 表格状态更新
    onChange({ pageNo, pageSize }) {
      this.page = pageNo
      this.pageSize = pageSize
      this.queryComponentList()
    },
    formatTagList(tagList) {
      if (!tagList || !tagList.length) return ''
      return tagList.map(({ text }) => text).join()
    },
    handleSelectionChange(val) {
      this.allSelectedComponentList = val
    },
    handleHideDialog() {
      this.markFieldName = ''
      this.tag = ''
      this.componentType = ''
      this.page = 1
      this.$refs.componentListTable && this.$refs.componentListTable.$refs.table.clearSelection()
      this.$emit('update:visible', false)
    },
    handleAddComponents() {
      if (!this.allSelectedComponentList.length) return this.$message.warning('请先选择标注组件')
      this.$emit('receive-comps', this.allSelectedComponentList)
      this.handleHideDialog()
    }
  }
}
</script>

<style lang="less">
  .component-list-wrapper {
    width: 900px;
    max-height: 590px;
    .el-dialog__body {
      padding: 0 10px 10px;
      .el-input {
        width: unset;
      }
    }
    .el-pagination {
      margin-top: 2px;
    }
  }
</style>
