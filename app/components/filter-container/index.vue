<template>
  <div class="comp-filter-container">
    <div class="title-wrapper" v-if="!!title">
      <span class="title">{{ title }}</span>
      <span :class="`more ${isMore ? '' : 'unfold'}`" @click="handleClickMore">{{ isMore ? '收起' : '展开' }}</span>
    </div>
    <div v-if="isMore" class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isMore: true
    }
  },
  methods: {
    handleClickMore() {
      this.isMore = !this.isMore
    }
  }
}
</script>
<style lang="less">
.comp-filter-container {
  background: #fff;
  padding: 0px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-top: -10px;
  .title-wrapper {
    .title {
      font-size: 16px;
      color: #333;
    }
    .more {
      float: right;
      color: #999;
      cursor: pointer;
      &::after {
        content: '';
        display: inline-block;
        height: 10px;
        width: 10px;
        border-width: 0 1px 1px 0;
        border-color: #999;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform-origin: center;
        transition: transform 0.3s;
        margin-left: 8px;
        vertical-align: top;
      }
    }
    .unfold:after {
      transform-origin: center;
      transform: rotate(-135deg);
      transition: transform 0.3s;
      vertical-align: middle;
    }
  }

  .el-row {
    display: flex;
    align-items: center;
  }
  .el-input,
  .el-select,
  .el-cascader {
    width: 95%;
  }
  .el-range-separator {
    width: unset;
  }

  .el-form-item {
    display: flex;
    margin-bottom: 10px;
    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;
      .el-form-item {
        margin-bottom: 0;
        line-height: 34px;
      }
    }
  }
  // 用于一项里有多个输入框，通过百分比设置form-item的宽度
  .el-form-item-inline {
    > .el-form-item__content {
      font-size: 0; // 间距设置为0
      .el-form-item {
        display: inline-block;
      }
    }
  }

  .content-wrapper {
    padding: 10px;
    // .el-row {
    //   .el-col {
    //     &:nth-child(3) {
    //       .el-form-item {
    //         float: none;
    //         justify-content: center;
    //       }
    //     }
    //   }
    // }
  }
  .el-button {
    padding: 8px 20px;
  }
}
</style>
