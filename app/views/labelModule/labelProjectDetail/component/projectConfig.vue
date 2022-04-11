// action: 1
//       aggreConditions: [{type: "NON_TIME", field: "conclusion", dataType: "String"}]
//       annotationItemList: [{id: null, formComponentId: 1075, action: 1, sequence: 10, optional: false, alias: ""},…]
//       bizFileId: 489
//       category: 2
//       diagnosisIncome: true
//       discardCodeList: "1,2,"
//       extendJson: ""
//       groupId: "39"
//       id: null
//       imageAnnotationList: [{action: 1, id: "", name: "骨折点", type: "ANNO1", colour: null,…},…]
//       inspectSee: true
//       isLungPdf: false
//       isYayAttributes: true
//       largeFigure: true
//       modality: "PATHOLOGY"
//       name: "20220324"
//       projectFunction: "classification"
//       projectTarget: "ANNO_OTHER_SET"
//       projectTargetDesc: "其他用途"
//       rangeConditions: "1"
//       remark: "qwqwqw"
//       seriesImgFileType: 2
//       seriesList: []
//       sicknessType: "cervical_TCT"
//       type: 1
//       type2: 1
//       window: "{\"id\":\"11\",\"value\":\"CT02\",\"name\":\"CT骨窗\"}"
//       windowCode: "CT02"
//       yayAttributes: 3

<template>
  <div class="projectConfig">
    <el-form ref="form" :model="model" :rules="rules" class="basic-info-content" style="margin-left: 30px;" label-width="95px" label-suffix="：">
      <el-row>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目标签" prop="sicknessType" :rules="[{required: true, message: '请选择项目标签', trigger: ['blur', 'change']}]">
            <el-select v-model="model.sicknessType" placeholder="请选择项目标签" :disabled="isView || isStart">
              <el-option v-for="item in sicknessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目目标" prop="projectFunction" :rules="[{required: true, message: '请选择项目目标', trigger: ['blur', 'change']}]">
            <el-select v-model="model.projectFunction" placeholder="请选择项目目标" :disabled="isView || isStart">
              <el-option v-for="item in projectFunctionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目用途" prop="projectTarget" :rules="[{required: !projectId, message: '请选择项目用途', trigger: ['blur', 'change']}]">
            <el-select v-model="model.projectTarget" placeholder="请选择项目用途" :disabled="isView || isStart" @change="model.projectTargetDesc = ''">
              <el-option v-for="item in projectTargetList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="model.projectTarget === 'ANNO_OTHER_SET'" :span="6">
          <el-form-item label="其他用途" prop="projectTargetDesc" :rules="[{required: model.projectTarget === 'ANNO_OTHER_SET', message: '请输入其他项目用途', trigger: ['blur', 'change']}]">
            <el-input v-model="model.projectTargetDesc" placeholder="请输入其他项目用途" :disabled="isView || isStart"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" style="margin-right: 10px;">
          <el-form-item label="是否审核项目" prop="type2" label-width="110px" :rules="[{required: true, message: '请选择是否审核项目', trigger: ['blur', 'change']}]" style="margin-bottom: 12px;">
            <el-radio-group v-model="model.type2" :disabled="isView || isStart">
              <el-radio :label="1">否</el-radio>
              <el-radio :label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-item">
        <!-- 6: 冠脉分割 -->
        <el-form-item v-if="Number(model.seriesImgFileType) === 6" label="分割层数" prop="segmentLayer" >
          <el-checkbox-group v-model="model.segmentLayer" :disabled="type == 'view' || status == 2">
            <el-checkbox v-for="(item, index) in segmentLayerList" :key="item.label" :label="item.label" >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item label="样本类型" prop="yblx" :rules="[{required: true, message: '请选择样本类型', trigger: ['blur', 'change']}]">
          <el-select v-model="model.yblx" placeholder="请选择样本类型">
            <el-option v-for="item in yblxList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item label="范围条件" prop="rangeConditions" :rules="[{required: true, message: '请选择范围条件', trigger: ['blur', 'change']}]">
          <el-select v-model="model.rangeConditions" placeholder="请选择范围条件">
            <el-option v-for="item in rangeConditionsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item label="数据类型" prop="seriesImgFileType" :rules="[{required: true, message: '请选择数据类型', trigger: ['blur', 'change']}]">
          
        </el-form-item>
      </el-col>
      <div>聚合条件设置</div>

      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="默认窗宽窗位">
          <el-checkbox v-model="model.默认窗宽窗位">是否设置默认窗宽窗位</el-checkbox>
          <el-select v-show="model.默认窗宽窗位" v-model="model.默认窗宽窗位Value" placeholder="请选择数据类型">
            <el-option v-for="item in 默认窗宽窗位ValueList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="vr默认窗宽窗位">
          <el-checkbox v-model="model.vr默认窗宽窗位">是否设置vr默认窗宽窗位</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="展示检查所见">
          <el-checkbox v-model="model.展示检查所见">是否需要展示检查所见</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="展示诊断所得">
          <el-checkbox v-model="model.展示诊断所得">是否需要展示诊断所得</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="超大图">
          <el-checkbox v-model="model.超大图" :disabled="超大图Disabled">是否使用超大图</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="margin-right: 10px;">
        <el-form-item prop="阴阳性">
          <el-checkbox v-model="model.阴阳性">是否需要阴阳性</el-checkbox>
            <el-select v-show="model.阴阳性" v-model="model.默认窗宽窗位Value" placeholder="请选择数据类型">
              <el-option label="item.name" :value="item.id"></el-option>
            </el-select>
             <el-select v-show="model.阴阳性" v-model="model.默认窗宽窗位Value" placeholder="请选择数据类型">
            <el-option v-for="item in 默认窗宽窗位ValueList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>



      

      

    </el-form>
  </div>
</template>

<script>
import AnnoItemList from '@/pages/createpro/step2/anno-item-list.vue';
import {
  getUrlParams
} from '../../../../utils/window';
const urlParams = getUrlParams();
import {
  getCommonDataByKey
} from '../../../../http/base';



export default {
  components: {
    AnnoItemList,
  },
  data() {
    return {
      projectId: urlParams.projectId,
      pageType: urlParams.pageType,
      status: this.status,
      projectData: {},
      imageAnnotationListInitData: [], // 初始化的imageAnnotationList数据
      annoListIndex: { n1: 0, n2: 0 }, // 当前操作的annoList的下标，二维数组的下标 n1: 一级，n2：二级
      annoDisabled: false, // 是否不可编辑
      segmentLayerList: [], // ['左心室', '左心房', '右心室', '右心房', '主动脉', '左室壁', '冠脉'], // 分割层数选项
      model: {
        sicknessType: undefined, // 项目标签
        projectFunction: undefined, // 项目目标
        projectTarget: undefined, // 项目用途
        projectTargetDesc: undefined, // 其他用途
        segmentLayer: [],
        type2: 1,                   // 是否审核项目 1:否 2:是
        yblx: "",                   //样本类型
        rangeConditions: "",        //范围条件
        seriesImgFileType: "",      //数据类型
        默认窗宽窗位: false,          //默认窗宽窗位
        默认窗宽窗位Value: "",        //默认窗宽窗位Value
        vr默认窗宽窗位: false,        //vr默认窗宽窗位
        展示诊断所得: false,          //展示诊断所得
        超大图: false,                //超大图
        阴阳性: false,                //阴阳性
      },
      超大图Disabled: false,    
      
      rules: {
        segmentLayer: [
          { required: true, message: "请选择分割层数", trigger: "change" },
        ],
      },
      sicknessTypeList:[],          // 项目标签
      projectFunctionList: [],      // 项目目标
      projectTargetList: [],        // 项目用途
      yblxList: [],                 // 样本类型  
      rangeConditionsList: [        // 范围条件
        { name: "序列号（切片号）", id: "1" },
        { name: "检查号", id: "2" },
      ],                      
      seriesImgFileTypeList: [],    // 数据类型
      默认窗宽窗位ValueList: [],      // 默认窗宽窗位
    };
  },
  computed: {
    isView() {
      return this.pageType === "view";
    },
    isStart() {
      // 已开启
      return Number(this.status) === 2;
    },
  },
  async created() {
    this.segmentLayerList = await this.getSegmentLayerList();
    const [
      sicknessTypeList,
      projectFunctionList,
      projectTargetList,
      yblxList,
      默认窗宽窗位ValueList
    ] = await getCommonDataByKey(["SICKNESS_TYPE", "PROJECT_FUNCTION", "ANNO_PROJECT_TARGET", "MODALITY", "WINDOW"]);
    this.sicknessTypeList = sicknessTypeList;
    this.projectFunctionList = projectFunctionList;
    this.projectTargetList = projectTargetList;
    this.yblxList = yblxList;
    this.seriesImgFileTypeList = this.getSeriesImgFileTypeList();
    this.默认窗宽窗位ValueList = 默认窗宽窗位ValueList;
  },
  methods: {
    getModel(){
      const model = {
        ...this.model,
        默认窗宽窗位Value: this.model.默认窗宽窗位 ? this.model.默认窗宽窗位Value : "",
      }
      return model;
    },
    getSeriesImgFileTypeList(){
      const list = [
        { name: "非原始数据", id: "1" },
        { name: "原始数据", id: "2" },
        { name: "MPR", id: "3" },
        { name: "动脉瘤", id: "4" },
        { name: "肝肿瘤", id: "5" },
        { name: "冠脉分割", id: "6" },
        { name: "冠脉狭窄", id: "7" },
        { name: "冠脉命名", id: "8" },  // 也叫MASK跑算法
        { name: "随访配准", idx: "9" }, //this.projectType === 1  标注项目管理
        { name: "脑血管分割", id: "10" },
        { name: "冠脉斑块分割", id: "11" },
        { name: "脑中线", id: "12" },
        { name: "脑动脉瘤", id: "13" },
        { name: "肺气道", id: "14" },
        { name: "C端病理大图", id: "15" },
        { name: "冠脉分岔点", id: "16" },
        { name: "肋骨分割", id: "17" }
      ]
      return list;
    },
    // 初始化数据
    setProjectData(data = {}) {
      this.projectData = data || {};
      this.imageAnnotationListInitData =
        this.projectData.imageAnnotationList || [];
      const extendJson = data.extendJson ? JSON.parse(data.extendJson) : ""; // 层数父节点
      this.model = Object.assign(this.model, {
        seriesImgFileType: data.seriesImgFileType,
        segmentLayer: extendJson ? extendJson.segmentLayer || [] : [], // 分割层数默认[]
      });
    },
    setProjectBasicData(data) {
      this.model = Object.assign(this.model, {
        sicknessType: data.sicknessType, // 项目标签
        projectFunction: data.projectFunction, // 项目目标
        projectTarget: data.projectTarget, // 项目用途
        projectTargetDesc: data.projectTargetDesc, // 其他用途
        type2: data.type2,
      });
    },
    // 当数据类型修改时
    handleSeriesImgFileTypeChange(seriesImgFileType) {
      this.$set(this.model, "seriesImgFileType", seriesImgFileType);

      // 改变分割层数segmentLayer
      const segmentLayer = this.model.segmentLayer || "";
      if (Number(seriesImgFileType) === 6) {
        // 6：冠脉分割
        this.$set(
          this.model,
          "segmentLayer",
          segmentLayer.length ? this.model.segmentLayer : [7]
        );
      } else {
        this.$set(this.model, "segmentLayer", "");
      }

      // 改变影像标注相关
      this.resetImageAnnotationListBySeriesImgFileType(seriesImgFileType);
    },
    // 返回表单数据
    getFormData() {
      let data = false;
      this.$refs.form.validate((valid) => {
        if (valid) data = this.model;
      });
      return data;
    },

    /************ 影像标注相关 ***********/
    // 返回列表的annoItemList，二维的数据[{type: '', children: {type: '', ...}, ...}]
    getImageAnnoItemList() {
      return this.$refs.annoListForm.getAnnoItemList() || [];
    },
    // 显示新增标注组件弹窗
    handleShowAddAnnoModal({ n1, n2 }) {
      this.annoListIndex = { n1, n2 };
      that.chooseComponent("", { n1, n2 });
    },
    // 显示标注组件详情弹窗
    handleShowDetailAnnoModal({ n1, n2 }) {
      this.annoListIndex = { n1, n2 };
      that.showytjComponent("", { n1, n2 });
    },
    // 更新标注组件数据
    updateAnnotationItemList(val) {
      this.$refs.annoListForm.updateAnnotationItemList(val, this.annoListIndex);
    },
    // 获取影像标注的所有数据
    getAnnoFormData() {
      return this.$refs.annoListForm.getFormData();
    },
    // 设置影像标注为disabled
    setAnnoListDisabled(bool) {
      this.annoDisabled = bool;
    },
    // 影像标注根据类型重置数据, 改变ImageAnnotation，选择9：随访配准后，只能选择肺结节+长方体，不可编辑
    resetImageAnnotationListBySeriesImgFileType(seriesImgFileType) {
      this.$refs.annoListForm.resetDataBySeriesImgFileType(seriesImgFileType);
    },
    async getSegmentLayerList(){
      const value = "HEART_SEGMENT_LABEL_NAME_CONFIG";
      const children = await getCommonDataByKey("SINGLE_CONFIG");
      const item = children.find(item => item.value === value);
      return item ? JSON.parse(item.remark).labelNames : [];
    },
  },
};
</script>

<style lang="less">
</style>
