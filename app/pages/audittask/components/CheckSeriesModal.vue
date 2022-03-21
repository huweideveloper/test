<template>
  <el-dialog custom-class="selected-series-list-wrapper" title="已添加影像数据" :visible.sync="visible" :close-on-click-modal="false" :show-close="false">
    <el-row style="margin: 12px 0">
      已选择审核序列<span>{{selectedCount}}</span>个，已进入审核标注任务<span>{{enteredCount}}</span>个，已审核序列<span>{{checkedCount}}</span>个，未审核序列<span>{{unCheckedCount}}</span>个
    </el-row>
    <table-pagination :data="seriesListData" type="local" max-height="330">
      <el-table-column label="序列号" prop="seriesInstanceUid" show-overflow-tooltip></el-table-column>
      <el-table-column label="检查号" prop="studyInstanceUid" show-overflow-tooltip></el-table-column>
      <el-table-column :label="`${projectInfo.seriesImgFileType === 6 && projectInfo.auditType === 3 ? '标注/审核医生' : '标注医生'}`" prop="doctorName"></el-table-column>
      <el-table-column label="MASK病灶数" prop="lesionNumber" width="106"></el-table-column>
      <el-table-column label="提交时间" prop="submitTime" width="100"></el-table-column>
      <el-table-column label="所属项目" prop="projectName" show-overflow-tooltip></el-table-column>
      <el-table-column label="任务类型" prop="projectType" show-overflow-tooltip>
        <template slot-scope="scope">{{ { 1: '标注项目', 2: '审核项目', 3: '算法项目' }[scope.row.projectType] }}</template>
      </el-table-column>
      <el-table-column label="所属任务" prop="taskName" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否已审核" width="90">
        <template slot-scope="scope">{{ scope.row.checked ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="是否废片" width="90">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.isTerminate"
            placement="left"
            title="废片原因"
            width="300"
            trigger="hover"
            :content="scope.row.discardReason">
            <span slot="reference" class="red">是</span>
          </el-popover>
          <span v-else >否</span>
        </template>
      </el-table-column>
    </table-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleHideDialog">关 闭</el-button>
      <el-button v-if="canEdit" type="primary" size="medium" @click="handleDeleteSeries">一键清除所有序列</el-button>
      <el-button v-if="canEdit" type="success" size="medium" @click="handleExportSeries">一键导出序列号</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../api.js'
import TablePagination from '@/components/table-pagination'
import PopConfirm from '@/components/pop-confirm/index.vue'
import Papa from 'papaparse'

export default {
  name: 'CheckSeriesModal',
  components: {
    TablePagination,
    PopConfirm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    taskId: {
      type: Number,
      default: 0
    },
    projectInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      seriesListData: {}, // 序列列表数据
      // 几个数量
      selectedCount: 0,
      enteredCount: 0,
      checkedCount: 0,
      unCheckedCount: 0
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      this.queryAuditTaskSeries()
    }
  },
  methods: {
    async queryAuditTaskSeries() {
      const res = await api.queryAuditTaskSeries(null, {
        taskId: this.taskId
      })
      const seriesList = res.data.seriesAnnotationResultList || []
      const seriesTotalCount = seriesList.length
      if (!seriesTotalCount) return
      this.seriesListData = {
        list: seriesList,
        total: seriesTotalCount,
        page: 1,
        pageSize: 10
      }
      let [selectedCount, enteredCount, checkedCount, unCheckedCount] = [seriesTotalCount, 0, 0, 0]
      const tempObj = {}
      seriesList.forEach(({ taskId, checked }) => {
        if (!tempObj[taskId]) {
          tempObj[taskId] = true
          enteredCount++
        }
        checked ? checkedCount++ : unCheckedCount++
      })
      this.selectedCount = selectedCount
      this.enteredCount = enteredCount
      this.checkedCount = checkedCount
      this.unCheckedCount = unCheckedCount
    },
    async handleDeleteSeries() {
      const res = await api.deleteAuditTaskSeries(null, {
        taskId: this.taskId
      })
      this.$message.success('序列清除成功')
      // this.$parent.queryAuditTaskToolComp()
      this.$emit('deletesucess')
      this.seriesListData = {}
      this.handleHideDialog()
    },
    handleExportSeries() {
      const tempObj = {}
      const seriesInstanceUidList = []
      this.seriesListData.list.forEach(({ seriesInstanceUid }) => {
        if (!tempObj[seriesInstanceUid]) {
          tempObj[seriesInstanceUid] = true
          seriesInstanceUidList.push({
            seriesInstanceUid
          })
        }
      })
      const csvData = Papa.unparse(seriesInstanceUidList)
      Tool.exportCSVFile(csvData, '序列号.csv')
    },
    handleHideDialog() {
      this.selectedCount = 0
      this.enteredCount = 0
      this.checkedCount = 0
      this.unCheckedCount = 0
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less">
  .selected-series-list-wrapper {
    width: 1260px;
    max-height: 550px;
    .el-dialog__body {
      padding: 0 10px 10px;
    }
    .el-pagination {
      margin-top: 2px;
    }
    .red {
      cursor: pointer;
      color: #880a0a;
    }
  }
</style>
