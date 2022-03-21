<template>
  <div class="ethic-stat">
    <div class="selectContainer">
      <el-input
        v-model="projectId"
        placeholder="项目id"
        class="projectId"
      ></el-input>
      <select-table-page
        placeholder="项目名称"
        v-model="projectIds"
        :data="projectList"
        :remote-method="setProjectList"
        key-name="projectId"
        value-name="projectName"
        :multiple="true"
      ></select-table-page>
      <select-table-page
        placeholder="全部医院"
        v-model="hospitalCodes"
        :data="hospitalList"
        :remote-method="setHospitalList"
        key-name="code"
        value-name="name"
        :multiple="true"
      ></select-table-page>
      <el-date-picker
        class="datePicker startTime"
        v-model="startTime"
        type="date"
        placeholder="开始日期"
      >
      </el-date-picker>
      <el-date-picker
        class="datePicker endTime"
        v-model="endTime"
        type="date"
        placeholder="结束日期"
      >
      </el-date-picker>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <div class="intoGroup-content">
      <el-table
        v-loading="loading"
        :data="tableList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" sortable width="80">
        </el-table-column>
        <el-table-column prop="projectId" label="项目id" sortable>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" sortable>
        </el-table-column>
        <el-table-column prop="hospital" label="医院名称" sortable>
        </el-table-column>
        <el-table-column prop="ethicStatus" label="伦理状态" sortable>
          <template slot-scope="scope">
            <div
              v-bind:class="{
                active: scope.row.ethicStatus == 1 ? true : false,
                status: true,
              }"
            >
              <i></i>
              <span>{{
                scope.row.ethicStatus == 0
                  ? "未通过"
                  : scope.row.ethicStatus == 1
                  ? "通过"
                  : "未知"
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="项目创建人" sortable>
        </el-table-column>
        <el-table-column prop="createDate" label="项目创建时间" sortable>
          <template slot-scope="scope">
            <span>{{
              moment(scope.row.createDate).format("YYYY-MM-DD hh:mm:ss")
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      class="el-pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import SelectTablePage from "@/components/select-table-page";
import app from "../../app.js";
import httpre from "../../utils/interceptAjax";
const httpRequest = new httpre(app);
import moment from "moment";
import * as echarts from "echarts";

export default {
  // inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "local",
    },
    // isShowList: {
    //   type: Array,
    //   default: function () {
    //     return [false, false];
    //   },
    // },
  },
  components: {
    SelectTablePage,
  },
  data() {
    const pageSizes = [10, 50, 100, 200, 500, 1000];
    return {
      projectId: "",
      tableList: [],

      projectIds: [],
      projectList: {
        total: 0,
        list: [],
      },
      projectNames: [],
      projectNameList: {
        total: 0,
        list: [],
      },

      hospitalCodes: [],
      hospitalList: {
        total: 0,
        list: [],
      },
      startTime: "",
      endTime: "",
      date: ["", ""],

      total: 0,
      currentPage: 1,
      pageSizes: pageSizes,
      pageSize: pageSizes[0],
      moment: moment,
      loading: false,
    };
  },
  async mounted() {
    await this.setProjectList();
    await this.setHospitalList();
    this.handleSearch();
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.handleSearch();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleSearch();
    },
    async setProjectList(options = {}) {
      const model = {
        projectName: options.value || "",
        page: options.page || 1,
        pageSize: options.pageSize || 10,
        projectType: 1,
      };
      const { data } = await httpRequest.POST(
        "/project/name/page/search",
        model
      );
      this.projectList.list = data.list;
      this.projectList.total = data.total;
    },
    async setHospitalList(options = {}) {
      const model = {
        name: options.value || "",
        page: options.page || 1,
        pageSize: options.pageSize || 10,
      };
      const { data } = await httpRequest.POST("/dwh/hospital/search", model);
      this.hospitalList.list = data.list;
      this.hospitalList.total = data.total;
    },
    async handleSearch() {
      this.loading = true;
      const model = this.getModel();
      const { data } = await httpRequest.POST("/ethic/project/search", model);
      this.loading = false;
      const { list, total } = data;
      this.tableList = list;
      this.total = total;
    },
    getModel() {
      const projectId = isNaN(Number(this.projectId))
        ? this.projectId
        : Number(this.projectId);
      const projectIds = projectId
        ? this.projectIds.concat([projectId])
        : this.projectIds;
      const model = {
        hospitalCodes: this.hospitalCodes,
        projectIds: projectIds,
        startProjectCreateDate: this.startTime
          ? moment(this.startTime).format("YYYY-MM-DD") + " 00:00:00"
          : null,
        endProjectCreateDate: this.endTime
          ? moment(this.endTime).format("YYYY-MM-DD") + " 23:59:59"
          : null,
        page: this.currentPage,
        pageSize: this.pageSize,
      };
      return model;
    },

    setDefaultDate() {
      const date = moment();
      this.startTime = date.subtract(date.day() - 1, "days");
      this.endTime = new Date();
    },
  },
};
</script>

<style lang="less">
.ethic-stat {
  margin: 20px;
  .projectId {
    width: 160px;
  }
  .projectId,
  .el-select,
  .el-date-editor {
    margin-right: 15px;
  }

  .selectContainer {
    display: flex;
    justify-content: end;
  }
  .intoGroup-content {
    padding-bottom: 40px;
    margin-top: 25px;
    .cell {
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid #ccc;
          margin-right: 10px;
        }
        &.active {
          i {
            background-color: green;
          }
        }
      }
    }
  }
}
</style>
