<template functional>
  <el-dialog v-bind="data.attrs" class="dialog-modal" v-on="listeners" :append-to-body="true" :close-on-click-modal="false">
    <template v-if="!props.notitle" #title>
      <slot name="title">
        <div class="dialog-title">
          <img v-if="!props.nologo" class="log" :src="`/images/page/${props.isDark ? 'newlogo-white2x.png' : 'newlogo-dark2x.png'}`" alt="" />
          <span>{{ props.titleText || props.title }}</span>
        </div>
      </slot>
    </template>
    <slot></slot>
    <template v-if="!props.nofooter" #footer>
      <slot name="footer">
        <!-- 取消-->
        <el-button type="info" @click="props.handleCancel">取消</el-button>
        <!-- 确认-->
        <el-button type="primary" @click="props.handleSure">确认</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    /*
     * 是否展示logo，可以从localStorage或引入的文件中取值判定
     * */
    nologo: {
      type: Boolean,
      default: true
    },
    // 是否是黑色
    isDark: {
      type: Boolean,
      default: false
    },
    notitle: {
      type: Boolean,
      default: false
    },
    titleText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    nofooter: {
      type: Boolean,
      default: false
    },
    handleCancel: {
      type: Function,
      default: () => {}
    },
    handleSure: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style lang="less">
.dialog-modal {
  .el-dialog {
    display: flex;
    flex-direction: column;
  }
  .dialog-title {
    color: #333333;
    font-size: 18px;
    line-height: 32px;
    position: relative;
    img.log {
      width: 69px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .el-dialog__body {
    flex: 1;
    padding: 20px 20px;
    overflow: auto;
  }
  .el-dialog__footer {
    font-size: 0;
    border-top: 1px solid #eee;
    padding: 10px 20px;
    .el-button {
      width: 90px;
      height: 40px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
