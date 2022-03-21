<template>
  <dialog-model custom-class="selttlementstatics-edit-container" title="编辑结算配置" :visible="visible" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单价调整系数" prop="priceCoefficient">
            <input-number v-model="form.priceCoefficient" placeholder="请输入单价调整系数" :precision="2" clearable> </input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <!-- 政策类型提示 -->
          <el-popover popper-class="info-popper-tip" placement="right" width="400" trigger="hover">
            <div>
              <div class="tip-item" v-for="item in settlementRuleList" :key="item.code">
                <span class="code-item">{{ item.code }}</span
                ><span class="title">{{ `：${item.name}` }}</span>
                <p>说明：{{ `${item.desc}` }}</p>
              </div>
            </div>
            <span slot="reference" class="selttlement-tip">结算政策说明: <i class="el-icon-info info-tip"></i></span>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="整体调整额" prop="totalPriceOffset">
            <input-number v-model="form.totalPriceOffset" placeholder="请输入整体调整额" :precision="2" negative clearable></input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, i) in form.settlementInfoRules" :key="`${item.code}${i}`">
        <el-col :span="12">
          <el-form-item class="settlement-item" :label="item.name" :prop="`settlementInfoRules.${i}.price`" :rules="[{required: true, message: '请输入单价', trigger: ['blur', 'change']}]">
            <input-number v-model="item.price" placeholder="请输入单价" :precision="6" clearable>
              <div slot="append">元</div>
            </input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="正确率"
            :prop="`settlementInfoRules.${i}.accuracy`"
            label-width="80px"
            :rules="[
              {required: true, message: '请输入正确率', trigger: ['blur', 'change']},
              {
                validator: (rule, value, callback) => {
                  validateNumberLang(rule, value, callback)
                },
                trigger: ['blur', 'change']
              }
            ]"
          >
            <input-number v-model="item.accuracy" placeholder="请输入正确率（0-1的数字）" :precision="2" clearable> </input-number>
          </el-form-item>
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
    taskId: {
      type: [Number, String],
      default: null
    },
    userId: {
      type: [Number, String],
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    settlementRuleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        priceCoefficient: '', // 单位调整系数
        totalPriceOffset: '', // 整体调整系数
        settlementInfoRules: []
      },
      isSaving: false,
      rules: {
        companyIds: [{required: true, message: '请选择集团', trigger: ['change']}]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initForm(this.data)
      }
    }
  },
  created() {},
  methods: {
    validateNumberLang(rule, value, callback) {
      if (value < 0 || value > 1) return callback(new Error('请输入0-1的数字'))
      return callback()
    },
    async initForm() {
      let data = {
        priceCoefficient: 1,
        totalPriceOffset: 0,
        settlementInfoRules: []
      }
      const {taskId, userId} = this
      if (taskId && userId) {
        const res = await api.querySettlementDetail({taskId, userId}).catch((msg) => {
          return this.$message.error(msg || '数据错误，请重试')
        })
        data = res.data || {}
        // 初始化政策类型的数据
        let {priceCoefficient = 1, totalPriceOffset = 0, settlementInfoRules = []} = data
        settlementInfoRules = settlementInfoRules.map((v) => {
          const old = this.settlementRuleList.find((s) => s.code === v.rule) || {}
          return {...old, ...v}
        })
        data.settlementInfoRules = settlementInfoRules
        data.priceCoefficient = priceCoefficient
        data.totalPriceOffset = totalPriceOffset
      }
      this.form = data
      this.$nextTick((v) => {
        this.$refs.formRef.clearValidate()
      })
    },

    // 保存
    save() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.isSaving = true
        const {priceCoefficient = 1, totalPriceOffset, settlementInfoRules = []} = this.form
        const res = await api
          .editSettlement({
            taskId: this.taskId,
            userId: this.userId,
            priceCoefficient,
            totalPriceOffset: totalPriceOffset || 0,
            settlementInfoRules: settlementInfoRules.map((v) => {
              return {rule: v.code, price: v.price, accuracy: v.accuracy}
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
.selttlementstatics-edit-container {
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
  .selttlement-tip {
    font-size: 12px;
    color: #999;
  }
  .info-tip {
    font-size: 16px;
    color: red;
    margin-left: 6px;
    cursor: pointer;
  }
}
</style>
