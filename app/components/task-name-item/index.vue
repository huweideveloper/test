<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="basic-info-content" :label-width="`${labelWidth}px`" label-suffix="：">
    <el-row>
      <!-- 标注-数据来源+算法目的+数据量（病理需要写阴阳各多少）+任务开启日期 -->
      <el-col :span="4" :style="`width: ${labelWidth + 100}px; margin: 0 5px 0 0;`">
        <el-form-item :label="labelName || '任务名称'" prop="type">
          <el-input v-model="ruleForm.type" placeholder="任务类型" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4" style="width: 155px; margin: 0 10px 0 5px;">
        <el-form-item label="" prop="dataSource" label-width="0px">
          -<el-input v-model="ruleForm.dataSource" placeholder="数据来源" style="width: 140px; margin: 0 0 0 5px;" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="width: 140px; margin-right: 10px;">
        <el-form-item label="" prop="algorithmPurpose" label-width="0px">
          <el-input v-model="ruleForm.algorithmPurpose" placeholder="算法目的" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="width: 140px; margin-right: 10px;">
        <el-form-item label="" prop="dataCount" label-width="0px">
          <el-input v-model="ruleForm.dataCount" :placeholder="`${dataCountLabel}`" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="width: 140px; margin-right: 10px;">
        <el-form-item label="" prop="startDate" label-width="0px">
          <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="开启日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" style="width: 140px;" clearable></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    projectDetail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: Number,
      default: 110
    },
    labelName: {
      type: String,
      default: '任务名称'
    },
    typeName: {
      type: String,
      default: '标注'
    },
    dataCountLabel: {
      type: String,
      default: '数据量'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ruleForm: {
        type: this.typeName,
        dataSource: '',
        algorithmPurpose: '',
        dataCount: '',
        startDate: ''
      },
      rules: {
        type: [{required: true, message: '请输入任务类型', trigger: ['change', 'blur']}],
        dataSource: [{required: true, message: '请输入数据来源', trigger: ['change', 'blur']}],
        algorithmPurpose: [{required: true, message: '请输入算法目的', trigger: ['change', 'blur']}],
        dataCount: [
          {required: true, message: `请输入${this.dataCountLabel}`, trigger: ['change', 'blur']},
          {
            validator: (rule, val, callback) => {
              if (this.projectDetail.seriesImgFileType === 15 && !/[阴阳]/.test(val)) {
                // 15：C端病理大图
                return callback(new Error('病理大图请输入阴阳个数'))
              }
              return callback()
            }
          }
        ],
        startDate: [{required: true, message: '请选择开启日期', trigger: ['change', 'blur']}]
      }
    }
  },
  computed: {
    nameData() {
      const {type, dataSource, algorithmPurpose, dataCount, startDate} = this.ruleForm
      return `${type}-${dataSource}${algorithmPurpose}${dataCount}-${startDate}`
    }
  },
  watch: {
    nameData: {
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    validateForm(cb) {
      let data = this.ruleForm
      this.$refs.ruleForm.validate((val) => {
        if (!val) data = false
      })
      cb && cb(data)
      return data
    }
  }
}
</script>

<style lang="less"></style>
