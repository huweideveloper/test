<template>
  <div class="projectConfig">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="basic-info-content" style="margin-left: 30px;" label-width="95px" label-suffix="：">
      <el-row>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目标签" prop="sicknessType" :rules="[{required: true, message: '请选择项目标签', trigger: ['blur', 'change']}]">
            <el-select v-model="ruleForm.sicknessType" placeholder="请选择项目标签" :disabled="isView || isStart">
              <el-option v-for="item in sicknessTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目目标" prop="projectFunction" :rules="[{required: true, message: '请选择项目目标', trigger: ['blur', 'change']}]">
            <el-select v-model="ruleForm.projectFunction" placeholder="请选择项目目标" :disabled="isView || isStart">
              <el-option v-for="item in projectFunctionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-right: 10px;">
          <el-form-item label="项目用途" prop="projectTarget" :rules="[{required: !projectId, message: '请选择项目用途', trigger: ['blur', 'change']}]">
            <el-select v-model="ruleForm.projectTarget" placeholder="请选择项目用途" :disabled="isView || isStart" @change="ruleForm.projectTargetDesc = ''">
              <el-option v-for="item in projectTargetList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.projectTarget === 'ANNO_OTHER_SET'" :span="6">
          <el-form-item label="其他用途" prop="projectTargetDesc" :rules="[{required: ruleForm.projectTarget === 'ANNO_OTHER_SET', message: '请输入其他项目用途', trigger: ['blur', 'change']}]">
            <el-input v-model="ruleForm.projectTargetDesc" placeholder="请输入其他项目用途" :disabled="isView || isStart"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" style="margin-right: 10px;">
          <el-form-item label="是否审核项目" prop="type2" label-width="110px" :rules="[{required: true, message: '请选择是否审核项目', trigger: ['blur', 'change']}]" style="margin-bottom: 12px;">
            <el-radio-group v-model="ruleForm.type2" :disabled="isView || isStart">
              <el-radio :label="1">否</el-radio>
              <el-radio :label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-item">
        <!-- 6: 冠脉分割 -->
        <el-form-item v-if="Number(ruleForm.seriesImgFileType) === 6" label="分割层数" prop="segmentLayer" >
          <el-checkbox-group v-model="ruleForm.segmentLayer" :disabled="type == 'view' || status == 2">
            <el-checkbox v-for="(item, index) in segmentLayerList" :key="item.label" :label="item.label" >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
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
      ruleForm: {
        sicknessType: undefined, // 项目标签
        projectFunction: undefined, // 项目目标
        projectTarget: undefined, // 项目用途
        projectTargetDesc: undefined, // 其他用途
        seriesImgFileType: "",
        segmentLayer: [],
        type2: 1, // 是否审核项目 1:否 2:是
      },
      rules: {
        segmentLayer: [
          { required: true, message: "请选择分割层数", trigger: "change" },
        ],
      },
      sicknessTypeList:[], // 项目标签
      projectFunctionList: [], // 项目目标
      projectTargetList: [], // 项目用途
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
    ] = await getCommonDataByKey(["SICKNESS_TYPE", "PROJECT_FUNCTION", "ANNO_PROJECT_TARGET"]);
    this.sicknessTypeList = sicknessTypeList;
    this.projectFunctionList = projectFunctionList;
    this.projectTargetList = projectTargetList;
  },
  methods: {
    // 初始化数据
    setProjectData(data = {}) {
      this.projectData = data || {};
      this.imageAnnotationListInitData =
        this.projectData.imageAnnotationList || [];
      const extendJson = data.extendJson ? JSON.parse(data.extendJson) : ""; // 层数父节点
      this.ruleForm = Object.assign(this.ruleForm, {
        seriesImgFileType: data.seriesImgFileType,
        segmentLayer: extendJson ? extendJson.segmentLayer || [] : [], // 分割层数默认[]
      });
    },
    setProjectBasicData(data) {
      this.ruleForm = Object.assign(this.ruleForm, {
        sicknessType: data.sicknessType, // 项目标签
        projectFunction: data.projectFunction, // 项目目标
        projectTarget: data.projectTarget, // 项目用途
        projectTargetDesc: data.projectTargetDesc, // 其他用途
        type2: data.type2,
      });
    },
    // 当数据类型修改时
    handleSeriesImgFileTypeChange(seriesImgFileType) {
      this.$set(this.ruleForm, "seriesImgFileType", seriesImgFileType);

      // 改变分割层数segmentLayer
      const segmentLayer = this.ruleForm.segmentLayer || "";
      if (Number(seriesImgFileType) === 6) {
        // 6：冠脉分割
        this.$set(
          this.ruleForm,
          "segmentLayer",
          segmentLayer.length ? this.ruleForm.segmentLayer : [7]
        );
      } else {
        this.$set(this.ruleForm, "segmentLayer", "");
      }

      // 改变影像标注相关
      this.resetImageAnnotationListBySeriesImgFileType(seriesImgFileType);
    },
    // 返回表单数据
    getFormData() {
      let data = false;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) data = this.ruleForm;
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
