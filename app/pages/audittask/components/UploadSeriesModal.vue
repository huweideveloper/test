<template>
  <el-dialog custom-class="upload-series-wrapper" title="上传标注影像序列" :visible.sync="visible" :close-on-click-modal="false" :show-close="false">
    <el-row style="margin: 12px 0">
      <el-checkbox v-model="isJumpChecked">是否跳过已审核序列</el-checkbox>
    </el-row>
    <el-row>
      <el-input
        type="textarea"
        :rows="13"
        placeholder="请输入标注影像序列号"
        v-model="seriesStr">
      </el-input>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleHideDialog">取消</el-button>
      <pop-confirm title="添加序列后，征像信息需要重新选择，请确认是否继续？" placement="top" @onconfirm="handleAddSeries">
        <el-button slot="reference" type="primary" size="medium">一键添加</el-button>
      </pop-confirm>
    </div>
  </el-dialog>
</template>

<script>
import api from '../api.js'
import PopConfirm from '@/components/pop-confirm/index.vue'

export default {
  name: 'UploadSeriesModal',
  components: {
    PopConfirm
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isJumpChecked: true,
      seriesStr: ''
    }
  },
  watch: {
    async visible(val) {
      if (!val) return
      this.seriesStr = ''
    }
  },
  methods: {
    handleHideDialog() {
      this.$emit('update:visible', false)
    },
    async handleAddSeries() {
      if (!this.seriesStr || !this.seriesStr.trim()) return this.$message.warning('请输入标注影像序列号')
      const seriesInstanceUidList = this.seriesStr.split('\n')
      const res = await api.addAuditTaskSeries({
        taskId: this.taskId,
        isJumpChecked: this.isJumpChecked,
        seriesInstanceUidList,
        useCallerHandler: true // 此接口报错功能层不处理，让调用方自行处理
      })
      const { code, msg, data } = res
      if (code === 0) {
        this.$message.success(data)
        // this.$parent.queryAuditTaskToolComp()
        this.$emit('success')
        this.handleHideDialog()
      } else {
        this.$alert(`<pre>${msg}</pre>`, '提示', {
          dangerouslyUseHTMLString: true
        })
      }
    }
  }
}
</script>

<style lang="less">
  .upload-series-wrapper {
    width: 900px;
    max-height: 510px;
    .el-dialog__body {
      padding: 0 10px 10px;
    }
  }
</style>
