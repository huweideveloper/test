<template>
  <dialog-model custom-class="selttlement-config-add-container" :title="form.id ? '编辑结算配置' : '创建结算配置'" :visible="visible" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目标签" prop="sicknessType">
            <el-select v-model="form.sicknessType" placeholder="项目标签" clearable>
              <el-option v-for="item in sicknessTypeList" :key="item.idx" :label="item.val" :value="item.idx"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目目标" prop="projectFunction">
            <el-select v-model="form.projectFunction" placeholder="项目目标" clearable>
              <el-option v-for="item in projectFunctionList" :key="item.idx" :label="item.val" :value="item.idx"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="form.dataType" placeholder="数据类型" clearable>
              <el-option v-for="item in dataTypeList" :key="item.idx" :label="item.val" :value="item.idx"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否审核" prop="isAudit">
            <el-radio-group v-model="form.isAudit">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <!-- <el-switch v-model="form.isAudit" active-text="是" inactive-text="否"></el-switch> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="集团" prop="companyIds">
            <el-select v-model="form.companyIds" placeholder="请选择集团" multiple clearable :disabled="!!id">
              <el-option v-for="item in vendorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="政策类型" prop="settlementRulesIds">
            <el-select v-model="form.settlementRulesIds" placeholder="请选择政策类型" multiple clearable style="width: 100%;">
              <el-option v-for="item in settlementRuleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, i) in form.settlementRules" :key="`${item.code}${i}`">
        <el-col :span="12">
          <el-form-item class="settlement-item" :label="item.name" :prop="`settlementRules.${i}.price`" :rules="[{required: true, message: '请输入单价', trigger: ['blur', 'change']}]">
            <input-number v-model="item.price" placeholder="单价" :precision="6" clearable>
              <div slot="append">元</div>
            </input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <i class="el-icon-delete delete-icon" @click="deleteRule(item.code)"></i>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="save" :loading="isSaving">确 定</el-button>
    </span>
  </dialog-model>
</template>

<script>
import api from '../api.js'
import DialogModel from '@/components/dialog-modal/index.vue'
import InputNumber from '@/components/input-number'
import PopConfirm from '@/components/pop-confirm'
export default {
  components: {
    DialogModel,
    InputNumber,
    PopConfirm
  },
  props: {
    id: {
      type: [Number, String],
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    sicknessTypeList: {
      type: Array,
      default: () => []
    },
    projectFunctionList: {
      type: Array,
      default: () => []
    },
    dataTypeList: {
      type: Array,
      default: () => []
    },
    settlementRuleList: {
      type: Array,
      default: () => []
    },
    vendorList: {
      type: Array,
      default: () => []
    },
    isAuditMap: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        sicknessType: '',
        projectFunction: '',
        dataType: '',
        companyIds: [],
        isAudit: '',
        settlementRulesIds: [],
        settlementRules: []
      },
      isSaving: false,
      rules: {
        sicknessType: [{required: true, message: '请选择项目标签', trigger: ['change']}],
        projectFunction: [{required: true, message: '请选择项目目标', trigger: ['change']}],
        dataType: [{required: true, message: '请选择数据类型', trigger: ['change']}],
        isAudit: [{required: true, message: '请选择是否审核', trigger: ['change', 'blur']}],
        companyIds: [{required: true, message: '请选择集团', trigger: ['change']}],
        settlementRulesIds: [{required: true, message: '请选择政策类型', trigger: ['change']}]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initForm(this.data)
      }
    },
    'form.settlementRulesIds'(codes) {
      if (!codes || !codes.length) return (this.form.settlementRules = [])
      const settlementRules = this.form.settlementRules
      const rules = codes.map((code) => {
        const hasSel = settlementRules.find((v) => v.code === code)
        if (hasSel) return hasSel
        const notSel = this.settlementRuleList.find((v) => v.code === code)
        if (notSel) return notSel
      })
      this.form.settlementRules = JSON.parse(JSON.stringify(rules)) // 深拷贝，避免修改元数组的值
    }
  },
  created() {},
  methods: {
    async initForm() {
      let data = {
        sicknessType: '',
        projectFunction: '',
        dataType: '',
        companyIds: [],
        isAudit: '',
        settlementRulesIds: [],
        settlementRules: []
      }
      if (this.id) {
        const res = await api.queryById({id: this.id}).catch((v) => {
          return this.$message.error('数据错误，请重试')
        })
        data = res.data || {}
        // 初始化政策类型的数据
        let {settlementRules = []} = data
        const settlementRulesIds = []
        settlementRules = settlementRules.map((v) => {
          settlementRulesIds.push(v.rule)
          const old = this.settlementRuleList.find((s) => s.code === v.rule) || {}
          return {...old, ...v}
        })
        data.settlementRulesIds = settlementRulesIds
        data.settlementRules = settlementRules
      }
      this.form = data
      this.$nextTick((v) => {
        this.$refs.formRef.clearValidate()
      })
    },

    deleteRule(code) {
      const i = this.form.settlementRulesIds.indexOf(code)
      i !== -1 && this.form.settlementRulesIds.splice(i, 1)
    },

    // 保存
    save() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.isSaving = true
        const {id, sicknessType, projectFunction, dataType, companyIds, isAudit, settlementRules = []} = this.form
        const res = await api
          .edit({
            id,
            sicknessType,
            projectFunction,
            dataType,
            companyIds,
            isAudit,
            settlementRules: settlementRules.map((v) => {
              return {rule: v.code, price: v.price, rate: v.rate}
            })
          })
          .finally(() => {
            this.isSaving = false
          })
        this.$message.success('保存成功')
        this.isSaving = false
        this.$emit('success', res)
      })
    },

    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.selttlement-config-add-container {
  width: 700px;
  // height: 80%;
  max-height: 600px;
  .el-dialog__body {
    padding: 10px 20px;
  }
  .upload-file-item {
    &.cannot-upload {
      .el-upload,
      .before-loading {
        display: none;
      }
    }
    .el-upload {
      position: relative;
    }
    .before-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 22;
      background: #fbfdff;
    }
  }
  .el-select {
    width: 100%;
  }

  .delete-icon {
    font-size: 18px;
    line-height: 32px;
    margin-left: 10px;
    color: red;
    cursor: pointer;
  }

  .settlement-item {
    .el-form-item__label {
      color: #3d98ad;
    }
  }
  .el-select .el-tag:not(:last-child) .el-select__tags-text,
  .el-select .el-tag:first-child .el-select__tags-text {
    max-width: 100%;
  }
}
</style>
