<template>
  <el-dialog custom-class="add-audit-source-modal" title="添加审核源" :visible="visible" @close="changeVisible(false)" :closeOnClickModal="false">
    <div class="modal-filter-container">
      <el-form :model="listQuery">
        <el-row>
          <el-col :span="5">
            <el-form-item label>
              <!-- <select-search v-model="listQuery.projectName" placeholder="请输入项目名称" :filter-method="toQueryLikeProjectList" :loading="queryProjectsLoading" filterable allow-create clearable>
                <el-option v-for="item in likeProjectList" :key="item.projectId" :label="item.projectName" :value="item.projectName"> </el-option>
              </select-search>-->
              <select-table-page
                placeholder="请输入项目名称"
                v-model="listQuery.projectName"
                :data="likeProjectList"
                :remote-method="toQueryLikeProjectList"
                :loading="queryProjectsLoading"
                key-name="projectName"
                value-name="projectName"
              ></select-table-page>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label>
              <!-- <select-search v-model="listQuery.taskName" placeholder="请输入任务名称" :filter-method="toQueryLikeTaskList" :loading="queryTasksLoading" filterable allow-create clearable>
                <el-option v-for="item in likeTaskList" :key="item.taskId" :label="item.taskName" :value="item.taskName"></el-option>
              </select-search>-->
              <select-table-page
                placeholder="请输入任务名称"
                v-model="listQuery.taskName"
                :data="likeTaskList"
                :remote-method="toQueryLikeTaskList"
                :loading="queryTasksLoading"
                key-name="taskName"
                value-name="taskName"
              ></select-table-page>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label>
              <el-input v-model="listQuery.projectId" placeholder="请输入项目ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label>
              <el-input v-model="listQuery.taskId" placeholder="请输入任务ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="medium" @click="queryList">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="select-tasks-wrapper">
      <div v-if="!selectTasks || selectTasks.length === 0" class="empty-text">还未选择审核源</div>
      <el-tag v-else v-for="(tag, index) in selectTasks" :key="tag.taskId" closable class="task-tag" @click="handleClickTag(tag)" @close="clearTaskTag(tag, index)"
        >{{ index + 1 }}.{{ tag.taskName }}</el-tag
      >
    </div>
    <table-pagination v-if="visible" ref="sourceTable" :data="tableData" row-key="taskId" @onchange="onChange" @selection-change="handleSelectionChange" height="360">
      <el-table-column type="selection" width="55" :selectable="checkSelectable" reserve-selection></el-table-column>
      <el-table-column label="任务ID" prop="taskId" width="65"></el-table-column>
      <el-table-column label="任务名称" prop="taskName"></el-table-column>
      <el-table-column label="任务类型" prop="type" width="76">
        <template slot-scope="scope">{{ {1: '标注项目', 2: '审核项目', 3: '算法项目'}[scope.row.type] }}</template>
      </el-table-column>
      <el-table-column label="任务状态" width="76">
        <template slot-scope="scope">{{ {1: '待发布', 2: '进行中', 3: '已完成', 4: '已终结'}[scope.row.tasKStatus] }}</template>
      </el-table-column>
      <el-table-column label="所属项目名称" prop="projectName" min-width="104"></el-table-column>
      <el-table-column :label="`已提交序列数${projectInfo.seriesImgFileType === 6 && projectInfo.auditType === 3 ? '' : '(不包含废片)'}`" prop="completedNumber" width="104"></el-table-column>
      <el-table-column label="病灶类型" prop="lesionList" min-width="104">
        <template slot-scope="scope">
          <el-checkbox
            v-if="scope.row.lesionList && scope.row.lesionList.length > 1"
            :value="tableData.list[scope.$index].lesionIds.length === scope.row.lesionList.length"
            @change="(val) => (tableData.list[scope.$index].lesionIds = val ? scope.row.lesionList.map((v) => v.imageAnnotationId) : [scope.row.lesionList[0].imageAnnotationId])"
            :disabled="!selTaskIds.includes(scope.row.taskId)"
            >全选</el-checkbox
          >
          <el-checkbox-group v-model="tableData.list[scope.$index].lesionIds" :min="1" @change="(val) => handleChangeLesionIds(val, scope.row.taskId)">
            <el-checkbox v-for="lesion in scope.row.lesionList" :label="lesion.imageAnnotationId" :key="lesion.imageAnnotationId" :disabled="!selTaskIds.includes(scope.row.taskId)">
              {{ lesionMap[lesion.type] }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </table-pagination>
    <div class="footer">
      <p class="mr-15">
        已选择任务
        <span class="red">{{ selectTasks.length }}</span> 个
      </p>
      <el-button type="primary" size="medium" @click="save">添加</el-button>
      <el-button size="medium" class="mr-15" @click="changeVisible(false)">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../api.js'
import commonApi from '@/api/common.api.js'
import {Message} from 'element-ui'
import TablePagination from '@/components/table-pagination'
import SelectSearch from '@/components/select-search'
import SelectTablePage from '@/components/select-table-page'

export default {
  name: 'AddAuditSourceModal',
  inject: ['app'],
  components: {
    TablePagination,
    SelectSearch,
    SelectTablePage
  },
  props: {
    projectInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    auditProjectId: {
      type: [Number, String],
      required: true
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listQuery: {
        projectName: '',
        projectId: undefined,
        taskName: '',
        taskId: undefined,
        page: 1,
        pageSize: 10
      },
      tableData: {},
      selectTasks: [],
      // 查询
      likeProjectList: [],
      queryProjectsLoading: false,
      likeTaskList: [],
      queryTasksLoading: false,
      // 病灶类型
      lesionMap: {}
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      this.initData()
      this.toQueryLikeProjectList()
      this.toQueryLikeTaskList()
      this.queryList()
    }
  },
  computed: {
    selTaskIds() {
      return this.selectTasks.map((v) => v.taskId)
    }
  },
  mounted() {
    // 初始化病灶类型Map
    const list = this.app.constmap.LESION
    if (!list || !list.children) return ''
    list.children &&
      list.children.forEach((v) => {
        this.lesionMap[v.value] = v.name
        v.children &&
          v.children.forEach((c) => {
            this.lesionMap[c.value] = c.name
          })
      })
  },
  methods: {
    // 初始化查询条件，isResetSelectTasks 是否清空选择的选项
    initData(isResetSelectTasks = true) {
      this.listQuery = {
        projectName: '',
        projectId: undefined,
        taskName: '',
        taskId: undefined,
        page: 1,
        pageSize: 10
      }
      this.tableData = {}
      this.likeProjectList = []
      this.likeTaskList = []
      // 清空选择项
      if (isResetSelectTasks) {
        this.selectTasks = []
        this.$refs.sourceTable && this.$refs.sourceTable.$refs.table.clearSelection()
      }
    },

    // 打开关闭窗口触发事件
    changeVisible(val, isSaveSuccess) {
      this.$emit('change-visible', val, isSaveSuccess)
    },

    // 查询项目名称查询条件
    async toQueryLikeProjectList({value = '', page = 1, pageSize = 10} = {}) {
      this.queryProjectsLoading = true
      const res = await commonApi.projectNamePageSearch({
        noLoading: true,
        projectName: value,
        // projectType: 2, // projectType: 1是标注 2是审核 3是算法
        page,
        pageSize
      })
      this.likeProjectList = res.data
      this.queryProjectsLoading = false
    },

    // 查询任务名称查询条件
    async toQueryLikeTaskList({value = '', page = 1, pageSize = 10} = {}) {
      this.queryTasksLoading = true
      const res = await commonApi.taskNamePageSearch({
        taskName: value,
        // projectType: 2, // projectType: 1是标注 2是审核 3是算法
        page,
        pageSize
      })
      this.likeTaskList = res.data
      this.queryTasksLoading = false
    },

    // 查询列表数据
    async queryList() {
      const data = this.listQuery
      data.projectId = !data.projectId || isNaN(data.projectId) ? null : Number(data.projectId)
      data.taskId = !data.taskId || isNaN(data.taskId) ? null : Number(data.taskId)
      data.currentProjectId = this.auditProjectId
      const res = await api.auditTaskSearchv2(data)
      const listData = res.data.list

      // 设置lesionIds初始值
      listData &&
        listData.forEach((v) => {
          const selTag = this.selectTasks.find((s) => s.taskId === v.taskId)
          v.lesionIds = selTag ? selTag.lesionIds || [] : []
        })

      this.tableData = res.data

      this.$nextTick((v) => {
        // this.$refs.sourceTable.$refs.table.toggleRowSelection(cur, false)
      })
    },

    // 保存
    async save() {
      if (!this.selectTasks.length) {
        Message.error('请先选择审核任务！')
        return
      }
      const lesionList = this.selectTasks.map((v) => {
        return {
          taskId: v.taskId,
          imageAnnotationIdList: v.lesionIds
        }
      })
      await api.auditProjectSourceEdit({
        auditProjectId: this.auditProjectId,
        lesionList,
        action: 1 // 1:新增 3:删除
      })
      this.$message.success('保存成功')
      this.changeVisible(false, true)
    },
    // 表格状态更新
    onChange(pagination, filtersArg, sorter) {
      const {pageNo, pageSize} = pagination
      this.listQuery.page = pageNo
      this.listQuery.pageSize = pageSize
      this.queryList()
    },
    // checkbox是否可选
    checkSelectable(row, index) {
      return true
      // const list = row.toolList
      // return list && list.some(v => v === 'CUBIOD') // 判断是否有方体CUBIOD
    },
    // 选择了checkbox
    handleSelectionChange(val) {
      // 设置了reserve-selection，则所有的数据都会保留
      this.selectTasks = val

      const selTaskIds = this.selectTasks.map((v) => v.taskId)
      this.tableData.list.forEach((v, i) => {
        if (!selTaskIds.includes(v.taskId)) {
          // 未选中
          this.tableData.list[i].lesionIds = [] // 病灶checkbox清除
        } else {
          // 已选中
          if (!v.lesionIds || (v.lesionIds.length === 0 && v.lesionList && v.lesionList.length)) {
            const defaultSel = v.lesionList[0]
            v.lesionIds = [v.lesionList[0].imageAnnotationId] // 病灶checkbox默认选择第一项
            this.handleChangeLesionIds(v.lesionIds, v.taskId) // 修改选中的selTag的lesionIds值
          }
        }
      })
    },
    // 改变了病灶选择项
    handleChangeLesionIds(val, taskId) {
      // 修改选中的selTag的lesionIds值
      const selTag = this.selectTasks.find((v) => v.taskId === taskId)
      selTag.lesionIds = val
    },

    // 点击Tag
    handleClickTag(tag) {
      this.initData(false)
      // this.listQuery.taskName = tag.taskName
      this.listQuery.taskId = tag.taskId
      this.queryList()
    },

    // 删除Tag
    clearTaskTag(row, index) {
      const $table = this.$refs.sourceTable.$refs.table
      const cur = this.tableData.list.find((v) => v.taskId === row.taskId)
      if (cur) {
        // 表格有数据
        $table.toggleRowSelection(cur, false)
      } else {
        // 表格无数据 tag不在当前表格时，不能通过toggleRowSelection去更新所有选中的数据，必须手动修改selection的值
        this.selectTasks.splice(index, 1)
        $table.store.states.selection = this.selectTasks // selection为选中的所有选项的值，删除数据后，手动更新selection，否则表格中此数据还会选中
      }
    }
  }
}
</script>

<style lang="less">
.add-audit-source-modal {
  width: 1100px;
  height: 645px;
  margin-bottom: 60px;
  .modal-filter-container {
    .el-form-item {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  .select-tasks-wrapper {
    height: 84px;
    overflow-y: scroll;
    padding: 5px 10px 0;
    margin-bottom: 5px;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08);
    .task-tag {
      margin: 0 10px 5px 0;
      cursor: pointer;
    }
    .empty-text {
      height: 100%;
      line-height: 74px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
  .el-dialog__body {
    padding: 0 10px 10px;
  }
  .el-pagination {
    margin-top: 2px;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #eee;
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    .mr-15 {
      margin-right: 15px;
    }
    .red {
      color: #f00;
    }
  }
  .el-table {
    .el-checkbox {
      margin-right: 5px;
      .el-checkbox__label {
        padding-left: 5px;
      }
    }
  }
}
</style>
