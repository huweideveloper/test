import './index.less'
import commonApi from '@/api/common.api.js'
import api from '../api.js'
import InputNumber from '@/components/input-number/index.vue'
import ComponentDetailModal from '../components/ComponentDetailModal.vue'
import SelectSeriesModal from '../components/SelectSeriesModal.vue'
import CheckSeriesModal from '../components/CheckSeriesModal.vue'
import UploadSeriesModal from '../components/UploadSeriesModal.vue'
import SelectComponentModal from '../components/SelectComponentModal.vue'
import SelectedComponentModal from '../components/SelectedComponentModal.vue'

class CreateauditStepTwo extends Interstellar.pagesBase {
  complete() {
    const app = this.app

    app.header.openControl('audittaskc')
    app.header.changeselected(2)
    this.styleModel(1)

    const { type, taskid, projectid, status } = app.parpam // 类型 new, edit, view

    new Vue({
      el: '#auditTaskStepTwo',
      components: {
        InputNumber,
        ComponentDetailModal,
        SelectSeriesModal,
        CheckSeriesModal,
        UploadSeriesModal,
        SelectComponentModal,
        SelectedComponentModal
      },
      data() {
        const matchRate = { 7: '中心距离与平均长度阈值', 15: '矩形匹配系数' }
        const consistencyRate = { 7: '较短与较长病灶阈值' }
        const validateMatchCoefficient = (rule, value, callback) => {
          const type = +this.projectInfo.seriesImgFileType
          const rate1 = matchRate[type] || '方体匹配系数'
          const rate2 = consistencyRate[type] || '一致性阈值'
          if (value && parseFloat(value) > 100) {
            callback(new Error(`${rate1}不超过100%`))
          } else if (value && parseFloat(value) > this.auditTaskForm.consistencyRatePercent) {
            callback(new Error(`${rate1}不大于${rate2}`))
          } else {
            callback()
          }
        }
        const validateConsistencyRate = (rule, value, callback) => {
          const type = +this.projectInfo.seriesImgFileType
          const rate1 = matchRate[type] || '方体匹配系数'
          const rate2 = consistencyRate[type] || '一致性阈值'
          if (value && parseFloat(value) > 100) {
            callback(new Error(`${rate2}不超过100%`))
          } else if (value && parseFloat(value) < this.auditTaskForm.matchCoefficient) {
            callback(new Error(`${rate2}不小于${rate1}`))
          } else {
            callback()
          }
        }
        return {
          isJysEnv: process.env.APP_ENV === 'jys', // 是否是技研所的环境
          isMASKAudit: false, // 是否是MASK审核
          isAuditConsistency: false, // 是否勾选需要审核满足一致性病灶
          selectSeriesModalVisible: false, // 添加标注影像弹窗是否显示
          checkSeriesModalVisible: false, // 查看标注影像弹窗是否显示
          uploadSeriesModalVisible: false, // 复制粘贴上传标注影像弹窗是否显示
          componentDetailModalVisible: false, // 是否弹窗展示组件明细
          selectComponentModalVisible: false, // 是否弹窗展示所有组件列表
          auditTaskForm: {
            matchCoefficient: '', // 方体匹配系数
            consistencyRatePercent: '' // 一致性阈值
          },
          projectInfo: {}, // 项目信息
          rules: {
            matchCoefficient: [
              { validator: validateMatchCoefficient, trigger: ['blur', 'change'] }
            ],
            consistencyRatePercent: [
              { validator: validateConsistencyRate, trigger: ['blur', 'change'] }
            ],
          },
          currentTaskid: Number(taskid), // 当前任务id
          currentProjectId: Number(projectid), // 当前项目id
          currentComponentId: 0, // 要查看的控件id
          // 征象选择部分
          toolType: '',
          allIntersectComponentList: [], // 所有的交集征象列表
          selectedIntersectComponentList: [], // 已选择的交集征象列表
          extraComponentList: [], // 额外征象列表
          // C端病理大图的所有病灶
          lesionComponentList: [],
          activeLesion: '0',
          selectTabComponentModalVisible: false,
          allTabIntersectComponentList: [], // 所有交集征象列表
          selectedTabExtraComponentList: [], // 额外征象列表
          // 大征象标注
          selectSeriesComponentModalVisible: false,
          allSeriesIntersectComponentList: [], // 所有交集征象列表
          selectedSeriesExtraComponentList: [], // 选择的大征象列表
          viewSeriesComponentModalVisible: false,

        }
      },
      computed: {
        seriesImgFileType() {
          return this.projectInfo.seriesImgFileType
        },
        auditType() {
          return this.projectInfo.auditType
        }
      },
      created() {
        this.canEdit = type !== 'view' && +status === 1
        this.initData()
      },
      methods: {
        async initData() {
          const res = await commonApi.queryProjectBasicInfo({
            id: projectid
          })
          this.projectInfo = res.data || {}
          const { clientType, auditType, seriesImgFileType } = res.data || {}
          this.isMASKAudit = clientType === 2 && [2, 3, 4, 7].includes(auditType) // clientType 2.C端项目; auditType 2: MASK单标 3: MASK双标, 4: '命名双审' 7: mpr-MASK双标
          auditType !== 4 && this.queryAuditTaskToolComp() // auditType：不是4命名双审，才需要去查询接口
          if (auditType === 4) {
            this.toolType = '冠脉命名'
          }
          // 如果是11: 冠脉斑块分割, 15：C端病理大图则查询所有病灶
          if ([11, 15].includes(seriesImgFileType)) {
            this.queryAuditTaskLesionComponentData()
          }
        },
        async queryAuditTaskToolComp() {
          const res = await api.queryAuditTaskToolComp({
            taskId: taskid
          })
          const { componentList, auditConsistency, matchRate, consistencyRate, type } = res.data || {}
          if (type) {
            // const toolTypeList = Tool.configxlkformat(app.constmap.TOOL_TYPE)
            const toolTypeList = { 'C_DAUBER': 'C端涂抹', 'FREEHAND': '自由画笔' } // 目前只有这两个工具的展示，纯展示
            // const { val } = toolTypeList.find(({ idx }) => idx === type) || {}
            this.toolType = toolTypeList[type]
          }
          const tempAuditProjectCompList = componentList || [] // 病灶征象列表(包括所有交集征象和已选择的额外征象)
          const selectedIntersectComponentList = []
          // 下面两个list需清空，SelectSeriesModal子组件里面会有调用就重复添加了
          this.extraComponentList = []
          this.allIntersectComponentList = []
          tempAuditProjectCompList.forEach(item => {
            const { componentId, checked, extend } = item
            if (extend) {
              this.extraComponentList.push(item)
            } else {
              this.allIntersectComponentList.push(item)
              checked && selectedIntersectComponentList.push(componentId)
            }
          })
          this.selectedIntersectComponentList = selectedIntersectComponentList
          if (this.isMASKAudit) return
          this.isAuditConsistency = auditConsistency
          this.auditTaskForm.matchCoefficient = matchRate ? Tool.divide(matchRate, 100) : undefined
          this.auditTaskForm.consistencyRatePercent = consistencyRate ? Tool.divide(consistencyRate, 100) : undefined

        },
        // 15:C端病理大图时，查询所有病灶信息
        async queryAuditTaskLesionComponentData() {
          const res = await api.queryAuditTaskLesionComponent({ taskId: taskid })
          const { auditLesionVoList, seriesComponentList } = res.data
          // 设置病灶列表
          const list = auditLesionVoList || []
          list.forEach((lesion) => {
            const { formComponentList = [] } = lesion
            lesion.selectAndSetCheckList = formComponentList ? formComponentList.filter(v => !v.extend) : []
            const andSetList = lesion.selectedAndSetComponentList = []
            const extraList = lesion.selectedExtraComponentList = []
            formComponentList && formComponentList.forEach(v => {
              v.checked && !v.extend && andSetList.push(v.id)
              v.extend && extraList.push(v)
            })
          })
          this.lesionComponentList = list
          // 设置大征象
          const seriesCompList = seriesComponentList || []
          this.selectedSeriesExtraComponentList = seriesCompList

        },
        deleteExtraComponent(index) {
          this.extraComponentList.splice(index, 1)
        },
        async viewComponentDetail(componentId, id) {
          this.currentComponentId = componentId || id
          this.componentDetailModalVisible = true
        },
        toSelectSeries() {
          this.selectSeriesModalVisible = true
        },
        handleAddSeriesSuccess() {
          this.reloadData() // 重新加载数据
        },
        toCheckSeries() {
          this.checkSeriesModalVisible = true
        },
        handleDeleteSeriesSuccess() {
          this.reloadData() // 重新加载数据
        },
        toUploadSeries() {
          this.uploadSeriesModalVisible = true
        },
        handleUploadSeriesSuccess() {
          this.reloadData() // 重新加载数据
        },
        toAddComp() {
          this.selectComponentModalVisible = true
        },
        receiveCompsData(componentList) {
          componentList.forEach(item => {
            const isExist = this.extraComponentList.findIndex(({ componentId, id }) => id === item.id || componentId === item.id)
            isExist === -1 && this.extraComponentList.push(item)
          })
        },

        // 根据不同类型重新加载数据
        reloadData() {
          const { seriesImgFileType } = this.projectInfo
          if ([11, 15].includes(seriesImgFileType)) { // 11: 冠脉斑块分割, 15：C端病理大图
            this.queryAuditTaskLesionComponentData()
          } else {
            this.queryAuditTaskToolComp()
          }
        },

        // C端病理大图，添加额外征象
        toAddCompByTab() {
          const i = +this.activeLesion
          const { selectAndSetCheckList: andSetlist, selectedExtraComponentList: extraList } = this.lesionComponentList[i]
          this.allTabIntersectComponentList = andSetlist
          this.selectedTabExtraComponentList = extraList
          this.selectTabComponentModalVisible = true
        },
        receiveCompsDataByTab(componentList) {
          const i = +this.activeLesion
          const extraComponentList = this.lesionComponentList[i].selectedExtraComponentList
          componentList.forEach(item => {
            const isExist = extraComponentList.findIndex(({ id }) => id === item.id)
            isExist === -1 && extraComponentList.push(item)
          })
        },
        deleteExtraComponentByTab(index) {
          const i = +this.activeLesion
          const extraComponentList = this.lesionComponentList[i].selectedExtraComponentList
          extraComponentList.splice(index, 1)
        },

        // 添加大征象组件
        toAddCompBySeries() {
          this.selectSeriesComponentModalVisible = true
        },

        // 保存后对调
        receiveCompsDataBySeries(componentList) {
          this.selectedSeriesExtraComponentList = componentList
          this.selectSeriesComponentModalVisible = false
          this.viewSeriesComponentModalVisible = false
        },

        // 查看已添加大征象标注组件
        toViewSelectedSeriesComp() {
          this.viewSeriesComponentModalVisible = true
        },

        async save() {
          if (this.isMASKAudit) {
            let formComponentIdList = this.selectedIntersectComponentList
            const tempExtraComponentList = this.extraComponentList
            if (tempExtraComponentList && tempExtraComponentList.length) {
              formComponentIdList = formComponentIdList.concat(tempExtraComponentList.map(({ componentId, id }) => componentId || id))
            }
            const requestParams = {
              taskId: taskid,
              formComponentIdList,
            }
            await api.createAuditTaskToolComp(requestParams)
            this.goNextStep()
          } else if ([11, 15].includes(this.projectInfo.seriesImgFileType)) { // 11: 冠脉斑块分割, 15：C端病理大图
            this.$refs.auditTaskForm.validate(async valid => {
              if (!valid) return
              const { matchCoefficient } = this.auditTaskForm
              const requestParams = {
                taskId: taskid,
                matchRate: matchCoefficient ? Tool.multiply(100, matchCoefficient) : 0,
                lesionVoList: this.lesionComponentList.map(({ lesion, colour, selectedAndSetComponentList: andSetList, selectedExtraComponentList: extraList }) => {
                  const formComponentIdList = Array.from(new Set([...andSetList, ...extraList.map(v => v.id)]))
                  return {
                    lesion,
                    colour,
                    formComponentIdList: formComponentIdList.length ? formComponentIdList : null
                  }
                }),
                seriesComponentList: this.selectedSeriesExtraComponentList.map(({ id, required = false }) => {
                  return { componentId: id, required }
                })
              }
              await api.saveAuditTaskLesionComponent(requestParams)
              this.goNextStep()
            })
          } else {
            this.$refs.auditTaskForm.validate(async valid => {
              if (!valid) return
              const { isAuditConsistency, selectedIntersectComponentList } = this
              const { matchCoefficient, consistencyRatePercent } = this.auditTaskForm
              const requestParams = {
                taskId: taskid,
                isAuditConsistency,
                formComponentIdList: selectedIntersectComponentList,
                matchRate: matchCoefficient ? Tool.multiply(100, matchCoefficient) : 0
              }
              // 技研所的才提交一致性阈值, 7：冠脉狭窄
              if (this.isJysEnv || this.projectInfo.seriesImgFileType === 7) {
                requestParams.consistencyRate = consistencyRatePercent ? Tool.multiply(100, consistencyRatePercent) : 0
              }
              // 7：冠脉狭窄 保存征象数据
              if (this.projectInfo.seriesImgFileType === 7) {
                let formComponentIdList = this.selectedIntersectComponentList
                const tempExtraComponentList = this.extraComponentList
                if (tempExtraComponentList && tempExtraComponentList.length) {
                  formComponentIdList = formComponentIdList.concat(tempExtraComponentList.map(({ componentId, id }) => componentId || id))
                }
                requestParams.formComponentIdList = formComponentIdList
              }
              await api.createAuditTaskToolComp(requestParams)
              this.goNextStep()
            })
          }
        },
        goNextStep() {
          // 跳转第三步
          app.changePage('createaudittaskc3', {
            type: 'edit',
            taskid,
            projectid,
            status: 1
          })
        }

      }
    })
  }
}

module.exports = CreateauditStepTwo
