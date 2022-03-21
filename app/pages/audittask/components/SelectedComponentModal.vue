<template>
  <el-dialog custom-class="component-list-wrapper" :visible.sync="visible" :close-on-click-modal="false" :show-close="false">
    <div slot="title">
      <span style="font-size: 16px">已选择的标注组件</span>
    </div>
    <el-table :data="listData" ref="componentListTable" row-key="id" height="440px">
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
      <el-table-column label="是否必填" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.required" :disabled="!canEdit"></el-switch>
        </template>
      </el-table-column>
      <el-table-column v-if="canEdit" label="操作">
        <template slot-scope="scope">
          <el-link v-if="scope.$index !== 0" type="primary" icon="el-icon-top" @click="move(-1, scope.$index)"></el-link>
          <el-link v-if="scope.$index !== listData.length - 1" type="primary" icon="el-icon-bottom" @click="move(1, scope.$index)"></el-link>
          <el-link type="danger" icon="el-icon-delete" @click="remove(scope.$index)"></el-link>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleHideDialog">取消</el-button>
      <el-button v-if="canEdit" type="primary" size="medium" @click="handleAddComponents">确认</el-button>
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
  name: 'SelectedSeriesModal',
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
    listData: { // 所有交集征象列表(包括已选和未选的)
      type: Array,
      default: () => []
    },
    canEdit: { // 是否可编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      componentTypeList: { 'text': '文本框', 'select': '下拉框', 'radiobox': '单选框', 'checkbox': '复选框', 'child_select': '二级下拉菜单' },
      componentDetailModalVisible: false, // 是否弹窗展示组件明细
      currentComponentId: 0, // 要查看的控件id
    }
  },
  watch: {
    async visible(val) {
      if (!val) return
    }
  },
  methods: {
    async viewComponentDetail(componentId) {
      this.currentComponentId = componentId
      this.componentDetailModalVisible = true
    },
    formatTagList(tagList) {
      if (!tagList || !tagList.length) return ''
      return tagList.map(({ text }) => text).join()
    },
    handleHideDialog() {
      this.$emit('update:visible', false)
    },
    handleAddComponents() {
      this.$emit('receive-comps', this.listData)
      console.log('this.allSelectedComponentList...', this.listData);
      this.handleHideDialog()
    },
    move(num, index) {
      const data = this.listData[index]
      this.listData.splice(index, 1) // 删除
      this.listData.splice(index+num, 0, data) // 插到对应位置
    },
    remove(index){
      this.listData.splice(index, 1) // 删除
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
