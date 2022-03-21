<template>
  <div class="anno-item-list-container">
    <el-form ref="annoListForm" :model="ruleForm" label-width="160px">
      <el-form-item label="影像标注 (病灶类型）" prop="selectItems" :rules="[{required: true, message: '请选择病灶类型', trigger: ['blur', 'change']}]">
        <el-cascader
          v-model="ruleForm.selectItems"
          placeholder="请选择病灶类型"
          :options="annoTypeOptions"
          :props="{multiple: true, value: 'value', label: 'name', children: 'childImageAnnos'}"
          :disabled="allDisabled"
          @change="handleAnnoTypeChange"
        >
          <template slot-scope="{node, data}">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.childImageAnnos.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-switch v-model="ruleForm.isExpanded" active-text="全部展开" inactive-text="全部收缩"> </el-switch>
      <el-collapse v-model="ruleForm.activeNames">
        <el-collapse-item v-for="(item, index) in ruleForm.annoItemList" :key="`${item.type}${index}`" :title="`${item.name}（${item.children.length}）`" :name="`${index + 1}`">
          <el-row v-for="(anno, n) in item.children" :key="anno.type">
            <el-col :span="4">
              <el-input v-model="anno.name" readonly></el-input>
            </el-col>
            <el-col :span="2">
              <el-form-item
                label=""
                label-width="0px"
                :prop="`annoItemList.${index}.children.${n}.colour`"
                :rules="[
                  {
                    validator: (rule, value, callback) => {
                      validateColourUnique(rule, value, callback, index, n)
                    },
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-color-picker v-model="anno.colour" :disabled="allDisabled" @change="(val) => handleChangeColour(val, index, n)"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="病灶工具"
                label-width="80px"
                :prop="`annoItemList.${index}.children.${n}.toolList`"
                :rules="[{required: true, message: '请选择病灶工具', trigger: ['blur', 'change']}]"
              >
                <el-select v-model="anno.toolList" filterable multiple placeholder="请选择病灶工具" clearable :disabled="allDisabled">
                  <el-option v-for="opt in annoToolOptions" :key="opt.idx" :label="opt.val" :value="opt.idx"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <i v-if="!allDisabled" class="iconfont icon-shanchu" title="删除此病灶" @click="handleDeleteItem(anno.type, item.type)"></i>
              <el-dropdown v-if="!allDisabled || (anno.annotationItemList && anno.annotationItemList.length)" trigger="click" @command="handleAnnoCommand">
                <i class="iconfont icon-caozuo" title="添加标注组件"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="!allDisabled" :command="{type: 'add', data: {n1: index, n2: n}}">添加标注组件</el-dropdown-item>
                  <el-dropdown-item v-if="anno.annotationItemList && anno.annotationItemList.length" :command="{type: 'show', data: {n1: index, n2: n}}">查看标注组件</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import {Message} from 'element-ui'
import api from '../api.js'
export default {
  inject: ['app'],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    annoDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      annoTypeOptions: [], // 病灶类型选项
      annoToolOptions: [], // 病灶工具下拉列表
      annoTypeMap: {}, // 病灶类型的map{'ANN03': {name: "骨折点", value: "ANNO1", colour: null, childImageAnnos: []}}
      seriesImgFileType: '', // 项目选择的数据类型

      ruleForm: {
        isExpanded: true, // 是否全部展开
        activeNames: [],
        selectItems: [],
        annoItemList: [] // 所有病灶 [{id, name, children: [{id, name, type, tooList} ...] ...]
      },
      errColoueField: []
    }
  },
  computed: {
    allDisabled() {
      return this.annoDisabled || this.seriesImgFileType === '9'
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initData()
      }
    },
    'ruleForm.isExpanded'(val) {
      this.handleExpanded()
    },
    'ruleForm.annoItemList': {
      deep: true,
      handler(val) {
        const list = []
        val &&
          val.length &&
          val.map((v) => {
            list.push(...v.children)
          })
        this.$emit('input', list)
      }
    }
  },

  created() {
    this.initOptions()
  },
  methods: {
    async initOptions() {
      // 病灶工具
      const toolTypeList = Tool.configxlkformat(this.app.constmap.TOOL_TYPE)
      this.annoToolOptions = toolTypeList
      // 病灶类型
      const res = await api.queryAnnoList()
      const list = res.data ? res.data.list || [] : []
      // 删除childImageAnnos为空的，否则还会有箭头显示
      this.annoTypeOptions = list.map((v) => {
        !v.childImageAnnos || (!v.childImageAnnos.length && delete v.childImageAnnos)
        return v
      })
      // 初始化annoTypeMap
      this.initAnnoTypeMap(this.annoTypeOptions, this.annoTypeMap)
      this.initData()
    },
    initData() {
      if (!Object.keys(this.annoTypeMap).length) return
      const selectItems = [] // 所有选择的type，[["ANNO1"], ["ANNO8", "ANNO9"]], 有一级和二级
      const dataMap = {} // 一级对象
      // 初始化selectItems
      const data = this.clone(this.data)
      data.forEach((v) => {
        const {id, type, colour, toolList, annotationItemList} = v
        const item = this.annoTypeMap[type]
        const selItem = item.parent ? [item.parent.type, type] : [type]
        selectItems.push(selItem)
        dataMap[type] = v
      })
      // 更新this.ruleForm.annoItemList
      this.handleAnnoTypeChange(selectItems)
      // 初始化数据：将data里的数据放到annoItemList中
      this.ruleForm.annoItemList.forEach((v) => {
        v.children &&
          v.children.forEach((o) => {
            const {id, type, colour, toolList, annotationItemList} = dataMap[o.type]
            o.id = id
            o.colour = colour
            o.toolList = toolList.map((t) => t.type)
            o.annotationItemList = annotationItemList
          })
      })
    },
    // 初始化annoTypeMap
    initAnnoTypeMap(list, map, parent) {
      for (let i = 0; i < list.length; i++) {
        const v = list[i]
        v.childImageAnnos && v.childImageAnnos.length && this.initAnnoTypeMap(v.childImageAnnos, map, v)
        parent && (v.parent = {type: parent.value, name: parent.name})
        const {id, name, value, colour, parent: par} = v
        map[v.value] = {id, name, type: value, colour, parent: par}
      }
    },
    // 展开或者收缩病灶
    handleExpanded() {
      const {isExpanded} = this.ruleForm
      const activeNames = []
      if (isExpanded) {
        for (let i = 0; i < this.ruleForm.annoItemList.length; i++) {
          activeNames.push(`${i + 1}`)
        }
      }
      this.ruleForm.activeNames = activeNames
    },
    // 修改了病灶类型，同时更新annoItemList  sels: [["ANNO1"], ["ANNO8", "ANNO9"]], 有一级和二级
    handleAnnoTypeChange(sels, isUseOldData = true) {
      this.ruleForm.selectItems = sels
      const olist = this.ruleForm.annoItemList
      const newlist = []
      const list = sels.forEach((v) => {
        const isChild = v.length === 2
        const type = isChild ? v[1] : v[0]
        const item = this.annoTypeMap[type]
        // 如果原来已经有的，用原来的
        let osel = {}
        const oselParent = olist.find((o) => o.type === v[0])
        if (isUseOldData && oselParent && oselParent.children) osel = oselParent.children.find((o) => o.type === type)
        const obj = {
          id: null,
          name: item.name,
          type: item.type,
          colour: item.colour,
          toolList: [],
          annotationItemList: [],
          ...osel
        }

        // 分组
        const curParent = newlist.find((o) => o.type === v[0])
        let parent = curParent
        if (!parent) {
          const parentItem = this.annoTypeMap[v[0]]
          parent = {name: parentItem.name, type: parentItem.type, children: []}
          newlist.push(parent)
        }
        parent.children.push(obj)
      })
      // children排序
      newlist.forEach((v) => {
        v.children &&
          v.children.sort((a, b) => {
            return a.type.localeCompare(b.type, 'zh-CN', {numeric: true})
          })
      })

      this.ruleForm.annoItemList = newlist
      this.handleExpanded()
    },

    // 删除一个病灶
    handleDeleteItem(value, parentValue) {
      const isChild = parentValue !== value
      const list = this.ruleForm.selectItems.filter((v) => {
        if (isChild) {
          // 比较第二个值
          return v.length <= 1 || v[1] !== value
        } else {
          return v[0] !== value
        }
      })
      this.handleAnnoTypeChange(list)
    },

    // 获取当前的保存数据
    getFormData() {
      let subData = []
      this.$refs.annoListForm.validate((valid) => {
        if (!valid) {
          Message.closeAll()
          this.$message.error('请先完善数据')
          subData = false
          return
        }
        const list = this.ruleForm.annoItemList
        const oldData = this.getOldMapData()
        // action: 1: 新增 , 2: 修改, 3: 删除
        list.forEach((v) => {
          const children = v.children || []
          children.forEach((o) => {
            const {id, name, type, colour, toolList: toolArr, annotationItemList: annoList} = o
            // 设置toolList的action
            const toolList = []
            toolArr.forEach((t) => {
              const toolType = t
              const item = oldData[type] ? oldData[type].toolsMap[toolType] : null
              toolList.push({
                action: item && item.id ? 2 : 1,
                id: item && item.id ? item.id : '',
                type: toolType
              })
              // 删除选择的项，剩下的就是要删除的 action = 3
              item && delete oldData[type].toolsMap[toolType]
            })
            // 设置annotationItemList的action
            // const annotationItemList = []
            // annoList.forEach((t) => {
            //   const { type: annoType } = t
            //   const item = oldData[type] ? oldData[type].annosMap[annoType] : null
            //   annotationItemList.push({
            //     action: item && item.id ? 2 : 1,
            //     id: item ? item.id : '',
            //     type: annoType
            //   })
            //   // 删除选择的项，剩下的就是要删除的 action = 3
            //   item && delete oldData[type].annosMap[annoType]
            // })

            const annotationItemList = annoList.map(function(val, idx) {
              if (val.action !== 3) {
                val.action = val.id ? 2 : 1
              }
              return {
                id: val.id,
                formComponentId: val.formComponentId,
                action: val.action,
                sequence: (idx + 1) * 10,
                optional: val.optional,
                alias: val.alias
              }
            })

            // 添加删除的项
            if (oldData[type]) {
              const {toolsMap, annosMap} = oldData[type]
              for (const toolType in toolsMap) {
                const tool = toolsMap[toolType]
                tool &&
                  tool.id &&
                  toolList.push({
                    action: 3,
                    id: tool.id,
                    type: tool.type
                  })
              }
              // for (const annoType in annosMap) {
              //   const anno = annosMap[annoType]
              //   anno &&
              //     anno.id &&
              //     annotationItemList.push({
              //       action: 3,
              //       id: anno.id,
              //       type: anno.type
              //     })
              // }
            }

            const action = !oldData[type] ? 1 : 2
            const tid = oldData[type] ? oldData[type].id : ''
            subData.push({action, id: tid, name, type, colour, toolList, annotationItemList})
            oldData[type] && delete oldData[type]
          })
        })
        // 删除的anno
        for (const otype in oldData) {
          const oitem = this.data.find((v) => v.type === otype)
          const item = this.clone(oitem)
          const {toolList, annotationItemList} = item
          toolList && toolList.length && toolList.forEach((t) => (t.action = 3))
          annotationItemList && annotationItemList.length && annotationItemList.forEach((t) => (t.action = 3))
          item && subData.push({...item, action: 3})
        }
      })
      return subData
    },
    // 将this.data构造成map对象 {'ANNO1': {id: '', type: 'ANNO1', toolsMap: { 'POLYGON': [{ type: 'POLYGON', toolList: []}] }, annosMap: {'': [{}]}}}
    getOldMapData(type) {
      const oldList = this.clone(this.data)
      const annos = {}
      oldList.forEach((v) => {
        const {id, toolList, annotationItemList} = v
        const toolsMap = {}
        const annosMap = {}
        toolList &&
          toolList.forEach((t) => {
            toolsMap[t.type] = t
          })
        annotationItemList &&
          annotationItemList.forEach((t) => {
            annosMap[t.type] = t
          })
        annos[v.type] = {id, toolsMap, annosMap}
      })
      return annos
    },

    // 添加和查看标注信息
    handleAnnoCommand(common) {
      const {type, data} = common
      if (type === 'add') {
        if (this.annoDisabled) return
        this.$emit('add-anno', data)
      } else {
        this.$emit('show-anno', data)
      }
    },

    // 更新标注组件annotationItemList
    updateAnnotationItemList(list, {n1, n2}) {
      const {annoItemList} = this.ruleForm
      const item = annoItemList[n1].children[n2]
      if (!item) return
      item.annotationItemList = list
    },

    resetDataBySeriesImgFileType(seriesImgFileType) {
      this.seriesImgFileType = seriesImgFileType
      if (seriesImgFileType === '9') {
        // 9：随访配准
        const selectItems = [['ANNO3']] // 只能选择肺结节：ANNO3+长方体：CUBOID，不可编辑
        this.handleAnnoTypeChange(selectItems)
        // 初始化数据：将data里的数据放到annoItemList中
        this.ruleForm.annoItemList.forEach((v) => {
          v.children &&
            v.children.forEach((o) => {
              o.colour = ''
              o.toolList = ['CUBOID'] // 长方体
              o.annotationItemList = []
            })
        })
      }
    },
    // 改变颜色，验证同级下的其他颜色
    handleChangeColour(val, index, n) {
      const list = this.ruleForm.annoItemList[index].children
      const validFields = []
      const len = list.length
      for (let i = 0; i < len; i++) {
        validFields.push(`annoItemList.${index}.children.${i}.colour`)
      }
      this.$refs.annoListForm.validateField(validFields)
    },
    // 验证颜色唯一
    validateColourUnique(rule, value, callback, index, n) {
      if (value) {
        const list = this.ruleForm.annoItemList[index].children
        const data = list.filter((v, i) => v.colour === value)
        if (data && data.length > 1) {
          return callback(new Error('颜色重复'))
        }
      }
      return callback()
    },
    // 返回annoItemList数据
    getAnnoItemList() {
      return this.ruleForm.annoItemList || []
    },
    // 克隆
    clone(obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
</script>

<style lang="less">
.anno-item-list-container {
  padding: 20px;
  border: 1px solid #eee;
  .el-cascader {
    width: 100%;
  }
  .el-collapse {
    border: 1px dashed #e8e8e8;
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding: 0 20px;
      color: #448e97;
      background: #f8fafb;
    }
    .el-collapse-item__content {
      padding: 10px 20px;
      .el-input__inner,
      .el-color-picker__trigger {
        height: 34px !important;
        line-height: 34px !important;
      }
      .el-select {
        width: 100%;
      }
      .iconfont {
        margin-left: 10px;
      }
    }
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  // disabled
  .el-select .el-tag .el-select__tags-text,
  .el-select .el-tag .el-select__tags-text {
    max-width: 100% !important;
  }
  // .el-input.is-disabled .el-input__inner {
  //   background-color: #fff;
  // }
}
</style>
