import './index.less'
import api from '../api.js'
import commonApi from '@/api/common.api.js'

class CreateauditStepOne extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl('auditprojectc')
    this.app.header.changeselected(1)
    this.styleModel(1)

    const app = this.app

    new Vue({
      el: '#createauditProStepOne',
      data() {
        return {
          app,
          type: app.parpam.type, // 类型 new, edit, view
          id: app.parpam.projectid * 1, // 项目ID
          status: parseInt(app.parpam.status),
          groupList: [],
          projectForm: {
            segmentLayer: [7], // 分割层数
            projectTargetDesc: ''
          },
          rules: {
            name: [{ required: true, message: '请输入C端审核项目名称', trigger: ['blur', 'change'] }],
            remark: [{ required: true, message: '请输入C端审核项目描述', trigger: ['blur', 'change'] }],
            seriesImgFileType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
            auditType: [{ required: true, message: '请选择审核类型', trigger: 'change' }],
            segmentLayer: [{ required: true, message: '请选择分割层数', trigger: 'change' }]
          },
          sicknessTypeList: Tool.configxlkformat(app.constmap["SICKNESS_TYPE"]), // 项目标签
          projectFunctionList: Tool.configxlkformat(app.constmap["PROJECT_FUNCTION"]), // 项目目标
          projectTargetList: Tool.configxlkformat(app.constmap["AUDIT_PROJECT_TARGET"]), // 项目用途
          seriesImgFileTypeList: { 3: 'MPR', 6: '冠脉分割', 7: '冠脉狭窄', 8: '冠脉命名', 11: '冠脉斑块分割', 15: 'C端病理大图' }, // 目前支持的可选择的数据类型
          // 所有可选择的审核类型 key: 对应seriesImgFileType
          auditTypeMap: {
            3: { 1: '点位', 2: 'MASK单标', 7: 'MASK双标' },
            6: { 2: 'MASK单标', 3: 'MASK双标' },
            7: { 5: '点位' },
            8: { 4: '命名双审' },
            11: { 8: 'MASK双标' },
            15: { 6: '点位' }
          },
          segmentLayerList: [1, 2, 3, 4, 5, 6, 7], // 分割层数
          windowCodeList: [], // 所有可供选择的窗宽窗位
          docFileList: [] // 文档说明列表
        }
      },
      computed: {
        isView() {
          return this.type === 'view'
        },
        isStart() { // 已开启
          return this.status === 2
        },
        auditTypeSelList() { // 可选择的审核类型
          const { seriesImgFileType = 3 } = this.projectForm
          const list = this.auditTypeMap[seriesImgFileType] || {}
          if (Object.keys(list).length === 1) { // 如果只有一项，默认选中
            this.projectForm.auditType = Object.keys(list)[0]
          }
          return list
        }
      },
      created() {
        this.windowCodeList = Tool.configxlkformat(this.app.constmap["WINDOW"])
      },
      mounted() {
        this.id && this.queryAuditProjectDetail()
        this.queryProjectGroupList()
        this.queryDocFileList()
      },
      methods: {
        // 获取项目信息
        async queryAuditProjectDetail() {
          const res = await api.auditProjectRead({
            auditProjectId: this.id
          })
          const auditProjectDetail = res.data || {}
          auditProjectDetail.groupId = auditProjectDetail.groupId || undefined
          auditProjectDetail.seriesImgFileType += '' // Number -> String
          auditProjectDetail.auditType += '' // Number -> String
          const extendJson = auditProjectDetail.extendJson ? JSON.parse(auditProjectDetail.extendJson) : ''
          auditProjectDetail.segmentLayer = extendJson ? extendJson.segmentLayer || [] : [] // 默认[]

          this.projectForm = auditProjectDetail
        },
        handleSeriesImgFileTypeChange(seriesImgFileType) {
          this.$set(this.projectForm, 'auditType', '')
          const segmentLayer = this.projectForm.segmentLayer || ''
          if (Number(seriesImgFileType) === 6) { // 6: 冠脉分割
            this.$set(this.projectForm, 'segmentLayer', segmentLayer.length ? this.projectForm.segmentLayer : [7])
          } else {
            this.$set(this.projectForm, 'segmentLayer', '')
          }
        },
        // 获取群组下拉列表
        async queryProjectGroupList() {
          const res = await commonApi.groupSearch({
            page: 1
          })
          this.groupList = res.data.list || []
        },
        // 获取文档下拉列表
        async queryDocFileList(bizName = '') {
          const res = await commonApi.queryFileList({
            bizType: 'PATHOLOGY_PROJECT',
            bizName
          })
          this.docFileList = res.data || []
        },
        // 保存
        save() {
          this.$refs.auditProform.validate(async valid => {
            if (!valid) return
            const { name, remark, groupId, seriesImgFileType, auditType, segmentLayer, description, windowCode, bizFileId, sicknessType, projectFunction, projectTarget, projectTargetDesc } = this.projectForm
            const data = {
              name,
              remark,
              groupId,
              seriesImgFileType: +seriesImgFileType,
              auditType: +auditType,
              description,
              clientType: 2, // 1: B端 2: C端
              windowCode,
              bizFileId,
              sicknessType, // 项目标签
              projectFunction, // 项目目标
              projectTarget, // 项目用途
              projectTargetDesc // 其他用途
            }

            // 冠脉分割，存层数
            if (Number(seriesImgFileType) === 6) {
              data.extendJson = { segmentLayer }
            } else {
              data.extendJson = ''
            }

            if (this.type === 'new') {
              data.action = 1
            } else {
              data.action = 2
              data.auditProjectId = this.id
            }
            const res = await api.auditProjectEdit(data)
            // 跳转第二步
            this.app.changePage('createauditproc2', {
              type: 'edit',
              projectid: res.data ? res.data.auditProjectId : this.id,
              status: this.status
            })
          })
        }
      }
    })
  }
}

module.exports = CreateauditStepOne
