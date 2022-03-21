<template>
  <dialog-model custom-class="account-manage-adduser-container" :title="form.id ? '编辑文档' : '创建文档'" :visible="visible" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="文档名称" prop="bizName">
            <el-input v-model="form.bizName" :minlength="1" :maxlength="20" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上传附件" prop="attachments">
        <el-upload
          ref="uploadFileRef"
          class="upload-file-item"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          :class="{'cannot-upload': form.attachments && form.attachments.length >= 1}"
          :action="uploadAction"
          :auto-upload="false"
          :data="{bizType: 'PATHOLOGY_PROJECT', bizName: form.bizName}"
          :headers="{accessToken}"
          :file-list="fileList"
          :on-change="beforeUpload"
          :on-success="handleSuccess"
          list-type="picture-card"
        >
          <!-- :before-upload="beforeUpload" -->

          <!-- 添加图片+ -->
          <div class="before-loading" @click="handleClickAddUpload">
            <i class="el-icon-loading" v-if="beforeUploading"></i>
            <i slot="default" class="el-icon-plus" v-if="!beforeUploading"></i>
          </div>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="getFileUrl(file)" alt="" />
            <!-- 进度条 -->
            <el-progress v-if="file.status === 'uploading'" type="circle" :stroke-width="6" status="success" :percentage="parsePercentage(file.percentage)"></el-progress>
            <span class="el-upload-list__item-actions">
              <span v-if="form.id" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!form.id" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" class="el-upload__tip">支持上传PDF/PPT/DOC/DOCX文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="save" :loading="isSaving">确 定</el-button>
    </span>
    <!-- 预览文档弹框 -->
    <doc-preview :visible="dialogDocVisible" :url="docPreviewUrl" @hide="dialogDocVisible = false"></doc-preview>
  </dialog-model>
</template>

<script>
import api from '../api.js'
import DialogModel from '@/components/dialog-modal/index.vue'
import DocPreview from '@/components/doc-preview/index.vue'

const pdfImg = require('../../../../images/doc/icon-pdf.png')
const pptImg = require('../../../../images/doc/icon-ppt.png')
const wordImg = require('../../../../images/doc/icon-word.png')

export default {
  components: {
    DialogModel,
    DocPreview
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pdfImg,
      form: {},
      oldCompanyIdList: [],
      isSaving: false,
      rules: {
        bizName: [{required: true, message: '请输入文档名称', trigger: ['change', 'blur']}],
        attachments: [{required: true, message: '请选择附件', trigger: ['change']}]
      },
      // 文件上传相关
      uploadAction: api.fileUploadUrl(),
      accessToken: window.localStorage.accessToken,
      fileList: [],
      dialogFileUrl: '',
      dialogDocVisible: false, // 文档预览
      beforeUploading: false,
      isUploading: false,
      docPreviewUrl: ''
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
    initForm(data) {
      const doc = data || {}
      const {id, fileName, bizName, urlWan} = doc
      this.fileList = id ? [{id, name: fileName, url: urlWan}] : []
      this.form = {
        id: id || '',
        bizName: bizName || '',
        attachments: id ? [id] : [] // 上传附件
      }
    },

    getFileUrl(file) {
      const name = file.name
      if (!name) return ''
      if (name.includes('.pdf')) return pdfImg
      else if (name.includes('.ppt')) return pptImg
      else if (name.includes('.doc')) return wordImg
      else return file.url
    },

    // 保存
    save() {
      this.$refs.formRef.validate(async (valid) => {
        this.isSaving = true
        if (!valid) {
          this.isSaving = false
          return
        }
        if (this.form.id){
          const { id, bizName } = this.form
          const res = await api.updateJyBizFileResource({ id, bizName })
          this.handleSuccess(res)
        } else {
          this.$refs.uploadFileRef.submit()
        }

      })
    },

    handleClose() {
      // this.dialogImageVisible = false
      this.$emit('hide-modal')
    },

    /************** 文件上传相关 ************/
    handleClickAddUpload() {
      this.beforeUploading = true
    },
    // 上传文件-之前
    beforeUpload(file) {
      const isRightFile = /.*\.(pdf|ppt|pptx|doc|docx)$/.test(file.name.toLocaleLowerCase())
      if (!isRightFile) {
        this.$message.error('文件格式错误，只支持PDF/PPT/DOC/DOCX格式文件')
      }
      // const isLt10M = file.size / 1024 / 1024 < 10
      // if (!isLt10M) {
      //   this.$message.error('上传文件大小不超过10M')
      // }
      const canUpload = isRightFile // && isLt10M
      this.isUploading = canUpload
      this.beforeUploading = false

      if (canUpload) {
        this.form.attachments = [file.uid]
      } else {
        this.fileList = []
      }
      return canUpload
    },
    // 提交成功
    handleSuccess(res, file) {
      this.isSaving = false
      if (res.code === 0) {
        this.form.attachments = [res.id]
        this.$emit('save-success', res)
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove(file) {
      this.$refs.uploadFileRef.handleRemove(file)
      this.form.attachments = [] // 改变attachments
    },

    // 查看文档
    handlePictureCardPreview(file) {
      console.log(file);
      const { name, url } = file
      const isPdf = /.*\.(pdf)$/.test(name.toLocaleLowerCase())
      this.docPreviewUrl = isPdf ? this.getDownloadUrl(name, url) : url
      this.dialogDocVisible = true
    },

    // 因为pdf不能直接通过urlWan访问，所有重新调用接口处理流信息
    getDownloadUrl(name, url) {
      return `${api.fileDownloadUrl()}?fileName=${name}&fileUrl=${encodeURIComponent(url)}&accessToken=${this.accessToken}`
    },

    parsePercentage(val) {
      return parseInt(val, 10)
    }
  }
}
</script>

<style lang="less">
.account-manage-adduser-container {
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
}
</style>
