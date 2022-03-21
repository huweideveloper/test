<template>
    <div class="labelProject">
        <div class="tab">
            <el-select v-model="model.category" placeholder="请选择科室" clearable >
                <el-option
                v-for="item in departmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <select-table-page
                placeholder="请选择项目id、名称、创建人"
                v-model="model.projectIdList"
                :data="projectList"
                :remote-method="setProjectList"
                key-name="projectId"
                value-name="projectName"
                :multiple="true"
            ></select-table-page>
            <el-select v-model="model.sicknessType" placeholder="请选择项目标签" clearable >
                <el-option
                v-for="item in sicknessList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
             <el-select v-model="model.projectFunction" placeholder="请选择项目目标" clearable >
                <el-option
                v-for="item in projectFunctionList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="model.projectTarget" placeholder="请选择项目用途" clearable >
                <el-option
                v-for="item in projectTargetList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="model.modality" placeholder="请选择样本类型" clearable >
                <el-option
                v-for="item in modalityList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="model.status" placeholder="请选择状态类型" clearable >
                <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
              class="datePicker startTime"
              v-model="model.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
            >
            </el-date-picker>
            <el-date-picker
              class="datePicker endTime"
              v-model="model.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
            >
            </el-date-picker>
            <el-select v-model="model.groupId" placeholder="请选择项目群组" clearable >
                <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="create">创建项目</el-button>
        </div>
        <table-pagination
          :data="tableData" 
          row-key="id" 
          @onchange="onChangeTable"
        >
          <el-table-column prop="id" label="项目ID"></el-table-column>
          <el-table-column prop="name" label="项目名称" min-width="100"></el-table-column>
          <el-table-column prop="groupName" label="项目群组"></el-table-column>
          <el-table-column prop="" label="科室"></el-table-column>
          <el-table-column prop="modality" label="样本类型">
            <template slot-scope="scope">{{ scope.row.modality === "OTHER" ? "其他" :  scope.row.modality }}</template>
          </el-table-column>
          <el-table-column prop="sicknessType" label="项目标签"></el-table-column>
          <el-table-column prop="projectFunction" label="项目目标"></el-table-column>
          <el-table-column prop="projectTarget" label="项目用途"></el-table-column>
          <el-table-column prop="taskCount" label="引入任务数量"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{ getProjectStatus(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column prop="createUserName" label="创建人"></el-table-column>
          
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown placement="bottom" trigger="click" @command="handleAction">
                <span class="el-dropdown-link">
                  <a class="iconfont icon-caozuo"></a>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.status === ProjectStatus.off" :command="{ type: 'START', data: scope.row, status:2 }">启用</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'READ', data: scope.row }"> 查看详情</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === ProjectStatus.on" :command="{ type: 'STOP', data: scope.row, status:1 }">暂停启用</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'EDIT', data: scope.row }">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'COPY', data: scope.row }">复制</el-dropdown-item>
                  <!-- 7: "冠脉狭窄", 8: "MASK跑算法" 也叫冠脉命名 -->
                  <el-dropdown-item v-if="[7,8].includes(scope.row.seriesImgFileType)" :command="{ type: 'DOWNLOAD', data: scope.row }">下载</el-dropdown-item>
                  
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

        </table-pagination>
    </div>
</template>

<script>
import Papa from 'papaparse';
import Clipboard from 'clipboard';
import { MessageBox } from 'element-ui'
import {
  exportCSVFile
} from '../../utils/file';
import SelectTablePage from "../../components/select-table-page/index.vue";
import TablePagination from '../../components/table-pagination/index.vue';
import {
  projectNameSearch,
  groupSearch,
  projectSearch,
  projectStatusUpdate,
  projectClone,
  projectExport
} from "../../http/labelProject.js";
import {
  getCommonDataByKey
} from '../../http/base.js';
import {
  open
} from '../../utils/window';

import {
  ProjectStatus,
  PageType
} from '../../utils/emun';

export default {
  components:{
      SelectTablePage,
      TablePagination
  },
  data() {
    return {
      model:{
        category: "1",           //科室
        projectIdList: [],      //项目ID、名称、创建人
        sicknessType: "",       //项目标签
        projectFunction: "",    //项目目标
        projectTarget: null,    //项目用途
        modality: null,         //样本类型
        status: null,           //状态类型
        startTime: "",          //开始时间
        endTime: "",            //结束时间
        groupId: null,          //项目群组
        page: 1,
        pageSize: 10,
        type: 1,
      },
      tableData: {
        page: 1,
        pageSize: 10,
        total: 0,
        list: []
      },
      ProjectStatus: ProjectStatus,
      projectType: window.location.hash.indexOf("projectmanage") > -1 ? 1 : 3,
    

    
      projectIds: [],
      projectList: {
        total: 0,
        list: [],
      },
      departmentList: [{
          value: '1',
          label: '放射科'
        }, {
          value: '2',
          label: '病理科'
        }, {
          value: '0',
          label: '其它'
        }, {
          value: '3',
          label: '测试'
        }, {
          value: '4',
          label: '数据库'
      }],
      sicknessList: [],
      projectFunctionList: [],
      projectTargetList: [],
      modalityList:[],
      statusList:[
        { name: '未启用', value: ProjectStatus.off },
        { name: '已启用', value: ProjectStatus.on },
      ],
      groupList:[]
        
    }
  },
  
  async mounted() {

    this.setProjectList();
    const [
      sicknessList,
      projectFunctionList,
      projectTargetList,
      modalityList
    ] = await getCommonDataByKey(["SICKNESS_TYPE", "PROJECT_FUNCTION", "ANNO_PROJECT_TARGET", "MODALITY"]);
    this.sicknessList = sicknessList;
    this.projectFunctionList = projectFunctionList;
    this.projectTargetList = projectTargetList;
    this.modalityList = modalityList;
    this.setGroupList();
    this.query();
    
  },
  methods: {
    handleAction({ type, data, status }) {
      const config = {
        "START": this.handleStartOrStop,
        "STOP": this.handleStartOrStop,
        "READ": this.handleRead,
        "EDIT": this.handleEdit,
        "COPY": this.handleCopy,
        "DOWNLOAD": this.handleDownload,
      }
      config[type] && config[type].call(this, data, status);
    },
    //启动 or 暂停
    async handleStartOrStop(data, status){
      const model = {
        id: data.id,
        status,
      }
      const res = await projectStatusUpdate(model);
      if( res ){
        const list = res.map( id => {
          return {'序列号': id};
        })
        const csvData = Papa.unparse(list);
        exportCSVFile(csvData, '序列号.csv')
        MessageBox.alert('存在序列未跑mha或mha2,请查看已下载的文件')
      }
      this.query();
    },
    //查看详情
    handleRead(data){
      // const path = this.projectType === 1 ? "createproone/view/" : "createbackflowpro1/view/";
      // open( path + data.id, "_blank" );
      open("labelProjectDetail?type="+ PageType.view)
    },
    
    //编辑
    handleEdit(data){
      // const path = this.projectType === 1 ? "createproone/edit/" : "createbackflowpro1/edit/";
      // let temp = data.quotedByAuditProject || data.taskInProgressCount > 0 ? 2 : 1;
      // open( path + data.id + "/" + temp , "_blank");
       open("labelProjectDetail?type="+ PageType.edit)
    },
    //复制
    handleCopy(data){
      MessageBox.confirm("确认复制吗？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async ()=>{
        const model = {
          projectId: data.id,
        };
        await projectClone(model);
        this.query();
      })
    },
    //下载
    async handleDownload(data){
      const model = `projectId=${data.id}`
      const res = await projectExport(model);
      if( res ){
        MessageBox.alert(
          `<div id="targetResultCodeModal">
          <p>请前往跳板机通过小工具下载标注结果，本次的提取码：</p>
          <a class="target-result-code" data-clipboard-text="${res}" style="word-break: break-word">${res}</a>
          </div>`,
          '',
          { dangerouslyUseHTMLString: true }
        )
        // 复制提取码
        setTimeout(() => {
          const clipboard = new Clipboard(".target-result-code", {
            container: document.getElementById('targetResultCodeModal') // 弹窗的复制，需要设置container，否则剪贴板为空
          })
          clipboard.on("success", function(e) {
            Message.closeAll()
            Message.success('已复制到粘贴板')
            e.clearSelection()
          })
        }, 300);
      }
    },
    //获取项目状态
    getProjectStatus(status){
      const item = this.statusList.find(item=> item.value === status);
      return item ? item.name : "";
    },
    onChangeTable({pageNo, pageSize},b,c){
      this.model.page = pageNo;
      this.query();
    },
    async setGroupList(){
      const model = {
        category: this.model.category,
        name: "",
        page: 1,
      }
      const groupList = await groupSearch(model);
      this.groupList = groupList.list;
    },
    async setProjectList(options={}){
      const model = {
        projectName: options.value || "",
        page: options.page || 1,
        pageSize: options.pageSize || 10,
        projectType: 1
      };
      const { list, total }  = await projectNameSearch(model);
      this.projectList.list = list;
      this.projectList.total = total;
    },
    handleQuery(){
      this.model.page = 1;
      this.query();
    },
    //点击查询
    async query(){
      const model = {
        ...this.model,
        startTime: this.model.startTime ? this.model.startTime + " 00:00:00" : "",
        endTime: this.model.endTime ? this.model.endTime + " 23:59:59" : "",
      }
      const tableData = await projectSearch(model);
      this.tableData = {
        ...this.tableData,
        total: tableData.total,
        list: tableData.list,
        page: this.model.page
      }
    },
    //点击创建
    create(){
      // open("createproone/new", "_self");
      open("labelProjectDetail?type="+ PageType.create);
    }
    
  }
}
</script>

<style lang="less">
  .labelProject{
    .tab{
      .el-select,
      .el-date-editor{
        margin: 0 15px 15px 0;
      }
    }
  }
</style>
