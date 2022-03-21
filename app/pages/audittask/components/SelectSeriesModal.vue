<template>
  <el-dialog custom-class="series-list-wrapper" title="选择标注影像" :visible.sync="visible" :close-on-click-modal="false" :show-close="false">
    <div>
      <div class="query-wrapper">
        <el-row>
          <el-col :span="4">
            <el-select v-model="doctorIdList" :placeholder="`请选择${projectInfo.seriesImgFileType === 6 && projectInfo.auditType === 3 ? '标注/审核医生' : '标注医生'}`" multiple collapse-tags filterable clearable reserve-keyword default-first-option>
              <el-option v-for="{ id, name } in doctorList" :key="id" :label="name" :value="id"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="taskIdList" placeholder="请选择任务" multiple collapse-tags filterable clearable reserve-keyword default-first-option>
              <el-option v-for="{ id, name } in taskList" :key="id" :label="name" :value="id"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="projectIdList" placeholder="请选择项目" multiple collapse-tags filterable clearable reserve-keyword default-first-option>
              <el-option v-for="{ id, name } in projectList" :key="id" :label="name" :value="id"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="seriesInstanceUid" placeholder="序列号" clearable></el-input>
          </el-col>
          <el-col :span="8">
            <date-picker-range v-model="submitTime" startPlaceholder="开始提交时间" endPlaceholder="结束提交时间"></date-picker-range>
          </el-col>
          <!-- <el-col style="text-align: right;">
            <el-button type="primary" size="medium" @click="querySeriesList">查询</el-button>
          </el-col> -->
        </el-row>
        <el-button type="primary" size="medium" @click="querySeriesList">查询</el-button>
      </div>
      <el-row style="margin: 12px 0">
        <el-col :span="6">
          <el-checkbox v-model="isJumpChecked">是否跳过已审核序列</el-checkbox>
        </el-col>
        <el-col :span="18">
          已选择审核序列<span>{{selectedCount}}</span>个，已进入审核标注任务<span>{{enteredCount}}</span>个，已审核序列<span>{{checkedCount}}</span>个，未审核序列<span>{{unCheckedCount}}</span>个
        </el-col>
      </el-row>
    </div>
    <table-pagination ref="seriesListTable" :data="seriesListData" type="local" row-key="seriesAnnotationResultId" @selection-change="handleSelectionChange" max-height="330">
      <el-table-column type="selection" width="50" reserve-selection></el-table-column>
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
      <el-button size="medium" @click="handleHideDialog">取消</el-button>
      <pop-confirm title="添加序列后，征像信息需要重新选择，请确认是否继续？" placement="top" @onconfirm="handleAddSeries">
        <el-button slot="reference" type="primary" size="medium">一键添加</el-button>
      </pop-confirm>
    </div>
  </el-dialog>
</template>

<script>
import api from '../api.js'
import TablePagination from '@/components/table-pagination'
import PopConfirm from '@/components/pop-confirm/index.vue'
import DatePickerRange from '@/components/date-picker-range/index.vue'

export default {
  name: 'SelectSeriesModal',
  components: {
    TablePagination,
    PopConfirm,
    DatePickerRange
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      default: 0
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
      doctorList: [],
      taskList: [],
      projectList: [],
      doctorIdList: [],
      taskIdList: [],
      projectIdList: [],
      seriesInstanceUid: '',
      submitTime: ['', ''],
      isJumpChecked: true,
      seriesListData: {}, // 序列列表数据
      // 几个数量
      selectedCount: 0,
      enteredCount: 0,
      checkedCount: 0,
      unCheckedCount: 0,
      allSelectedSeriesList: []
    }
  },
  watch: {
    async visible(val) {
      if (!val) return
      this.querySeriesList()
      const res = await api.queryDoctorTaskProjectList(null, {
        projectId: this.projectId
      })
      const { doctorList, taskList, projectList } = res.data || {}
      this.doctorList = doctorList
      this.taskList = taskList
      this.projectList = projectList
    },
    allSelectedSeriesList(val) {
      let [selectedCount, enteredCount, checkedCount, unCheckedCount] = [0, 0, 0, 0]
      if (val.length) {
        selectedCount = val.length
        const tempObj = {}
        val.forEach(({ taskId, checked }) => {
          if (!tempObj[taskId]) {
            tempObj[taskId] = true
            enteredCount++
          }
          checked ? checkedCount++ : unCheckedCount++
        })
      }
      this.selectedCount = selectedCount
      this.enteredCount = enteredCount
      this.checkedCount = checkedCount
      this.unCheckedCount = unCheckedCount
    }
  },
  methods: {
    generateUniqueRandomValue() {
      return Number(Math.random().toString().substr(2) + Date.now()).toString(36)
    },
    async querySeriesList() {
      const [startSubmitTime, endSubmitTime] = this.submitTime || ['', '']
      const res = await api.queryProjectSeriesAnnotationResult({
        currentProjectId: this.projectId,
        doctorIdList: this.doctorIdList,
        taskIdList: this.taskIdList,
        projectIdList: this.projectIdList,
        isJumpChecked: this.isJumpChecked,
        startSubmitTime: startSubmitTime || null,
        endSubmitTime: endSubmitTime || null,
        seriesInstanceUid: this.seriesInstanceUid,
      })
      const seriesList = res.data.seriesAnnotationResultList || []
      this.seriesListData = {
        list: seriesList,
        total: seriesList.length,
        page: 1,
        pageSize: 10
      }
      const seriesListTableRef = this.$refs.seriesListTable
      seriesListTableRef.clearAllSelectedRows()
      seriesListTableRef.selectRows(seriesList)
    },
    handleSelectionChange(val) {
      this.allSelectedSeriesList = val
    },
    handleHideDialog() {
      this.doctorIdList = []
      this.taskIdList = []
      this.projectIdList = []
      this.selectedCount = 0
      this.enteredCount = 0
      this.checkedCount = 0
      this.unCheckedCount = 0
      this.page = 1
      this.$emit('update:visible', false)
    },
    async handleAddSeries() {
      if (!this.allSelectedSeriesList.length) return this.$message.warning('请先选择序列')
      const [ seriesInstanceUidList, sarIds ] = [[], []]
      this.allSelectedSeriesList.map(({ seriesInstanceUid, seriesAnnotationResultId }) => {
        seriesInstanceUidList.push(seriesInstanceUid)
        sarIds.push(seriesAnnotationResultId)
      })
      const params = {
        taskId: this.taskId,
        isJumpChecked: this.isJumpChecked,
        seriesInstanceUidList,
        useCallerHandler: true // 此接口报错功能层不处理，让调用方自行处理
      }
      const { seriesImgFileType, auditType} = this.projectInfo
      if (seriesImgFileType === 6 && auditType === 2) params.sarIds = sarIds // 6:冠脉分割 2:MASK单标 才添加sarIds参数

      const res = await api.addAuditTaskSeries(params)
      const { code, data, msg } = res
      if (code === 0) {
        this.$message.success(data)
        // this.$parent.queryAuditTaskToolComp()
        this.$emit('addsuccess')
        this.handleHideDialog()
      } else {
        this.$alert(`<pre>${msg}</pre>`, '提示', {
          dangerouslyUseHTMLString: true
        })
      }
    }
  }
}
</script>

<style lang="less">
  .series-list-wrapper {
    min-width: 1260px;
    width: 80%;
    max-height: 600px;
    .query-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-row {
        flex: 1;
      }
      .el-col {
        padding-right: 10px;
      }
      .el-select {
        width: 100%;
      }
    }
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
