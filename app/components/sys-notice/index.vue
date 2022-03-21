<template>
  <transition appear name="slide">
    <div class="sys-notice-container" v-if="visible">
      <i class="iconfont icon-bingzaotishi"></i>
      <span class="content" :title="content">{{content}}</span>
      <i class="el-icon-close" @click="visible = false"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SysNotice',
  inject: ['sysNotice'],
  data() {
    return {
      visible: false,
      content: ''
    }
  },
  created() {
    if (!this.sysNotice) return
    const { remark } = this.sysNotice.children[0] || {}
    const { content } = JSON.parse(remark)
    if (!content) return
    this.content = content
    this.visible = true
  }
}
</script>

<style lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .sys-notice-container {
    height: 40px;
    background-color: #FFFBE6;
    border: 1px solid #FFE58F;
    border-radius: 4px;
    padding: 10px 10px 10px 16px;
    .icon-bingzaotishi {
      vertical-align: 4px;
      font-size: 14px;
      color: #FAAD14;
    }
    .content {
      max-width: 1170px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: rgba(0,0,0,0.65);
    }
    .el-icon-close {
      float: right;
      cursor: pointer;
      padding-top: 2px;
    }
  }
</style>
