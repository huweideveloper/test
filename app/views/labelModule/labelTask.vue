<template>
    <div class="labelTask">
      labelTask
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

//项目状态
const ProjectStatus = {
  off: 1,    //未启用
  on: 2    //启用
}


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
      const path = this.projectType === 1 ? "createproone/view/" : "createbackflowpro1/view/";
      open( path + data.id, "_blank" );
    },
    
    //编辑
    handleEdit(data){
      const path = this.projectType === 1 ? "createproone/edit/" : "createbackflowpro1/edit/";
      let temp = data.quotedByAuditProject || data.taskInProgressCount > 0 ? 2 : 1;
      open( path + data.id + "/" + temp , "_blank");
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
      open("/createproone/new", "_self");
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
