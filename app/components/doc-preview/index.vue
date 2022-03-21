<template>
  <dialog-modal
    :custom-class="`doc-preview-container ${isJPG ? 'img-container' : ''} ${isAutoHeight ? 'auto-height' : ''}`"
    :visible="dialogVisible"
    :modal-append-to-body="false"
    center
    nofooter
    :close-on-click-modal="true"
    @close="dialogVisible = false"
  >
    <!-- <div v-if="isPdf" id="pdfContainer" class="doc-content"></div> -->
    <div v-if="isJPG" class="img-content"><img ref="imgRef" :src="previewUrl" @load="handleImageOnload" /></div>
    <iframe v-if="isPdf || isExcel || isWord || isPpt" :src="previewUrl" width="100%" height="100%">对不起，您的浏览器版本不支持此文件的预览. 请您下载后查看: <a :href="url">下载</a> </iframe>
  </dialog-modal>
</template>

<script>
// import pdfjsLib from '@/../node_modules/pdfjs-dist/es5/build/pdf.js'
import DialogModal from '@/components/dialog-modal'
export default {
  components: {
    DialogModal
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      isAutoHeight: false
    }
  },
  computed: {
    lowerUrl() {
      return this.url ? this.url.toLowerCase() : ''
    },
    isExcel() {
      return this.lowerUrl.includes('.xls')
    },
    isWord() {
      return this.lowerUrl.includes('.doc')
    },
    isPdf() {
      return this.lowerUrl.includes('.pdf')
    },
    isPpt() {
      return this.lowerUrl.includes('.ppt')
    },
    isJPG() {
      return /.*\.(jp(e)?g|png)$/.test(this.lowerUrl)
    },
    previewUrl() {
      if (this.isPdf || this.isJPG) return this.url
      if (this.isExcel || this.isWord || this.isPpt) {
        const url = encodeURIComponent(this.url)
        return `https://view.officeapps.live.com/op/view.aspx?src=${url}`
      }
      return this.url
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      // if (val && this.isPdf) {
      //   this.$nextTick(v => {
      //     this.showPdf()
      //   })
      // }
    },
    dialogVisible(val) {
      this.$emit(val ? 'show' : 'hide')
    }
  },
  mounted() {},
  methods: {
    // showPdf() {
    //   this.$el.querySelector('#pdfContainer').innerHTML = ''
    //   const pdfPath = this.previewUrl
    //   pdfjsLib.GlobalWorkerOptions.workerSrc = '@/../public/lib/pdfjs-dist/pdf.worker.js' // 自己的路径
    //   const loadingTask = pdfjsLib.getDocument({
    //     url: pdfPath, // 网络地址
    //     // data: pdfData, // 二进制流数据
    //     // cMapUrl: '../web/cmaps/', // 字体路线
    //     cMapPacked: true
    //   })
    //   loadingTask.promise.then((pdf) => {
    //     const {
    //       _pdfInfo: {numPages}
    //     } = pdf
    //     for (let i = 1; i <= numPages; i++) {
    //       pdf.getPage(i).then((page) => {
    //         const scale = 1.5
    //         const viewport = page.getViewport({scale: scale})
    //         const canvas = document.createElement('canvas')
    //         const context = canvas.getContext('2d')
    //         canvas.height = viewport.height
    //         canvas.width = viewport.width
    //         const renderContext = {
    //           canvasContext: context,
    //           viewport: viewport
    //         }
    //         page.render(renderContext)
    //         this.$el.querySelector('#pdfContainer').appendChild(canvas)
    //       })
    //     }
    //   })
    // },
    handleImageOnload(image) {
      const {width, height} = this.$refs.imgRef
      this.isAutoHeight = height < width
      return true
    }
  }
}
</script>

<style lang="less">
.doc-preview-container {
  width: 80%;
  height: 80%;
  overflow: hidden;
  background: #222222;
  &.fit-container {
    width: fit-content;
    height: -webkit-fill-available;
    max-width: 80%;
    max-height: 80%;
  }
  &.img-container {
    width: fit-content;
    max-width: 80%;
    max-height: 80%;
    .el-dialog__body {
      width: auto;
      height: auto;
    }
  }
  &.auto-height {
    height: auto;
  }
  .el-dialog__header {
    padding: 0;
    font-size: 0;
  }
  .el-dialog__body {
    height: -webkit-fill-available;
    max-height: 100%;
    overflow: auto;
    padding: 0;

    img {
      width: auto;
      height: auto;
    }
  }
  .doc-content {
    display: flex;
    flex-direction: column;
  }
  .img-content {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
