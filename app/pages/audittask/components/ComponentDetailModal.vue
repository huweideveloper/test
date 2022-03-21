<template>
  <el-dialog custom-class="component-info-wrapper" title="查看标注字段" :visible.sync="visible" :append-to-body="appendToBody" :show-close="false" :close-on-click-modal="false">
    <div v-if="componentType === 'text'">
      <i class="iconfont icon-wenbenkuang"></i>
      <span>文本框</span>
    </div>
    <div v-else-if="componentType === 'select'">
      <i class="iconfont icon-xialacaidan"></i>
      <span>下拉菜单</span>
    </div>
    <div v-else-if="componentType === 'radiobox'">
      <i class="iconfont icon-xuanzhong"></i>
      <span>单选框</span>
    </div>
    <div v-else-if="componentType === 'checkbox'">
      <i class="iconfont icon-duoxuankuang"></i>
      <span>复选组</span>
    </div>
    <div v-else-if="componentType === 'child_select'">
      <i class="iconfont icon-xialacaidan"></i>
      <span>二级下拉菜单</span>
    </div>
    <div>
      <p class="comp-item">{{componentTypeList[componentType]}}标题：{{componentName}}</p>
      <template v-if="componentType === 'text'">
        <p>文本类型：{{textTypeList[componentParameter.texttype]}}</p>
      </template>
      <template v-else>
        <div class="comp-item" v-for="(item, index) in componentData" :key="index">
          <span>选项{{index + 1}}：{{item.text}}</span>
          <span>默认值：{{item.code}}</span>
          <div v-if="item.child && item.child.length" class="child-content">
            <p class="comp-item" v-for="(citem, cindex) in item.child" :key="cindex">
              <span>> 选项{{cindex + 1}}：{{citem.text}}</span>
              <span>默认值：{{citem.code}}</span>
            </p>
          </div>
        </div>
        <p class="comp-item" v-if="componentType === 'checkbox'">
          <el-checkbox :checked="componentParameter.hasnull" disabled>是否设置“无”选项</el-checkbox>
          <span style="margin-left: 30px">此选项为互斥效果</span>
        </p>
        <p class="comp-item" v-else>
          <el-checkbox :checked="componentParameter.isdefault" disabled>是否要设置默认值</el-checkbox>
          <span style="margin-left: 30px">提示：设置的默认值是选项1</span>
        </p>
      </template>
    </div>
    <div style="margin-top: 30px">
      <span>标签：</span>
      <template v-if="componentTagList.length">
        <span v-for="item in componentTagList" :key="item.id" class="component-tag">{{item.text}}</span>
      </template>
      <template v-else>
        <span>暂无</span>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('update:visible', false)">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../api.js'

export default {
  name: 'ComponentDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    componentId: {
      type: Number,
      default: 0
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentType: '',
      componentName: '',
      componentParameter: {},
      componentData: [],
      componentTypeList: [],
      componentTagList: []
    }
  },
  watch: {
    async visible(val) {
      if (!val) return
      this.textTypeList = { 'text': '文本型', 'num': '数字型' }
      this.componentTypeList = { 'text': '文本框', 'select': '下拉菜单', 'radiobox': '单选框', 'checkbox': '复选组' }
      const res = await api.viewComponentDetail({
        id: this.componentId
      })
      const { type, name, parameter, data, tagList } = res.data || {}
      this.componentType = type
      this.componentName = name
      parameter && (this.componentParameter = JSON.parse(parameter))
      data && (this.componentData = JSON.parse(data))
      this.componentTagList = tagList || []
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
  .component-info-wrapper {
    .el-dialog__body {
      max-height: 378px;
      padding: 0 10px 10px;
      overflow-y: auto;
      .iconfont {
        color: #4c9fa9;
      }
      .comp-item {
        margin-top: 20px;
        & > span {
          min-width: 300px;
        }
      }
      .child-content {
        padding-left: 20px;
        color: #999;
      }
      .component-tag {
        border: 1px solid red;
        border-radius: 4px;
        padding: 0 10px;
      }
    }
  }
</style>
