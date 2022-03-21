<template>
  <div class="labelProjectDetail">
    <bread-crumb :data="dataList"></bread-crumb>
    <el-steps
      :active="stepsActive"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="基本项目信息"></el-step>
      <el-step title="项目设置"></el-step>
      <el-step title="添加数据"></el-step>
      <el-step title="创建完成"></el-step>
    </el-steps>
    
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>

    <div class="buttons">
      <el-button v-if="stepsActive > 1" @click="prevStep" type="primary">上一步</el-button>
      <el-button v-if="stepsActive < componentList.length " @click="nextStep" type="primary">下一步</el-button>
    </div>
  </div>
</template>


<script>
import breadCrumb from "../../../components/bread-crumb/bread-crumb.vue";
import baseProjectInfo from './component/baseProjectInfo.vue';
import projectConfig from './component/projectConfig.vue';
import addData from './component/addData.vue';
import created from './component/created.vue';
export default {
  components: {
    breadCrumb,
    baseProjectInfo,
    projectConfig,
    addData,
    created,
  },
  data() {
    return {
      componentList: ["baseProjectInfo", "projectConfig", "addData", "created"],
      currentComponent: "baseProjectInfo",
      dataList: [{ path: "labelProject", title: "标注项目" }, "新建标注项目"],
      stepsActive: 1,
    };
  },
  computed: {
    isCreate() {
      return this.pageType === PageType.create;
    },
    isEdit() {
      return this.pageType === PageType.edit;
    },
    isView() {
      return this.pageType === PageType.view;
    },
  },

  async mounted() {
    
  },
  methods: {
    nextStep(){
      this.stepsActive += 1;
      this.currentComponent = this.componentList[this.stepsActive-1];
    },
    prevStep(){
      this.stepsActive -= 1;
      this.currentComponent = this.componentList[this.stepsActive-1];
    }
  },
};
</script>

<style lang="less">

</style>
