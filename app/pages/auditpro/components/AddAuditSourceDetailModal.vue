<template>
  <el-dialog custom-class="add-audit-source-detail-modal" title="已选择审核源" :visible="visible" @close="changeVisible(false)" :closeOnClickModal="false">
    <el-tabs v-model="activeName" active-name="activeName" @tab-click="handleTabClick">
      <el-tab-pane :label="`已选择任务（${projectStatistics.taskNumber}）个`" name="first">
        <el-table :data="selectedTaskData" height="460">
          <el-table-column label="任务ID" prop="taskId" width="100"></el-table-column>
          <el-table-column label="任务名称" prop="taskName" width="200"></el-table-column>
          <el-table-column label="任务类型" prop="typeName" width="100"></el-table-column>
          <el-table-column label="所属项目名称" prop="projectName"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`已进入序列（${projectStatistics.hitSeriesNumber}）个`" name="second">
        <el-table :data="hitSeriesList" height="460">
          <el-table-column label="任务ID" prop="taskId" width="100"></el-table-column>
          <el-table-column label="任务名称" prop="taskName" width="200"></el-table-column>
          <el-table-column label="用户ID" prop="userId" width="100"></el-table-column>
          <el-table-column label="序列号" prop="series"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`未进入序列（${projectStatistics.missSeriesNumber}）个`" name="third">
        <el-table :data="missSeriesList" height="460">
          <el-table-column label="任务ID" prop="taskId" width="100"></el-table-column>
          <el-table-column label="任务名称" prop="taskName" width="200"></el-table-column>
          <el-table-column label="用户ID" prop="userId" width="100"></el-table-column>
          <el-table-column label="序列号" prop="series"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import api from '../api.js'
import TablePagination from '@/components/table-pagination'
export default {
  name: 'AddAuditSourceDetailModal',
  components: {
    TablePagination
  },
  props: {
    auditProjectId: {
      type: [Number, String],
      required: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    // 统计数据
    projectStatistics: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      activeName: 'first',
      selectedTaskData: [], // 已选择任务
      hitSeriesList: [], // 已进入序列
      missSeriesList: [] // 未进入序列
    }
  },
  watch: {
    visible(val, old) {
      if (val) {
        this.activeName = 'first'
        this.queryAuditProjectTaskRead()
      }
    }
  },
  methods: {
    changeVisible(val) {
      this.$emit('change-visible', val)
    },
    handleTabClick(tab) {
      this.activeName = tab.name
      tab.name === 'first' && this.queryAuditProjectTaskRead()
      tab.name === 'second' && this.queryAuditProjectSeriesRead()
      tab.name === 'third' && this.queryAuditProjectSeriesRead()
    },
    // 查询已选择任务
    async queryAuditProjectTaskRead() {
      if (!this.auditProjectId) return
      const res = await api.auditProjectTaskRead({
        auditProjectId: this.auditProjectId
      })
      this.selectedTaskData = res.data || []
    },
    // 查询已导入序列和未导入审核序列数据
    async queryAuditProjectSeriesRead() {
      if (!this.auditProjectId) return
      const res = await api.auditProjectSeriesRead({
        auditProjectId: this.auditProjectId
      })
      this.hitSeriesList = res.data.hitSeriesList || []
      this.missSeriesList = res.data.missSeriesList || []
    }
  }
}
</script>

<style lang="less">
.add-audit-source-detail-modal {
  width: 700px;
  height: 560px;
  margin-bottom: 60px;
  .filter-container {
    .el-form-item {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .select-tasks-wrapper {
    max-height: 84px;
    overflow-y: scroll;
    .task-tag {
      margin: 0 10px 10px 0;
    }
  }
  .el-dialog__header {
    padding: 10px 20px 10px;
  }
  .el-dialog__body {
    padding: 0 20px 10px;
  }
  .el-pagination {
    margin-top: 10px;
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
  }
}
</style>
