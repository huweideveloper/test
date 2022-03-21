<template>
  <div class="base-project-info">
      <el-form
        ref="proform"
        :model="projectForm"
        :rules="rules"
        label-width="150px"
        label-suffix="："
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="项目名称" prop="name">
              <el-input
                v-model="projectForm.name"
                placeholder="请输入项目名称"
                :disabled="isView"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="说明文档">
              <el-select
                v-model="projectForm.bizFileId"
                placeholder="请选择说明文档"
                filterable
                :filter-method="queryDocFileList"
                :disabled="isView"
                clearable
              >
                <el-option
                  v-for="item in docFileList"
                  :key="item.id"
                  :label="item.bizName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="项目描述" prop="remark">
              <el-input
                v-model="projectForm.remark"
                type="textarea"
                :rows="4"
                placeholder="请输入项目描述"
                :disabled="isView"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  </div>
</template>



<script>
import { PageType, ProjectType } from "../../../../utils/emun";
import { getUrlParams } from "../../../../utils/window";
import breadCrumb from "../../../../components/bread-crumb/bread-crumb.vue";
import {
  fileQueryList,
  projectNameExist,
  projectDetail,
} from "../../../../http/labelProjectDetail";
import { getLocalStorage, setLocalStorage } from "../../../../utils/storage";
const labelBaseProjectInfo = "labelBaseProjectInfo";

export default {
  components: {
    breadCrumb,
  },
  data() {
    return {
      pageType: getUrlParams("type") || PageType.create,
      dataList: [{ path: "labelProject", title: "标注项目" }, "新建标注项目"],
      projectId: Number(getUrlParams("projectId")),
      docFileList: [],
      projectForm: {
        id: "",
        name: "",       //项目名称
        bizFileId: "",  //说明文档
        remark: "",     //项目描述
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: ["blur", "change"],
          },
          {
            validator: async (rule, value, callback) => {
              if (value) {
                const isExists = await this.checkNameIsrepeat(value);
                if (isExists) return callback(new Error("项目名称已存在"));
              }
              callback();
            },
            trigger: ["blur"],
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入项目描述",
            trigger: ["blur", "change"],
          },
        ],
      },
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
  watch: {
    projectForm: {
      deep: true,
      handler(val, old) {
        this.setLocalStorage(val);
      },
    },
  },

  async mounted() {
    console.log(this.pageType);
    this.initProjectData();
    this.queryDocFileList();
  },
  methods: {
    nextStep(){
      
    },
    initProjectData() {
      if (this.projectId) {
        this.queryProjectDetail();
      } else {
        const defaultValue = { id: "", name: "", bizFileId: "", remark: "" };
        const projectInfo = getLocalStorage(labelBaseProjectInfo, defaultValue);
        this.projectForm = { ...projectInfo };
      }
      this.$refs.proform.clearValidate();
    },
    // 获取项目信息
    async queryProjectDetail() {
      const res = await projectDetail({
        id: this.projectId,
      });
      const { id, name, bizFileId, remark } = res || {};
      this.projectForm = {
        id,
        name,
        bizFileId,
        remark,
      };
      this.setLocalStorage(this.projectForm);
    },
    // 获取文档下拉列表
    async queryDocFileList(bizName = "") {
      const model = {
        bizType: "PATHOLOGY_PROJECT",
        bizName,
      };
      const res = await fileQueryList(model);
      this.docFileList = res || [];
    },
    // 验证项目名称是否存在
    async checkNameIsrepeat(name) {
      const model = {
        name,
        type: ProjectType.label,
        useCallerHandler: true,
      };
      try {
        await projectNameExist(model);
        return false;
      } catch (error) {
        this.setLocalStorage({ ...this.projectForm, name: "" });
        return true
      }
    },
    // 设置session的data_1
    setLocalStorage(data) {
      setLocalStorage(labelBaseProjectInfo, data);
    },
  },
};
</script>

<style lang="less">
@basicColor: #448e97;
.base-project-info {
  position: relative;
  padding: 20px 20px 60px;
  color: #333;
  background: #fff;

  .header-title {
    font-size: 16px;
    margin-bottom: 20px;
    padding-left: 10px;
    .title {
      margin-bottom: 10px;
    }
  }
  .el-select {
    width: 100%;
  }
}
</style>
