import AnnoItemList from '@/pages/createpro/step2/anno-item-list.vue'
class createprotwo extends Interstellar.pagesBase {
  complete() {
    this.projectType =
      window.location.hash.indexOf("createprotwo") !== -1 ? 1 : 3
    if (this.projectType === 1) {
      this.app.header.openControl("projectmanage")
    } else {
      this.app.header.openControl("backflowproject")
    }
    this.yymcdata = [
      {
        val: "",
        idx: ""
      }
    ]
    this.app.header.changeselected(2)
    this.styleModel(1)
    this.dropobj = {}
    this.type = this.app.parpam.type
    this.projectId = this.app.parpam.projectid * 1
    this.status = this.app.parpam.status
    this.clickTime = 0
    this.hasSeries = false
    // 初始化Vue相关
    this.initVuePage()

    this.loadmodule()
    //数据绑定
    if (this.type == "new") {
      if (!this.app.session.get("data_1")) {
        this.app.changePage("createproone", { type: "new" })
        return
      }
      this.dom.find(".export").remove()
    } else {
      if (!this.projectId || !this.type) {
        this.app.changePage("projectmanage")
        return
      }
    }

    this.model._event._addEvent("componentdata.change", async () => {
      this.app.loading.show()
      let res = await this.api.querycomponent(
        this.model.getData("componentdata")
      )
      this.app.loading.hide()
      if (res.code == 0) {
        this.addcomponent.setMain(true, res)
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    })
    this.model._event._addEvent("discurddata.change", async () => {
      this.app.loading.show()
      let res = await this.api.dict_root_child(
        this.model.getData("discurddata")
      )
      this.app.loading.hide()
      if (res.code == 0) {
        res.data[0].children = res.data[0].children.filter(item => {
          return item.value != 98 && item.value != 99
        })
        this.discurdreason.setMain(true, res.data[0].children)
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    })
    this.model._event._addEvent("apiData.change", () => {
      this.app.session.set("data_2", JSON.stringify(this.model.apiData))
    })
    if (this.type !== "new") {
      this.series_count()
    }
    //按钮事件
    this.btnEvent()
  }

  getSegmentLayerList(){
    const value = "HEART_SEGMENT_LABEL_NAME_CONFIG";
    const config = this.app.constmap["SINGLE_CONFIG"];
    if( !config || !Array.isArray(config.children)  ) return [];
    const item = config.children.find(item=> item.value === value);
    if( !item ) return [];
    const labelNames = JSON.parse(item.remark).labelNames;
    return labelNames;
  }

  // Vue相关
  initVuePage() {
    const that = this
    this.vuePage = new Vue({
      el: '#createproTwo',
      provide: { app: that.app },
      components: {
        AnnoItemList
      },
      data() {
        return {
          id: that.projectId,
          type: that.type,
          status: that.status,
          projectData: {},
          imageAnnotationListInitData: [], // 初始化的imageAnnotationList数据
          annoListIndex: { n1: 0, n2: 0 }, // 当前操作的annoList的下标，二维数组的下标 n1: 一级，n2：二级
          annoDisabled: false, // 是否不可编辑
          segmentLayerList: that.getSegmentLayerList(),// ['左心室', '左心房', '右心室', '右心房', '主动脉', '左室壁', '冠脉'], // 分割层数选项
          ruleForm: {
            sicknessType: undefined, // 项目标签
            projectFunction: undefined, // 项目目标
            projectTarget: undefined, // 项目用途
            projectTargetDesc: undefined, // 其他用途
            seriesImgFileType: '',
            segmentLayer: [],
            type2: 1, // 是否审核项目 1:否 2:是
          },
          rules: {
            segmentLayer: [{ required: true, message: '请选择分割层数', trigger: 'change' }]
          },
          sicknessTypeList: Tool.configxlkformat(that.app.constmap["SICKNESS_TYPE"]), // 项目标签
          projectFunctionList: Tool.configxlkformat(that.app.constmap["PROJECT_FUNCTION"]), // 项目目标
          projectTargetList: Tool.configxlkformat(that.app.constmap["ANNO_PROJECT_TARGET"]), // 项目用途
        }
      },
      computed: {
        isView() {
          return this.type === 'view'
        },
        isStart() { // 已开启
          return Number(this.status) === 2
        },
      },
      created() { },
      methods: {
        // 初始化数据
        setProjectData(data = {}) {
          this.projectData = data || {}
          this.imageAnnotationListInitData = this.projectData.imageAnnotationList || []
          const extendJson = data.extendJson ? JSON.parse(data.extendJson) : '' // 层数父节点
          this.ruleForm = Object.assign(this.ruleForm, {
            seriesImgFileType: data.seriesImgFileType,
            segmentLayer: extendJson ? extendJson.segmentLayer || [] : [] // 分割层数默认[]
          })
        },
        setProjectBasicData(data) {
          this.ruleForm = Object.assign(this.ruleForm, {
            sicknessType: data.sicknessType, // 项目标签
            projectFunction: data.projectFunction, // 项目目标
            projectTarget: data.projectTarget, // 项目用途
            projectTargetDesc: data.projectTargetDesc, // 其他用途
            type2: data.type2
          })
        },
        // 当数据类型修改时
        handleSeriesImgFileTypeChange(seriesImgFileType) {
          this.$set(this.ruleForm, 'seriesImgFileType', seriesImgFileType)

          // 改变分割层数segmentLayer
          const segmentLayer = this.ruleForm.segmentLayer || ''
          if (Number(seriesImgFileType) === 6) { // 6：冠脉分割
            this.$set(this.ruleForm, 'segmentLayer', segmentLayer.length ? this.ruleForm.segmentLayer : [7])
          } else {
            this.$set(this.ruleForm, 'segmentLayer', '')
          }

          // 改变影像标注相关
          this.resetImageAnnotationListBySeriesImgFileType(seriesImgFileType)
        },
        // 返回表单数据
        getFormData() {
          let data = false
          this.$refs.ruleForm.validate(valid => {
            if (valid) (data = this.ruleForm)
          })
          return data
        },

        /************ 影像标注相关 ***********/
        // 返回列表的annoItemList，二维的数据[{type: '', children: {type: '', ...}, ...}]
        getImageAnnoItemList() {
          return this.$refs.annoListForm.getAnnoItemList() || []
        },
        // 显示新增标注组件弹窗
        handleShowAddAnnoModal({ n1, n2 }) {
          this.annoListIndex = { n1, n2 }
          that.chooseComponent("", { n1, n2 })
        },
        // 显示标注组件详情弹窗
        handleShowDetailAnnoModal({ n1, n2 }) {
          this.annoListIndex = { n1, n2 }
          that.showytjComponent("", { n1, n2 })
        },
        // 更新标注组件数据
        updateAnnotationItemList(val) {
          this.$refs.annoListForm.updateAnnotationItemList(val, this.annoListIndex)
        },
        // 获取影像标注的所有数据
        getAnnoFormData() {
          return this.$refs.annoListForm.getFormData()
        },
        // 设置影像标注为disabled
        setAnnoListDisabled(bool) {
          this.annoDisabled = bool
        },
        // 影像标注根据类型重置数据, 改变ImageAnnotation，选择9：随访配准后，只能选择肺结节+长方体，不可编辑
        resetImageAnnotationListBySeriesImgFileType(seriesImgFileType) {
          this.$refs.annoListForm.resetDataBySeriesImgFileType(seriesImgFileType)
        },
      }
    })
  }

  //查询数仓的聚合条件
  async field_query() {
    let res = await this.api.field_query({
      service: "DR",
      method: "/v1/sys/field/query",
      params: {}  
    })
    res.data.forEach(v => {
      v.val = v.fieldName
      v.idx = v.fieldName
      v.props = v.fieldType
    })
    this.conditions = res.data
    let projectGroup = require("../modules/projectGroupSet/projectGroupSet.js")
    this.projectGroupSet = this.app.loadModule(
      projectGroup,
      this.dom.find(".groupSet"),
      { conditions: this.conditions }
    )
  }
  //查询项目下序列数
  async series_count(change) {
    this.app.loading.show()
    let res = await this.api.series_count({ projectId: this.projectId })
    this.app.loading.hide()
    this.hasSeries = res.data.count > 0
  }
  // 查询某科室下所有的项目群组
  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      category: this.model.apiData.category,
      name: groupName,
      page: 1
    })
    let temparr = data.list.map(val => {
      return {
        idx: val.id,
        val: val.name
      }
    })
    this.dropobj["groupId"].renderHtml(temparr)
    if (groupName) return
    setTimeout(() => {
      this.dom.find(".inputLine .groupId .icon-shanchutishiicon").click() // 清除右侧项目群组字段已选的值
      if (this.projectDetail2 && this.projectDetail2.groupId) { // 如是编辑进来需默认选中之前的选择项
        this.dom.find('.groupId .option[data-idx="' + this.projectDetail2.groupId + '"]').click()
      }
    }, 20)
  }
  //点击事件
  btnEvent() {
    let that = this
    //设置默认分配下载数量：
    this.dom.find(".apidata").on("change", function() {
      if (ES.selctorDoc(this).attr("api") !== null) {
        let keyname = ES.selctorDoc(this).attr("api")
        that.model.apiData[keyname] = parseInt(
          ES.selctorDoc(this)
            .val()
            .trim()
        )
        that.model.setData("apiData", that.model.apiData)
      }
    })
    //是否设置窗宽窗位
    this.dom.find(".widthlevelset .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.dom.find(".windowId").addClass("hide")
        that.model.apiData.windowCode = ""
        that.model.apiData.window = null
        that.model.setData("apiData", that.model.apiData)
      } else {
        dom.addClass("choose")
        that.dom.find(".windowId").removeClass("hide")
      }
    })
    //是否设置vr默认窗宽窗位
    this.dom.find(".widthlevelset1 .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false
      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.dom.find(".windowId1").addClass("hide")
        that.model.apiData.vrWindowCode = ""
        that.model.setData("apiData", that.model.apiData)
      } else {
        dom.addClass("choose")
        that.dom.find(".windowId1").removeClass("hide")
      }
    })
    //是否需要超大图
    this.dom.find(".largeFigure .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.model.apiData.largeFigure = false
        that.model.setData("apiData", that.model.apiData)
      } else {
        dom.addClass("choose")
        that.model.apiData.largeFigure = true
        that.model.setData("apiData", that.model.apiData)
      }
    })
    // 是否需要阴阳性
    this.dom.find(".isYayAttributes .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (dom.hasClass("choose")) {
        that.model.apiData.isYayAttributes = false
        that.dom.find(".choosearea").addClass("hide")
        dom.removeClass("choose")
      } else {
        that.model.apiData.isYayAttributes = true
        that.dom.find(".choosearea").removeClass("hide")
        dom.addClass("choose")
      }
      let choosedom = that.dom.find(".isYayAttributes .choosearea .choose")
      if (choosedom.dom) {
        let length = choosedom.dom.length
        if (length == 2) {
          that.model.apiData.yayAttributes = 4
        } else {
          if (choosedom.parent().attr("data-id") == 1) {
            that.model.apiData.yayAttributes = 1
          } else {
            that.model.apiData.yayAttributes = 3
          }
        }
      } else {
        that.model.apiData.yayAttributes = 2
      }
      that.model.setData("apiData", that.model.apiData)
    })
    //是否需要图文报告
    this.dom.find(".isLungPdf .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.model.apiData.isLungPdf = false
        that.model.setData("apiData", that.model.apiData)
      } else {
        dom.addClass("choose")
        that.model.apiData.isLungPdf = true
        that.model.setData("apiData", that.model.apiData)
      }
    })
    //是否需要展示报告
    this.dom.find(".showReport .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.model.apiData[dom.parent().attr("type")] = false
        that.model.setData("apiData", that.model.apiData)
      } else {
        dom.addClass("choose")
        that.model.apiData[dom.parent().attr("type")] = true
        that.model.setData("apiData", that.model.apiData)
      }
    })
    //是否需要以检查号级别进行标注
    this.dom.find(".marktypeset .check-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      // 是否disabled
      const isDisabled = dom.hasClass('disabled')
      if (isDisabled) return false

      if (that.hasSeries && that.clickTime !== 0) {
        that.app.alert.show({
          title: " ",
          msg: "项目下已存在序列，请先跳转至第三步删除所有序列。",
          close: true,
          footer: true
        })
      } else {
        that.clickTime++
        let dom = ES.selctorDoc(this)
        if (dom.hasClass("choose")) {
          dom.removeClass("choose")
          that.model.apiData.studyAnno = false
          that.model.setData("apiData", that.model.apiData)
        } else {
          dom.addClass("choose")
          that.model.apiData.studyAnno = true
          that.model.setData("apiData", that.model.apiData)
        }
      }
    })
    //是否需要以检查号级别进行标注
    this.dom.find(".category .radio-box").on("click", function() {
      that.dom.find(".category .choose").removeClass("choose")
      ES.selctorDoc(this).addClass("choose")
      that.model.apiData.category =
        ES.selctorDoc(this)
          .parent()
          .attr("data-id") * 1
      that.model.setData("apiData", that.model.apiData)
      that.queryProjectGroupList()
    })

    // 校验是否需要图文报告isLungPdf，只有数据类型为MPR、聚合方式为序列号、检查号，工具为方体、且固定小征象必填才能选择
    const checkIsLungPdf = (data) => {
      const isLungPdf = data.isLungPdf
      if (!isLungPdf) return true
      const { seriesImgFileType, aggreConditions, imageAnnotationList } = data
      // 数据类型为MPR
      if (seriesImgFileType !== 3) return false
      // 聚合方式为序列号、检查号
      const hasInstanceUID = aggreConditions.find(v => v.field === 'seriesInstanceUID' || v.field === 'studyInstanceUID')
      if (!hasInstanceUID) return false
      // 工具为方体、且选择了固定小征象
      if (!imageAnnotationList || !imageAnnotationList.length) return false
      // 配置的固定小征象
      const annoItem = this.app.constmap['PN_ANNO_ITEM'] || {}
      const annoItemList = annoItem.children || []
      const requireItemIds = {}
      annoItemList.map(v => {
        const remark = JSON.parse(v.remark)
        remark && remark.id && (requireItemIds[remark.id] = true)
      })
      for (let i = 0; i < imageAnnotationList.length; i++) {
        const v = imageAnnotationList[i];
        // 影像标注工具
        const toolList = v.toolList || []
        const hasCUBOID = toolList.find(t => t.action !== 3 && t.type === 'CUBOID') // 选择了长方体
        if (!hasCUBOID) break
        // 验证是否已经选择了配置的固定小征象
        const annotationItemList = v.annotationItemList || []
        const requiredIds = { ...requireItemIds }
        annotationItemList.forEach(anno => {
          anno.action < 3 && requiredIds[anno.formComponentId] && (delete requiredIds[anno.formComponentId])
        })
        if (!Object.keys(requiredIds).length) return true
      }
      return false
    }
    //保存
    this.dom.find(".save").on("click", async function() {
      let isReady = true // 数据是否验证成功
      let data = JSON.parse(JSON.stringify(that.model.apiData))
      data.type = that.projectType
      data.name = JSON.parse(that.app.session.get("data_1")).name
      data.bizFileId = JSON.parse(that.app.session.get("data_1")).bizFileId // 说明文档
      data.remark = JSON.parse(that.app.session.get("data_1")).remark
      data.remarkFileUrl = JSON.parse(
        that.app.session.get("data_1")
      ).remarkFileUrl
      data.id = that.type != "new" ? that.projectId : null
      data.action = that.type != "new" ? 2 : 1
      data.seriesList = []
      let temparr = []
      let tempstr = ""
      if (data.annotationItemList) {
        data.annotationItemList.forEach(function(val, idx) {
          if (val.action !== 3) {
            val.action = val.id ? 2 : 1
          }
          let obj = {
            id: val.id,
            formComponentId: val.formComponentId,
            action: val.action,
            sequence: (idx + 1) * 10,
            optional: val.optional,
            alias: val.alias
          }
          temparr.push(obj)
        })
        data.annotationItemList = temparr
      }

      if (data.discardList) {
        data.discardList.forEach(function(val, idx) {
          tempstr += val.value + ","
        })
        data.discardCodeList = tempstr
      }
      delete data.discardList
      if (data.window) {
        data.windowCode = JSON.parse(data.window).value
      }

      // 获取vueForm的数据
      const formData = that.vuePage.getFormData()
      if (formData === false) isReady = false
      // 影像标注数据
      data.imageAnnotationList = that.vuePage.getAnnoFormData()
      if (data.imageAnnotationList === false) isReady = false // 数据未填写完整

      that.dom.find(".inputLine:not(.justToJudge)").dom.forEach(val => {
        val.find("." + val.attr("redlabel")).removeClass("redborder")
        val.find(".required").remove()
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          if (val.find("." + val.attr("redlabel"))) {
            val.find("." + val.attr("redlabel")).addClass("redborder")
          }
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
              Tool.checkForm(ES.selctorDoc(val).dom, "red") +
              "</span>"
            )
        }
      })
      if (
        that.dom.find(".redborder").dom &&
        that.dom.find(".redborder").dom.some(val => {
          return !val.parent().hasClass("hide")
        })
      ) {
        return false
      } else {
        if (that.type != "view") {
          data.aggreConditions = []
          let st = true
          let str = ""
          const tempProjectGroupSet = that.projectGroupSet
          tempProjectGroupSet && tempProjectGroupSet.liArr && tempProjectGroupSet.liArr.map((val, index) => {
            // if (val.type == 'LOGICAL_TIME' && (val.limitTime == '' || val.limitTime == null || val.limitTime == undefined)) {
            //     tempProjectGroupSet.timeError(index)
            //     st = false
            //     return
            // }
            if (str.lastIndexOf(val.field) !== -1) {
              tempProjectGroupSet.errorShow("聚合条件设置重复")
              st = false
              isReady = false
            }
            str += "," + val.field + ","
            if (!val.delete || val.delete !== 2) {
              delete val.delete
              data.aggreConditions.push(val)
            }
          })
          if (!st) {
            isReady = false
          }

          if (!isReady) return

          const { seriesImgFileType, segmentLayer, sicknessType, projectFunction, projectTarget, projectTargetDesc, type2 } = formData
          if (Number(seriesImgFileType) === 6) {
            data.extendJson = { segmentLayer } // 分割层数
          } else {
            data.extendJson = ''
          }
          Object.assign(data, {
            sicknessType, // 项目标签
            projectFunction, // 项目目标
            projectTarget, // 项目用途
            projectTargetDesc, // 其他用途
            type2 // 是否审核项目
          })

          // 校验是否需要图文报告isLungPdf
          const isOk = checkIsLungPdf(data)
          if (!isOk) {
            that.app.alert.show({
              title: " ",
              msg: "该项目设置不支持图文报告，请检查数据类型、聚合条件、工具类型、病灶征象等相关信息",
              close: true,
              footer: true
            })
            return
          }

          that.app.loading.show()
          let res = await that.api.editproject(data)
          that.app.loading.hide()
          if (res.code == 0) {
            that.app.changePage(
              that.projectType == 1 ? "createprothree" : "createbackflowpro3",
              {
                type: "edit",
                projectid: res.data.id ? res.data.id : that.projectId,
                status: this.status
              }
            )
            that.app.session.del("data_2")
            that.app.session.del("ischanged")
          } else if (res.code == 401) {
            that.app.alert.show({
              title: " ",
              msg: "项目名称已存在",
              close: true,
              footer: true
            })
          } else {
            Tool.errorshow(res.msg, that.app)
          }
        }
      }
    })
    //添加整体病症标注组件
    this.dom.find(".alldata").on("click", function() {
      that.chooseComponent("all")
    })
    //查看已添加整体病症标注组件
    this.dom.find(".showalldata").on("click", function() {
      that.showytjComponent("all")
    })
    //导出标注组件
    this.dom.find(".export").on("click", function() {
      let url =
        that.app.domain1 +
        "v1/project/component/export?projectId=" +
        that.projectId
      Tool.downfile(url, that.app)
    })
    //添加废片原因
    this.dom.find(".discardreason").on("click", function() {
      that.choosediscurdreason()
    })
    // 查看添加的废片原因
    this.dom.find(".viewreason").on("click", function() {
      that.showdiscurdreason()
    })
  }
  //加载各个模块
  loadmodule() {
    let dropConfig = [
      {
        name: "yblx",
        className: "xlk",
        firstSelect: { val: "样本类型", idx: "" },
        data: Tool.configxlkformat(this.app.constmap["MODALITY"])
      },
      {
        name: "windowId",
        className: "xlk",
        firstSelect: { val: "", idx: "" },
        data: Tool.configxlkformat(this.app.constmap["WINDOW"])
      },
      {
        name: "windowId1",
        className: "xlk",
        firstSelect: { val: "", idx: "" },
        data: Tool.configxlkformat(this.app.constmap["WINDOW"])
      },
      {
        className: "xlk",
        name: "seriesImgFileType",
        firstSelect: { val: "", idx: "" },
        data: (() => {
          let xlk = [
            { val: "非原始数据", idx: "1" },
            { val: "原始数据", idx: "2" },
            { val: "MPR", idx: "3" },
            { val: "动脉瘤", idx: "4" },
            { val: "肝肿瘤", idx: "5" },
            { val: "冠脉分割", idx: "6" },
            { val: "冠脉狭窄", idx: "7" },
            { val: "冠脉命名", idx: "8" } // 也叫MASK跑算法
          ]
          if (this.projectType === 1) { // 标注项目管理
            xlk.push({ val: "随访配准", idx: "9" })
          }
          xlk = [
            ...xlk,
            { val: "脑血管分割", idx: "10" },
            { val: "冠脉斑块分割", idx: "11" },
            { val: "脑中线", idx: "12" },
            { val: "脑动脉瘤", idx: "13" },
            { val: "肺气道", idx: "14" },
            { val: "C端病理大图", idx: "15" },
            { val: "冠脉分岔点", idx: "16" },
            { val: "肋骨分割", idx: "17" }
          ]
          return xlk
        })()
      },
      {
        className: "xlk",
        name: "yang",
        firstSelect: { val: "否", idx: "0" },
        data: [
          { val: "是", idx: "1" },
          { val: "否", idx: "0" }
        ]
      },
      {
        className: "xlk",
        name: "yin",
        firstSelect: { val: "否", idx: "0" },
        data: [
          { val: "是", idx: "1" },
          { val: "否", idx: "0" }
        ]
      },
      {
        className: "xlk",
        name: "rangeConditions",
        firstSelect: { val: "", idx: "" },
        data: [
          { val: "序列号（切片号）", idx: "1" },
          { val: "检查号", idx: "2" }
        ]
      },
      {
        name: "groupId",
        className: "xlk",
        firstSelect: { val: "请选择一个项目群组", idx: "" },
        input: true,
        data: this.yymcdata
      }
    ]
    // 影像标注组件
    this.biaozhulist = require("../modal/biaozhulist/biaozhulist.js")
    this.ytjbiaozhulist = require("../modal/ytjbiaozhulist/ytjbiaozhulist")
    this.discurdlist = require("../modal/discurdreason/discurdreason")
    this.ytjdiscurdlist = require("../modal/ytjdiscurdreason/ytjdiscurdreason")
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      dropConfig.forEach((val, idx) => {
        let drop = this.app.loadModule(
          dropdown,
          this.dom.find("." + val.name),
          {
            className: val.className,
            firstSelect: val.firstSelect,
            data: val.data,
            input: val.input
          }
        )
        drop.event._addEvent("option.click", value => {
          this.model.apiData[val.name] = value.idx
          this.model.setData("apiData", this.model.apiData)
          this.app.session.set("ischanged", true)
        })
        drop.event._addEvent("dropDown.clear", value => {
          this.model.apiData[val.name] = ""
          this.model.setData("apiData", this.model.apiData)
        })
        if (val.name === "groupId") {
          drop.event._addEvent("drop.input", value => {
            this.queryProjectGroupList(value.data)
          })
        }
        this.dropobj[val.name] = drop
      })
      this.dropobj["yblx"].event._addEvent("option.click", val => {
        this.model.apiData.modality = val.idx
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj["yblx"].event._addEvent("dropDown.clear", val => {
        this.model.apiData.modality = ""
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.windowId.event._addEvent("option.click", val => {
        let tempobj = {
          id: val.idx.split(",")[0],
          value: val.idx.split(",")[1],
          name: val.val
        }
        this.model.apiData.window = JSON.stringify(tempobj)
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.windowId.event._addEvent("dropDown.clear", val => {
        this.model.apiData.window = null
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.windowId1.event._addEvent("option.click", val => {
        let tempobj = {
          id: val.idx.split(",")[0],
          value: val.idx.split(",")[1],
          name: val.val
        }
        this.model.apiData.vrWindowCode = tempobj.value
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.windowId1.event._addEvent("dropDown.clear", val => {
        this.model.apiData.vrWindowCode = undefined
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.seriesImgFileType.event._addEvent("option.click", val => {
        this.model.apiData.seriesImgFileType = val.idx * 1
        this.model.setData("apiData", this.model.apiData)
        // 改变了数据类型
        this.handleChangeSeriesImgFileType(val)
      })
      this.dropobj.seriesImgFileType.event._addEvent("dropDown.clear", val => {
        this.model.apiData.seriesImgFileType = null
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.yin.event._addEvent("option.click", val => {
        if (val.idx == 0) {
          if (this.dom.find(".yang .nowname").attr("data-idx") == 0) {
            this.model.apiData.yayAttributes = 2
          } else {
            this.model.apiData.yayAttributes = 1
          }
        } else {
          if (this.dom.find(".yang .nowname").attr("data-idx") == 0) {
            this.model.apiData.yayAttributes = 3
          } else {
            this.model.apiData.yayAttributes = 4
          }
        }
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.yin.event._addEvent("dropDown.clear", val => {
        if (this.dom.find(".yang .nowname").attr("data-idx") == 0) {
          this.model.apiData.yayAttributes = 2
        } else {
          this.model.apiData.yayAttributes = 1
        }
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.yang.event._addEvent("option.click", val => {
        if (val.idx == 0) {
          if (this.dom.find(".yin .nowname").attr("data-idx") == 0) {
            this.model.apiData.yayAttributes = 2
          } else {
            this.model.apiData.yayAttributes = 3
          }
        } else {
          if (this.dom.find(".yin .nowname").attr("data-idx") == 0) {
            this.model.apiData.yayAttributes = 1
          } else {
            this.model.apiData.yayAttributes = 4
          }
        }
        this.model.setData("apiData", this.model.apiData)
      })
      this.dropobj.yang.event._addEvent("dropDown.clear", val => {
        if (this.dom.find(".yin .nowname").attr("data-idx") == 0) {
          this.model.apiData.yayAttributes = 2
        } else {
          this.model.apiData.yayAttributes = 1
        }
        this.model.setData("apiData", this.model.apiData)
      })
      this.dict_root_child()
      this.field_query()
      this.render()
    })
  }

  // 改变了数据类型
  handleChangeSeriesImgFileType(val) {

    // vue中改变了数据类型，修改标注和form选项值
    this.vuePage.handleSeriesImgFileTypeChange(val.idx)

    // 9: 随访配准
    if (val.idx === '9') {
      // 范围条件为序列号,不可改
      this.dom.find(`.rangeConditions .option[data-idx="1"]`).click()
      this.dropobj['rangeConditions'].disable()
      // 聚合条件默认为空不可改;
      if (this.projectGroupSet) {
        this.projectGroupSet.liArr = []
        this.projectGroupSet.resetAndDisable(() => {
          this.dom.find(`.projectGroupSet .option[data-idx="seriesInstanceUID"]`).click()
        })
      }
      this.setCheckboxDisabled('.largeFigure .check-box') // 是否需要超大图
      this.setCheckboxDisabled('.isYayAttributes .check-box') // 是否需要阴阳性

      // 隐藏整体病症标注组件按钮
      this.dom.find('.biaozhubtns-ops').addClass('hide')
      this.model.apiData.annotationItemList = []
    } else {
      if (val.idx === '14') { // 14: 肺气道
        this.dom.find('.widthlevelset1').removeClass('hide') // 针对气道数据类型支持是否设置vr默认窗宽窗位
      } else {
        this.dom.find('.widthlevelset1').addClass('hide')
      }
      this.dropobj['rangeConditions'].able() // 范围条件
      this.projectGroupSet && this.projectGroupSet.able() // 聚合条件
      this.setProjectGroupSetData(this.model.initApiData.aggreConditions)
      // 是否需要超大图  15:C端病理大图
      val.idx === '15' ? this.setCheckboxDisabled('.largeFigure .check-box') : this.setCheckboxAbled('.largeFigure .check-box')
      // 是否需要阴阳性
      this.setCheckboxAbled('.isYayAttributes .check-box')

      this.setSelectAbled('.bzlx')
      this.setSelectAbled('.toolarea')
      // 整体病症标注组件按钮
      this.dom.find('.biaozhubtns-ops').removeClass('hide')
    }
    this.lastSeriesImgFileType = val.idx // 最后一次选择的值
  }

  // 设置下拉列表disabled
  setSelectDisabled(seleectClassName) {
    this.dom.find(`${seleectClassName} .nowname`).addClass('drop_disabled');
    this.dom.find(`${seleectClassName} .drop-down`).addClass('drop_disabled');
  }

  // 设置下拉列表abled
  setSelectAbled(seleectClassName) {
    this.dom.find(`${seleectClassName} .nowname`).removeClass('drop_disabled');
    this.dom.find(`${seleectClassName} .drop-down`).removeClass('drop_disabled');
  }

  // 设置checkbox为disabled
  setCheckboxDisabled(checkBoxDomPath) {
    const checkbox = this.dom.find(checkBoxDomPath)
    if (checkbox.hasClass('choose')) checkbox.click()
    checkbox.addClass('disabled')
  }
  // 设置checkbox为abled
  setCheckboxAbled(checkBoxDomPath) {
    const checkbox = this.dom.find(checkBoxDomPath)
    checkbox.removeClass('disabled')
  }

  async dict_root_child() {
    let temparr = []
    let json = {
      value: "WINDOW"
    }
    let res = await this.api.dict_root_child(json)
    res.data[0].children.forEach(function(val, idx) {
      temparr.push({ idx: val.id + "," + val.value, val: val.name })
    })
    this.dropobj.windowId.renderHtml(temparr)
    this.dropobj.windowId1.renderHtml(temparr)
    //this.model.setData('modality', temparr)
  }

  async render() {
    let pagedata = {}
    switch (this.type) {
      case "new":
        pagedata = JSON.parse(this.app.session.get("data_2"))
        pagedata = pagedata ? pagedata : {}
        this.model.setData("apiData", pagedata)
        this.model.setData("initApiData", JSON.parse(JSON.stringify(pagedata))) // 初始化的数据
        if (pagedata.modality) {
          this.dom
            .find('.yblx .option[data-idx="' + pagedata.modality + '"]')
            .click()
        }
        if (pagedata.seriesImgFileType) {
          this.dom
            .find(
              '.seriesImgFileType .option[data-idx="' +
              pagedata.seriesImgFileType +
              '"]'
            )
            .click()
        }
        if (pagedata.window) {
          pagedata.window = JSON.parse(pagedata.window)
          this.dom.find(".widthlevelset .check-box").click()
          this.dom
            .find(
              '.windowId .option[data-idx="' +
              pagedata.window.id +
              "," +
              pagedata.window.value +
              '"]'
            )
            .click()
        }
        if (pagedata.vrWindow) {
          pagedata.vrWindow = JSON.parse(pagedata.vrWindow)
          this.dom.find(".widthlevelset1 .check-box").click()
          this.dom
            .find(
              '.windowId1 .option[data-idx="' +
              pagedata.vrWindow.id +
              "," +
              pagedata.vrWindow.value +
              '"]'
            )
            .click()
        }
        if (pagedata.discardList) {
          if (pagedata.discardList.length > 0) {
            this.dom.find(".viewreason").removeClass("hide")
          }
        }
        if (pagedata.diagnosisIncome) {
          this.dom.find('.showReport[type="diagnosisIncome"]').click()
        }
        if (pagedata.inspectSee) {
          this.dom.find('.showReport[type="inspectSee"]').click()
        }
        if (
          pagedata.annotationItemList &&
          pagedata.annotationItemList.length > 0
        ) {
          this.dom.find(".showalldata").removeClass("hide")
        }
        if (pagedata.imageAnnotationList) {
          this.multlist.setData(pagedata.imageAnnotationList)
        }
        break
      default:
        let json = {
          projectId: this.projectId
        }
        this.app.loading.show()
        let res = await this.api.projectdetail(json)
        this.app.loading.hide()
        if (res.code == 0) {
          pagedata = res.data
          // pagedata = this.app.session.get('data_2') ? JSON.parse(this.app.session.get('data_2')) : pagedata
          // 设置vue里的imageAnnotationList
          this.vuePage.setProjectData(pagedata)

          this.model.setData("apiData", pagedata)
          this.model.setData("initApiData", JSON.parse(JSON.stringify(pagedata))) // 初始化的数据
          let lastpage
          let json1 = {
            id: this.projectId
          }
          if (pagedata.window) {
            if (typeof pagedata.window !== "object") {
              pagedata.window = JSON.parse(pagedata.window)
            }
            this.dom.find(".widthlevelset .check-box").click()
            this.dom
              .find(
                '.windowId .option[data-idx="' +
                pagedata.window.id +
                "," +
                pagedata.window.value +
                '"]'
              )
              .click()
          }
          if (pagedata.vrWindow) {
            if (typeof pagedata.vrWindow !== "object") {
              pagedata.vrWindow = JSON.parse(pagedata.vrWindow)
            }
            this.dom.find(".widthlevelset1 .check-box").click()
            this.dom
              .find(
                '.windowId1 .option[data-idx="' +
                pagedata.vrWindow.id +
                "," +
                pagedata.vrWindow.value +
                '"]'
              )
              .click()
          }
          if (pagedata.discardList) {
            if (pagedata.discardList.length > 0) {
              this.dom.find(".viewreason").removeClass("hide")
            }
          }
          if (pagedata.diagnosisIncome) {
            this.dom
              .find('.showReport[type="diagnosisIncome"] .check-box')
              .click()
          }
          if (pagedata.inspectSee) {
            this.dom.find('.showReport[type="inspectSee"] .check-box').click()
          }
          if (pagedata.componetCount <= 0) {
            this.dom.find(".export").remove()
          }
          //delete pagedata.project
          this.app.loading.show()
          let res1 = await this.api.project_basic_read(json1)
          this.app.loading.hide()
          this.projectDetail2 = lastpage = res1.data

          // 设置vue里的表单数据
          this.vuePage.setProjectBasicData(lastpage)

          if (!this.app.session.get("data_1")) {
            this.app.session.set("data_1", JSON.stringify(lastpage))
          }
          // lastpage = JSON.parse(this.app.session.get('data_1'))
          if (lastpage.modality) {
            this.dom
              .find('.yblx .option[data-idx="' + lastpage.modality + '"]')
              .click()
          }
          if (lastpage.rangeConditions) {
            this.dom
              .find(
                '.rangeConditions .option[data-idx="' +
                lastpage.rangeConditions +
                '"]'
              )
              .click()
          }
          if (lastpage.studyAnno) {
            // this.dom.find('.marktypeset .check-box').click()
          }
          if (lastpage.largeFigure) {
            this.dom.find(".largeFigure .check-box").click()
          }
          if (lastpage.isLungPdf) {
            this.dom.find(".isLungPdf .check-box").click()
          }
          if (lastpage.aggreConditions) {
            // 设置聚合条件设置projectGroupSet的data
            this.setProjectGroupSetData(lastpage.aggreConditions)
          }
          this.dom
            .find('.department[data-id="' + lastpage.category + '"]')
            .find(".radio-box")
            .click()
          if (lastpage.isYayAttributes) {
            this.dom.find(".isYayAttributes .check-box").click()
            switch (lastpage.yayAttributes) {
              case 1:
                this.dom.find('.yin .option[data-idx="0"]').click()
                this.dom.find('.yang .option[data-idx="1"]').click()
                break
              case 2:
                this.dom.find('.yin .option[data-idx="0"]').click()
                this.dom.find('.yang .option[data-idx="0"]').click()
                break
              case 3:
                this.dom.find('.yin .option[data-idx="1"]').click()
                this.dom.find('.yang .option[data-idx="0"]').click()
                break
              case 4:
                this.dom.find('.yin .option[data-idx="1"]').click()
                this.dom.find('.yang .option[data-idx="1"]').click()
                break
            }
          }
          if (pagedata.annotationItemList.length > 0) {
            this.dom.find(".showalldata").removeClass("hide")
          }


          // 选择数据类型
          if (lastpage.seriesImgFileType) {
            this.dom.find('.seriesImgFileType .option[data-idx="' + lastpage.seriesImgFileType + '"]').click()
          }
          // 查看和已启用则不可编辑
          (this.type == "view" || this.status == 2) && this.todisabled()

          this.app.session.del("ischanged")
        } else {
          Tool.errorshow(res.msg, this.app)
        }
        break
    }
  }

  // 设置聚合条件设置projectGroupSet的data
  setProjectGroupSetData(aggreConditions) {
    if (!aggreConditions) return
    if (this.type == "view" || this.status == 2) {
      this.projectGroupSet.setData(
        JSON.parse(aggreConditions),
        "view"
      )
    } else {
      this.projectGroupSet.setData(
        JSON.parse(aggreConditions),
        "edit"
      )
    }
  }

  todisabled() {
    if (this.type == "view") {
      this.dom.find(".save").addClass("hide")
    }
    for (let i in this.dropobj) {
      this.dropobj[i].disable()
    }
    // this.dom.find(".bigadd").addClass("hide")
    this.dom.find(".alldata").addClass("hide")
    this.dom.find(".discardreason").addClass("hide")
    this.dom.find(".check-box").off("click")
    this.dom.find(".radio-box").off("click")
    this.dom.find(".inputBox").dom && this.dom.find(".inputBox").attr("readonly", "readonly")
    // this.multlist.disable()
    this.vuePage.setAnnoListDisabled(true)
    this.projectGroupSet.disableAll()
  }

  //===================弹窗部分==========================
  //显示用户所选的组件
  showytjComponent(type, v1) {
    let initData = { type: this.type, status: this.status, data: [] }
    if (type == "all") {
      initData.data = JSON.parse(
        JSON.stringify(this.model.apiData.annotationItemList)
      )
    } else {
      // 初始值
      const { n1, n2 } = v1
      const list = this.vuePage.getImageAnnoItemList()
      const item = list[n1].children[n2]
      initData.data = item.annotationItemList ? item.annotationItemList : []
    }
    this.ytjcomponent = this.app.loadModal(
      this.ytjbiaozhulist,
      { adv: true },
      initData
    )
    this.ytjcomponent.event._addEvent("biaozhulist.showcomponent", value => {
      this.showDetailComponent(value)
    })
    this.ytjcomponent.event._addEvent("ytjbiaozhulist.datachange", value => {
      this.addComponentData(value.data, type, v1)
      this.ytjcomponent.close()
    })
  }

  //查看所有组件列表，并进行添加
  chooseComponent(type, v1) {
    let initData = { chooseddata: [] }
    if (type == "all") {
      initData.chooseddata = this.model.apiData.annotationItemList
    } else {
      // 初始值
      const { n1, n2 } = v1
      const list = this.vuePage.getImageAnnoItemList()
      const item = list[n1].children[n2]
      initData.chooseddata = item.annotationItemList ? item.annotationItemList : []
    }
    this.addcomponent = this.app.loadModal(
      this.biaozhulist,
      { adv: true },
      initData
    )
    this.model.setData("componentdata", { page: 1, pageSize: 10 })
    //显示详情
    this.addcomponent.event._addEvent("biaozhulist.showcomponent", value => {
      this.showDetailComponent(value)
    })
    //搜索列表
    this.addcomponent.event._addEvent("search.change", value => {
      this.model.setData("componentdata", value)
    })
    // 点击新增标注确定按钮
    this.addcomponent.event._addEvent("biaozhulist.adddata", value => {
      this.addComponentData(value.list, type, v1)
      this.addcomponent.close()

    })
  }

  //查看并添加废片理由
  choosediscurdreason(type, v1) {
    let initData = { chooseddata: [] }
    initData.chooseddata = this.model.apiData.discardList
      ? JSON.parse(JSON.stringify(this.model.apiData.discardList))
      : []
    this.discurdreason = this.app.loadModal(
      this.discurdlist,
      { adv: true },
      initData
    )
    this.model.setData("discurddata", {
      page: 1,
      pageSize: 10,
      value: "DISCARD"
    })
    //搜索列表
    this.discurdreason.event._addEvent("search.change", value => {
      this.model.setData("discurddata", value)
    })
    this.discurdreason.event._addEvent("biaozhulist.adddata", value => {
      this.addDiscurdData(value.list)
      this.discurdreason.close()
    })
  }

  async showDetailComponent(value) {
    let json = {
      id: value.id
    }
    this.app.loading.show()
    let res = await this.api.getcomponentdetail(json)
    this.app.loading.hide()
    if (res.code == 0) {
      let showcomponent = require("../modal/createcomponent/createcomponent")
      this.app.loadModal(
        showcomponent,
        { adv: true },
        { type: "view", data: res.data }
      )
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  addComponentData(value, type, v1) {
    let that = this
    if (type == "all") {
      this.model.apiData.annotationItemList = JSON.parse(JSON.stringify(value))
      if (this.model.apiData.annotationItemList.length == 0) {
        this.dom.find(".showalldata").addClass("hide")
      } else {
        if (
          this.model.apiData.annotationItemList.some(item => item.action !== 3)
        ) {
          this.dom.find(".showalldata").removeClass("hide")
        } else {
          this.dom.find(".showalldata").addClass("hide")
        }
      }
    } else {
      // 更新Vue数据,标注的annotationItemList
      this.vuePage.updateAnnotationItemList(JSON.parse(JSON.stringify(value)))
    }
    this.model.setData("apiData", this.model.apiData)
  }

  addDiscurdData(value) {
    this.model.apiData.discardList = value
    this.model.setData("apiData", this.model.apiData)
    if (value.length == 0) {
      this.dom.find(".viewreason").addClass("hide")
    } else {
      value.map(item => {
        if (item.action != 3) {
          this.dom.find(".viewreason").removeClass("hide")
          return
        } else {
          this.dom.find(".viewreason").addClass("hide")
        }
      })
    }
  }

  showdiscurdreason() {
    let initData = { type: this.type, status: this.status, data: [] }
    initData.data = JSON.parse(JSON.stringify(this.model.apiData.discardList))
    this.ytjcomponent = this.app.loadModal(
      this.ytjdiscurdlist,
      { adv: true },
      initData
    )
    this.ytjcomponent.event._addEvent("ytjbiaozhulist.datachange", value => {
      this.addDiscurdData(value.data)
      this.ytjcomponent.close()
    })
  }
}

module.exports = createprotwo
