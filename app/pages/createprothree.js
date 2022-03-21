import { MessageBox } from 'element-ui'

class createprothree extends Interstellar.pagesBase {
  async complete() {
    let that = this
    this.projectId = parseInt(this.app.parpam.projectid)
    this.type = this.app.parpam.type
    this.projectType = window.location.hash.indexOf("createprothree") !== -1 ? 1 : 3
    this.projectBasicData = {}

    // 初始化Vue
    this.initVuePage()

    if (this.projectType == 1) {
      this.app.header.openControl("projectmanage")
    } else {
      this.app.header.openControl("backflowproject")
    }
    this.hideBtn = window.location.hash.indexOf("createprothree") !== -1
    if (this.hideBtn == true) {
      // 标注项目
      this.dom.find(".import-algorithm-segmentation-results").addClass("hide") // 隐藏：导入算法分割结果
      // this.dom.find(".algArea").addClass("hide")
      // this.dom.find(".start").addClass("hide")
      // this.dom.find(".export-result").addClass("hide")
    } else {
      // 算法项目
      this.dom.find(".import-algorithm-segmentation-results").removeClass("hide") // 显示：导入算法分割结果
      // this.dom.find(".algArea").removeClass("hide")
      // this.dom.find(".start").removeClass("hide")
      // this.dom.find(".export-result").removeClass("hide")
      if (
        window.location.hash.indexOf("createbackflowpro3") !== -1 &&
        this.type == "view"
      ) {
        this.dom.find(".start").addClass("hide")
        // this.dom.find(".export-result").addClass("hide")
      }
      // this.heartSegment_resultRead()
      // 初始化统计数据
      this.vuePage.initResultData()
    }

    this.app.header.changeselected(3)
    this.styleModel(1)
    this.resize()
    this.render()
    this.apiData = {
      seriesInstanceUidList: [],
      condition: {},
      projectId: this.projectId
    }
    this.alg_sar_list_tool()
    this.viewData = {
      type: this.projectType
    }
    this.component = {}
    this.prodata = require("../modal/projectdata/projectdata")
    let addimage = require("../modal/addimage/addimage")
    this.uploadalgdata = require("../modal/uploadalgdata/uploadalgdata")
    this.alglist = require("../modal/alglist/alglist")
    this.formsubmit = require("../modal/formsubmit/formsubmit")
    if (this.type != "new" && !this.projectId) {
      this.app.changePage("projectmanage")
      return
    }
    if (this.type == "new") {
      this.app.changePage("projectmanage")
      return
    }
    if (this.type == "view") {
      this.dom.find(".biaozhubtn").addClass("hide")
      // this.dom.find(".yyytask").removeClass("hide")
      // this.setTitle()
    }
    if (this.type == "edit") {
      if (!this.projectId) {
        this.app.changePage("projectmanage")
      }
    }
    //数据调用
    this.model._event._addEvent("totalInfo.change", () => {
      if (
        this.model.getData("hospitalInfo").length > 0 &&
        this.model.getData("listInfo").list
      ) {
        let timestamp = new Date().getTime()
        this.addmodel = this.app.loadModal(
          addimage,
          {
            adv: true
          },
          {
            data: this.model.getData("listInfo"),
            hospital: this.model.getData("hospitalInfo"),
            modality: this.model.getData("modalityInfo")
          }
        )
        this.addmodel.event._addEvent("addimage.search", value => {
          this.getlist(value.data)
        })
        this.addmodel.event._addEvent("hospital.input", value => {
          this.gethospital(value.data.data)
          this.model._event._addEvent("hospitalInfo.change", () => {
            this.addmodel.setxlk(this.model.getData("hospitalInfo"))
          })
        })
        this.addmodel.event._addEvent("addimage.all", value => {
          if (value.data !== undefined) {
            this.apiData.condition = value.data
            delete this.apiData.condition.page
            delete this.apiData.condition.pageSize
          } else {
            this.apiData.condition = {}
          }
          this.addimage(1)
          this.addmodel.close()
          this.addmodel = null
        })
        this.addmodel.event._addEvent("addimage.new", value => {
          if (value.data !== undefined) {
            this.apiData.condition = value.data
            delete this.apiData.condition.page
            delete this.apiData.condition.pageSize
          } else {
            this.apiData.condition = {}
          }
          this.clearandnew()
        })
      }
    })
    this.model._event._addEvent("listInfo.change", () => {
      this.addmodel.setMain(true, this.model.getData("listInfo"))
    })
    this.dom.find(".addimage1").on("click", () => {
      this.model.hospitalInfo = []
      this.model.listInfo = []
      this.gethospital("", true)
      this.getlist(
        {
          category: "RADIOLOGY",
          valid: true,
          jpgValid: true,
          page: 1,
          pageSize: 10
        },
        true
      )
    })
    this.dom.find(".viewimage").on("click", () => {
      const seriesImgFileType = this.seriesImgFileType
      let temphtml =
        `<a class="biaozhubtn deleteres">删除查询结果</a>\n
          <a class="biaozhubtn exportname">导出结果${seriesImgFileType === 15 ? '切片' : '序列'}名</a>`
      this.prodatapoll = this.app.loadModal(
        this.prodata,
        {
          adv: true
        },
        {
          type: "custom",
          html: temphtml,
          del: this.type,
          seriesImgFileType
        }
      )
      this.gethospital("")
      this.prodatapoll.event._addEvent("prodata.pagenumber", value => {
        this.resetPage = false
        this.getseries(value.data)
      })
      this.prodatapoll.event._addEvent("hospital.input", value => {
        this.gethospital(value)
      })
      this.prodatapoll.event._addEvent("projectdata.taskinput", value => {
        this.gettask(value)
      })
      this.prodatapoll.event._addEvent("projectdata.search", value => {
        this.resetPage = true
        this.getseries(value.data)
      })
      this.prodatapoll.event._addEvent("prodata.pagesize", value => {
        this.resetPage = true
        this.getseries(value.data)
      })
      this.prodatapoll.event._addEvent("projectdata.deleteres", value => {
        this.app.alert.show({
          title: " ",
          msg: "如有已关联到任务的序列不支持删除",
          close: true,
          sure: async () => {
            this.app.loading.show()
            delete value.condition.page
            delete value.condition.pageSize
            let json = {
              condition: value.condition,
              operation: "ID",
              projectId: this.projectId,
              currentSearchReqId: value.currentSearchReqId
            }
            let res = await this.api.searchresult_remove(json)
            this.app.loading.hide()
            if (res.code == 0) {
              this.series_count()
              this.prodatapoll.close()
              this.prodatapoll = null
            } else {
              Tool.errorshow(res.msg, this.app)
            }
          }
        })
      })
      this.prodatapoll.event._addEvent("projectdata.export", value => {
        let json = {
          condition: value.condition,
          operation: "ID",
          projectId: this.projectId,
          currentSearchReqId: value.currentSearchReqId
        }
        let url =
          this.app.domain1 +
          "v1/project/series/searchresult/export?param=" +
          encodeURI(
            JSON.stringify(json) +
              "&accessToken=" +
              window.localStorage.accessToken
          )
        //let token = this.app.local.get('accessToken')
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        })
      })
      this.resetPage = true
      this.getseries()
    })
    // 导入标注结果
    this.dom.find(".addsfdata").on("click", () => {
      if (this.count > 0) {
        let algdata = this.app.loadModal(
          this.uploadalgdata,
          {
            adv: true
          },
          {
            toolList: this.toolList,
            type: "project"
          }
        )
        algdata.event._addEvent("uploadalgdata.upload", value => {
          let filePath = ES.selctorDoc("#file1").val()
          let fileType = this.getFileType(filePath)
          if ("csv" != fileType && "xlsx" !== fileType && "xls" !== fileType) {
            ES.selctorDoc("#filechoose").val("")
            this.app.alert.show({
              title: "",
              template:
                '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
              close: false,
              sure: () => {
                this.app.alert.hide()
              }
            })
          } else {
            const { type, transferNii, toolType: toolIdTypeStr, dataType = '', algType, versionNumber, transferCuboidMask } = value.data
            const [toolId = '', toolType = ''] = toolIdTypeStr ? toolIdTypeStr.split(",") : []
            const requestParams = {
              projectId: this.app.parpam["projectid"],
              accessToken: window.localStorage.accessToken,
              type,
              transferNii: transferNii ? 1 : 0,
              toolType,
              toolId,
              dataType,
              algType,
              versionNumber
            }
            typeof transferCuboidMask === 'boolean' && (requestParams.transferCuboidMask = transferCuboidMask)
            $.ajaxFileUpload({
              url: "/aaa/v1/alg/sar/import", // that.app.domain+'/ccc/user/import',
              secureuri: false,
              dataType: "JSON",
              async: false,
              data: requestParams,
              type: "post",
              fileElementId: "file1",
              success: (data, status, e) => {
                let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
                algdata.close()
                // 更新统计信息
                this.vuePage.heartSegmentResultRead('ALG') // 标注结果
                if (jsonArr.code == 0) {
                  // this.listInfo()
                  const resTemp = jsonArr.data ? `${jsonArr.data.successCount}条，失败${jsonArr.data.errorCount}条` : ''
                  this.app.alert.show({
                    title: "",
                    template:
                      '<span style="font-size: 18px;margin-left:20px;">成功导入' +
                      resTemp +
                      "</span>",
                    sure: false,
                    close: true,
                    footer: true
                  })
                  this.event._dispatch("projectdata.datachange")
                } else {
                  let msg = jsonArr.code == -1 ? "繁忙" : jsonArr.msg
                  MessageBox.alert(`<pre>${msg}</pre>`, '提示', {
                    dangerouslyUseHTMLString: true
                  })
                }
                this.close()
                this.dom.find(".file").remove()
                this.dom
                  .find(".btnarea")
                  .append(
                    '<input class="file" type="file" id="file" name="file"/>'
                  )
                // that.bindchangefile();
              }
            })
          }
        })
      } else {
        Tool.errorshow("请先添加影像数据", this.app)
      }
    })
    this.dom.find(".view-import-result").on("click", () => {
      this.queryImportResult()
    })
    this.dom.find(".import-auxiliary-sequence").on("click", () => {
      this.dom.find("#auxiliarySequenceFile").click()
    })
    // 点击导入算法分割结果
    this.dom.find(".import-algorithm-segmentation-results").on("click", () => {
      this.dom.find("#algorithmSegmentationResultsFile").click()
    })
    this.dom.find(".download-auxiliary-sequence").on("click", () => {
      const json = {
        projectId: this.projectId
      }
      const url = this.app.domain1 + "v1/project/series/auxiliary_series/export?param=" + encodeURI(JSON.stringify(json) + "&accessToken=" + window.localStorage.accessToken)
      this.api.HttpRequest.downLoadFile(url, {
        key: "accessToken",
        val: this.app.local.get("accessToken")
      })
    })
    this.dom.find(".propreview").on("click", async () => {
      let json = {
        projectId: this.projectId
      }
      this.app.loading.show()
      let res = await this.api.project_anno_read(json)
      this.app.loading.hide()
      if (res.code == 0) {
        if (
          res.data.annotationItemList.length == 0 &&
          res.data.imageAnnotationList.length == 0
        ) {
          this.app.alert.show({
            title: " ",
            msg: "请先设置影像标注信息后预览试用",
            close: true,
            footer: true
          })
        } else {
          this.bigPic = res.data.largeFigure
          this.series_count(true)
        }
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    })
    this.dom.find(".upload").on("click", () => {
      this.dom.find(".file").click()
    })
    // 下载上传模板
    this.dom.find(".downtemplete").on("click", () => {
      Tool.downloadLocalFile('/images/page/s.csv', '模板.csv', this.app)
    })
    this.dom.find(".copytask").on("click", async () => {
      let taskIdList = []
      if (this.dom.find(".list-content .choose").dom) {
        this.dom.find(".list-content .choose").dom.forEach(val => {
          taskIdList.push(
            val
              .parent()
              .parent()
              .attr("nowid")
          )
        })
        this.app.loading.show()
        let res = await this.api.task_cloneList({
          projectId: this.projectId,
          taskIdList: taskIdList
        })
        this.app.loading.hide()
        let msg = ""
        if (res.code == 0) {
          msg = "复制成功"
          this.dom.find(".yyytasklist .choose").removeClass("choose")
        } else {
          msg = res.msg
        }
        this.app.alert.show({
          title: "",
          template: '<span style="font-size: 18px">' + msg + "</span>",
          close: false,
          sure: () => {}
        })
      } else {
        this.app.alert.show({
          title: "",
          template:
            '<span style="font-size: 18px;margin-left:20px;">请先选择需要复制的任务</span>',
          close: false,
          sure: () => {}
        })
      }
    })
    this.dom.find(".isgetalgres .radio-box").on("click", function() {
      let dom = ES.selctorDoc(this)
      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
        that.dom.find(".toolChoose").addClass("hide")
        that.dom.find(".toolChoose .choose").removeClass("choose")
      } else {
        dom.addClass("choose")
        that.dom.find(".toolChoose").removeClass("hide")
      }
    })
    this.dom.find(".isgetalgres .check-box").on("click", async function() {
      let algResultType = ""
      let dom = ES.selctorDoc(this)
      if (dom.hasClass("choose")) {
        dom.removeClass("choose")
      } else {
        dom.addClass("choose")
      }
      that.dom.find(".toolChoose .choose").dom.forEach(val => {
        algResultType += val.parent().attr("data-id") + ","
      })
      let res = await that.api.project_edit_algResultType({
        projectId: that.projectId,
        algResultType: algResultType
      })
      if (res.code == 0) {
      } else {
        Tool.errorshow(res.msg, that.app)
      }
    })
    this.binduploadevent()
    this.bindUploadAuxiliarySequenceEvent()
    this.projectType === 3 && this.bindUploadAlgorithmSegmentationResultsEvent()
    await this.project_basic_read()

    // 在project_basic_read之后 导入参考标注区域范围下载和导入事件
    this.bindReferAnnotatedAreaEvent()
  }

  // Vue相关
  initVuePage() {
    const that = this
    this.vuePage = new Vue({
      el: '#createprothree',
      data() {
        return {
          api: that.api,
          type: that.type,
          projectId: that.projectId,
          versionNumber: that.versionNumber,
          projectType: window.location.hash.indexOf("createprothree") !== -1 ? 1 : 3,
          algType: '',
          projectData: {},
          heartSegmentResultALG: {},
          heartSegmentResultMERGE7: {},

          algTypeList: [],
          versionNumberList: [],
          formData: {
            algType: '',
            versionNumber: ''
          }
        }
      },
      computed: {
        isShowMERGE7Start() {
          const { successCount, failCount, processCount, notStartCount } = this.heartSegmentResultMERGE7 || {}
          return successCount || failCount || processCount || notStartCount
        }
      },
      watch: {
        algType(val) {
          this.formData.algType = val
        },
        'formData.algType'(val) {
          const algVersion = that.app.constmap["ALG_VERSION"].children.find((item)=> item.value === val)
          this.versionNumberList = algVersion.remark.split(",")
          this.formData.versionNumber = ''
        }
      },
      methods: {
        initProjectData(data) {
          this.projectData = data
          this.initOptionsList()
        },
        initOptionsList() {
          this.algTypeList = Tool.configxlkformat(that.app.constmap["ALG_VERSION"])
        },
        initResultData() {
          this.heartSegmentResultRead('ALG') // 标注结果
          this.heartSegmentResultRead('MERGE7') // 合并MASK结果
        },
        async heartSegmentResultRead(bizType) {
          let res = await this.api.heartSegment_resultRead({
            projectId: this.projectId,
            bizType
          })
          if (res.code == 0) {
            let alg = ""
            if (res.data.algType) {
              this.algType = that.algType = res.data.algType
              Tool.configxlkformat(that.app.constmap["ALG_VERSION"]).forEach(v => {
                if (v.idx == res.data.algType) {
                  alg = v.val
                }
              })
            }
            bizType === 'ALG' && (this.heartSegmentResultALG = { alg, ...res.data })
            bizType === 'MERGE7' && (this.heartSegmentResultMERGE7 = { ...res.data })
          }
        },
        handleStartALG(taskType) {
          if (this.projectType !== 3) return
          let [ algType, versionNumber ] = ['', '']
          if (!this.algType) {
            algType = this.formData.algType
            versionNumber = this.formData.versionNumber.toString()
          } else {
            algType = this.algType
            versionNumber = this.projectData.versionNumber
          }
          if (!algType || !versionNumber) {
            return that.app.alert.show({
              title: ' ',
              msg: '请先选择算法模型和模型版本',
              close: true
            })
          }
          that.app.alert.show({
            title: ' ',
            msg: `确认${taskType === 4 ? '暂停' : (taskType === 5 ? '继续' : '开启')}吗？`,
            close: true,
            sure: () => {
              const baseParams = {
                algType,
                versionNumber
              }
              if (taskType) return this.executeOpt(Object.assign(baseParams, { taskType }))
              const config = [{
                name: 'taskType',
                type: 'radio',
                title: '请选择类型',
                check: 'empty',
                remark: '',
                data: [
                  { val: '强制重跑', idx: '3' },
                  { val: '处理失败', idx: '2' },
                  { val: '新增序列', idx: '1' }
                ]
              }]
              that.editconclusion = that.app.loadModal(
                that.formsubmit,
                { adv: true },
                { title: '选择类型', config: config }
              )
              that.editconclusion.event._addEvent('formsubmit.submit', (data) => {
                this.executeOpt(Object.assign(baseParams, { taskType: data.taskType }))
              })
            }
          })
        },
        async executeOpt(requestParams) {
          const taskType = requestParams.taskType
          let msg = ''
          that.app.loading.show()
          let resjson = await that.api.project_joinAlg({
            projectId: that.projectId,
            joinAlg: true
          })
          that.app.loading.hide()
          if (resjson.code == 0) {
            that.app.loading.show()
            let res = await that.api.heartSegment_start(Object.assign({}, requestParams, {
              projectId: that.projectId
            }))
            that.app.loading.hide()
            if (res.code == 0) {
              msg = `${taskType === 4 ? '暂停' : (taskType === 5 ? '继续' : '开启')}成功`
              this.heartSegmentResultRead('ALG') // 标注结果
            } else {
              msg = res.msg
            }
            typeof taskType === 'string' && that.editconclusion.close()
          } else {
            msg = resjson.msg
          }
          typeof taskType === 'string' && that.app.alert.show({
            title: ' ',
            msg,
            close: true,
            footer: true
          })
        },
        handleStartMERGE7() {
          if(this.projectType !== 3) return
          that.app.alert.show({
            title: ' ',
            msg: '确认开启吗？',
            close: true,
            sure: () => {
              let config = [
                {
                  name: 'taskType',
                  type: 'radio',
                  title: '请选择类型',
                  check: 'empty',
                  remark: '',
                  data: [
                    { val: '强制重跑', idx: '3' },
                    { val: '处理失败', idx: '2' },
                    // { val: '新增序列', idx: '1' }
                  ]
                }
              ]
              that.editconclusion = that.app.loadModal(
                that.formsubmit,
                { adv: true },
                { title: '选择类型', config: config }
              )
              that.editconclusion.event._addEvent('formsubmit.submit', async (data) => {
                let msg = ''
                that.app.loading.show()
                let res = await that.api.mergemask7Process_start({
                  projectId: that.projectId,
                  taskType: data.taskType,
                })
                that.app.loading.hide()
                if (res.code == 0) {
                  msg = '开启成功'
                  this.heartSegmentResultRead('MERGE7')
                } else {
                  msg = res.msg
                }
                that.editconclusion.close()
                that.app.alert.show({
                  title: ' ',
                  msg: msg,
                  close: true,
                  footer: true
                })
              })
            }
          })
        },
        // 导出结果 bizType: ALG / MERGE7
        handleExport(bizType) {
          const obj = {
            projectId: this.projectId,
            bizType
          }
          const url = `${that.app.domain1}v1/heartSegment/export?param=${encodeURIComponent(JSON.stringify(obj))}`
          that.api.HttpRequest.downLoadFile(url, {
            key: "accessToken",
            val: that.app.local.get("accessToken")
          })
        }
      }
    })
  }

  render() {
    this.series_count()
  }

  async gettask(value) {
    let json = {
      projectId: this.projectId,
      taskNameKey: value,
      type: 1
    }
    this.prodatapoll.inputarea.loading(true)
    let res = await this.api.task_like_query(json)
    this.prodatapoll.inputarea.loading(false)
    if (res.code == 0) {
      this.prodatapoll.tasklist(res.data.list)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  binduploadevent() {
    this.dom.find(".file").on("change", () => {
      let filePath = ES.selctorDoc("#file").val()
      let fileType = this.getFileType(filePath)
      if ("csv" != fileType) {
        ES.selctorDoc("#filechoose").val("")
        this.app.alert.show({
          title: "",
          template:
            '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
          close: false,
          sure: () => {
            this.app.alert.hide()
            this.dom.find(".file").remove()
            this.dom
              .find(".imagedata")
              .append('<input class="file" type="file" id="file" name="file"/>')
            this.binduploadevent()
          }
        })
      } else {
        this.app.loading.show()
        $.ajaxFileUpload({
          url: "/aaa/v1/project/series/import", // that.app.domain+'/ccc/user/import',
          secureuri: false,
          dataType: "JSON",
          timeout: 1000 * 60 * 60,
          async: false,
          data: {
            projectId: this.projectId,
            accessToken: window.localStorage.accessToken
          },
          type: "post",
          fileElementId: "file",
          sequentialUploads: true,
          beforeSend: function(xhr, data) {
            xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
          },
          success: (data, status, e) => {
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
            this.app.loading.hide()
            if (jsonArr.code == 0) {
              this.app.alert.show({
                title: "",
                template:
                  '<span style="font-size: 18px;margin-left:20px;">已成功导入序列数' +
                  jsonArr.data.successNumber + "条</span>",
                sure: false,
                close: function() {},
                footer: true
              })
            } else {
              Tool.errorshow(jsonArr.msg, this.app)
            }
            this.dom.find(".file").remove()
            this.dom
              .find(".imagedata")
              .append('<input class="file" type="file" id="file" name="file"/>')
            this.binduploadevent()
            this.getseries()
            this.series_count()
          }
        })
      }
    })
  }

  // 导入参考标注区域范围下载和导入事件
  bindReferAnnotatedAreaEvent() {
    const category = this.projectBasicData.category
    if (category !== 2) return // 2是病理科, 其他还有放射、测试、其他
    this.dom.find('.refer-annotated-area-wrapper').removeClass('hide')
    // 点击导入
    this.dom.find(".import-refer-annotated-area").on("click", () => {
      this.dom.find("#referAnnotatedAreaFile").click()
    })
    // 选择文件后
    this.dom.find("#referAnnotatedAreaFile").on("change", () => {
      let filePath = ES.selctorDoc("#referAnnotatedAreaFile").val()
      let fileType = this.getFileType(filePath)
      if (!['xlsx', 'xls'].includes(fileType)) {
        MessageBox.alert('格式错误，上传失败。')
      } else {
        this.app.loading.show()
        $.ajaxFileUpload({
          url: `${this.app.domain1}v1/anno/alg/preprocess/fileUpload`,
          secureuri: false,
          dataType: "JSON",
          timeout: 60000,
          async: false,
          data: {
            projectId: this.projectId,
            accessToken: window.localStorage.accessToken
          },
          type: "post",
          fileElementId: "referAnnotatedAreaFile",
          sequentialUploads: true,
          beforeSend: function(xhr, data) {
            xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
          },
          success: (data, status, e) => {
            this.app.loading.hide()
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
            if (jsonArr.code === 0) {
              MessageBox.alert(`已成功导入`)
            } else {
              MessageBox.alert(jsonArr.msg)
            }
          }
        })
      }
    })
    // 下载导入参考标注区域范围模板
    this.dom.find(".refer-annotated-area-template").on("click", () => {
      Tool.downloadLocalFile('/images/page/导入参考标注区域范围模板.xlsx', '导入参考标注区域范围模板.xlsx', this.app)
    })
    // 下载已导入参考标注区域范围数据
    this.dom.find(".download-refer-annotated-area").on("click", async () => {
      const res = await this.api.exportReferAnnotatedArea({ // post请求
        projectId: this.projectId,
        useCallerHandler: true // 此接口报错功能层不处理，让调用方自行处理
      })
      Tool.exportCSVFile(res, `已导入参考标注区域范围数据.csv`)
    })
  }

  bindUploadAuxiliarySequenceEvent() {
    // 导入辅助序列
    this.dom.find("#auxiliarySequenceFile").on("change", () => {
      let filePath = ES.selctorDoc("#auxiliarySequenceFile").val()
      let fileType = this.getFileType(filePath)
      if ("csv" !== fileType) {
        MessageBox.alert('格式错误，上传失败。')
      } else {
        this.app.loading.show()
        $.ajaxFileUpload({
          url: "/aaa/v1/project/series/auxiliary_series/import",
          secureuri: false,
          dataType: "JSON",
          timeout: 60000,
          async: false,
          data: {
            projectId: this.projectId,
            accessToken: window.localStorage.accessToken
          },
          type: "post",
          fileElementId: "auxiliarySequenceFile",
          sequentialUploads: true,
          beforeSend: function(xhr, data) {
            xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
          },
          success: (data, status, e) => {
            this.app.loading.hide()
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
            if (jsonArr.code === 0) {
              MessageBox.alert(`已成功导入序列数${jsonArr.data.successCount}条`)
            } else {
              MessageBox.alert(jsonArr.msg)
            }
          }
        })
      }
    })
  }

  // 导入算法分割结果
  bindUploadAlgorithmSegmentationResultsEvent() {
    this.dom.find("#algorithmSegmentationResultsFile").on("change", () => {
      let filePath = ES.selctorDoc("#algorithmSegmentationResultsFile").val()
      let fileType = this.getFileType(filePath)
      if (!['xlsx', 'xls'].includes(fileType)) {
        MessageBox.alert('格式错误，上传失败。')
      } else {
        this.app.loading.show()
        $.ajaxFileUpload({
          url: "/aaa/v1/heartSegment/mergemask7/import",
          secureuri: false,
          dataType: "JSON",
          timeout: 60000,
          async: false,
          data: {
            projectId: this.projectId,
            accessToken: window.localStorage.accessToken
          },
          type: "post",
          fileElementId: "algorithmSegmentationResultsFile",
          sequentialUploads: true,
          beforeSend: function(xhr, data) {
            xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
          },
          success: (data, status, e) => {
            this.app.loading.hide()
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
            if (jsonArr.code === 0) {
              MessageBox.alert('已成功导入')
              this.vuePage.heartSegmentResultRead('MERGE7') // 合并MASK结果
            } else {
              MessageBox.alert(jsonArr.msg)
            }
          }
        })
      }
    })
  }
  // loadmodules(data) {
  //   this.dropobj = {}
  //   let dropConfig = [
  //     {
  //       name: "algType",
  //       className: "xlk",
  //       firstSelect: {
  //         val: "算法模型",
  //         idx: ""
  //       },
  //       data: Tool.configxlkformat(this.app.constmap["ALG_VERSION"])
  //     },
  //     {
  //       name: "versionNumber",
  //       className: "xlk",
  //       firstSelect: {
  //         val: "模型版本",
  //         idx: ""
  //       },
  //       data: [],
  //       datatype: "arr"
  //     }
  //   ]
  //   require.ensure("../moduleslibs/dropdown1/drop.js", () => {
  //     let dropdown = require("../moduleslibs/dropdown1/drop.js")
  //     dropConfig.forEach((val, idx) => {
  //       let drop = this.app.loadModule(
  //         dropdown,
  //         this.dom.find("." + val.name),
  //         {
  //           className: val.className,
  //           firstSelect: val.firstSelect,
  //           data: val.data,
  //           input: val.input,
  //           datatype: val.datatype
  //         }
  //       )
  //       this.dropobj[val.name] = drop
  //     })
  //     this.dropobj["algType"].event._addEvent("option.click", value => {
  //       this.algType = value.idx
  //       let arr = []
  //       this.app.constmap["ALG_VERSION"].children.forEach(v => {
  //         if (value.idx == v.value) {
  //           arr = v.remark.split("/")
  //         }
  //       })
  //       this.dropobj["versionNumber"].renderHtml(arr)
  //       this.dropobj["versionNumber"].reset()
  //       this.versionNumber = null
  //     })
  //     this.dropobj["algType"].event._addEvent("dropDown.clear", val => {
  //       this.algType = null
  //       this.dropobj["versionNumber"].renderHtml([])
  //     })
  //     this.dropobj["versionNumber"].event._addEvent("option.click", val => {
  //       this.versionNumber = val.idx
  //     })
  //     this.dropobj["versionNumber"].event._addEvent("dropDown.clear", val => {
  //       this.versionNumber = null
  //     })
  //     if (data) {
  //       this.dom
  //         .find('.algType .option[data-idx="' + data.algType + '"]')
  //         .click()
  //       this.dom
  //         .find('.versionNumber .option[data-idx="' + data.versionNumber + '"]')
  //         .click()
  //     }
  //   })
  // }
  // async heartSegment_resultRead() {
  //   let res = await this.api.heartSegment_resultRead({
  //     projectId: this.projectId
  //   })
  //   if (res.code == 0) {
  //     if (res.data.algType) {
  //       this.algType = res.data.algType
  //       let alg = ""
  //       Tool.configxlkformat(this.app.constmap["ALG_VERSION"]).forEach(v => {
  //         if (v.idx == res.data.algType) {
  //           alg = v.val
  //         }
  //       })
  //       this.dom.find(".algArea").html(`<p>算法模型：${alg}</p>`)
  //       this.dom
  //         .find(".algArea")
  //         .append(`<p>模型版本:<span class="versionNumber">${this.versionNumber ? this.versionNumber : ""}</span></p>
  //           <p>成功数量：${res.data.successCount},失败数量：${res.data.failCount},处理中数量：${res.data.processCount},未开始数量：${res.data.notStartCount}</p>`
  //         )
  //     } else {
  //       this.loadmodules()
  //     }
  //     this.dom.find(".start").on("click", () => {
  //       if (!this.algType || !this.versionNumber) {
  //         this.app.alert.show({
  //           title: " ",
  //           msg: "请先选择算法模型和模型版本",
  //           close: true
  //         })
  //       } else {
  //         this.app.alert.show({
  //           title: " ",
  //           msg: "确认开启吗？",
  //           close: true,
  //           sure: () => {
  //             let config = [
  //               {
  //                 name: "taskType",
  //                 type: "radio",
  //                 title: "请选择类型",
  //                 check: "empty",
  //                 remark: "",
  //                 data: [
  //                   {
  //                     val: "强制重跑",
  //                     idx: "3"
  //                   },
  //                   {
  //                     val: "处理失败",
  //                     idx: "2"
  //                   },
  //                   {
  //                     val: "新增序列",
  //                     idx: "1"
  //                   }
  //                 ]
  //               }
  //             ]
  //             this.editconclusion = this.app.loadModal(
  //               this.formsubmit,
  //               {
  //                 adv: true
  //               },
  //               {
  //                 title: "选择类型",
  //                 config: config
  //               }
  //             )
  //             this.editconclusion.event._addEvent(
  //               "formsubmit.submit",
  //               async data => {
  //                 let msg = ""
  //                 this.app.loading.show()
  //                 let resjson = await this.api.project_joinAlg({
  //                   projectId: this.projectId,
  //                   joinAlg: true
  //                 })
  //                 this.app.loading.hide()
  //                 if (resjson.code == 0) {
  //                   this.app.loading.show()
  //                   let res = await this.api.heartSegment_start({
  //                     projectId: this.projectId,
  //                     taskType: data.taskType,
  //                     algType: this.algType,
  //                     versionNumber: this.versionNumber
  //                   })
  //                   this.app.loading.hide()
  //                   if (res.code == 0) {
  //                     msg = "开启成功"
  //                     this.dom.find(".algArea").html("<p>结果正在处理中</p>")
  //                   } else {
  //                     msg = res.msg
  //                   }
  //                   this.editconclusion.close()
  //                 } else {
  //                   msg = resjson.msg
  //                 }
  //                 this.app.alert.show({
  //                   title: " ",
  //                   msg: msg,
  //                   close: true,
  //                   footer: true
  //                 })
  //               }
  //             )
  //           }
  //         })
  //       }
  //     })

  //     this.dom.find(".export-result").on("click", () => {
  //       const obj = {
  //         projectId: this.projectId
  //       }
  //       const url = `${this.app.domain1}v1/heartSegment/export?param=${encodeURIComponent(JSON.stringify(obj))}`
  //       this.api.HttpRequest.downLoadFile(url, {
  //         key: "accessToken",
  //         val: this.app.local.get("accessToken")
  //       })
  //     })
  //   } else {
  //     Tool.errorshow(res.msg, this.app)
  //   }
  // }

  async project_basic_read() {
    let res = await this.api.project_basic_read({
      id: this.projectId
    })
    if (res.code === 0) {
      const resData = res.data || {}
      this.projectBasicData = resData
      // 设置prjectData
      this.vuePage.initProjectData(resData)

      const { algType, haveMaskResult, versionNumber, seriesImgFileType } = resData
      this.seriesImgFileType = seriesImgFileType
      // if (algType) {
      //   if (haveMaskResult) {
      //     // this.versionNumber = versionNumber || ""
      //     // this.dom.find(".versionNumber").html(versionNumber)
      //   } else {
      //     // this.loadmodules(resData)
      //   }
      // }
      // C端病理大图时，序列改为切片
      this.setBLName(seriesImgFileType)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  // 当seriesImgFileType=15 C端病理大图时，序列改为切片
  setBLName(seriesImgFileType) {
    if (seriesImgFileType === 15) {
      const doms = this.dom.find('.sequence-item').dom
      doms && doms.forEach((dom) => dom.html(dom.html().replace('序列', '切片')))
    }
  }

  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf(".")
    if (startIndex != -1)
      return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
    else return ""
  }

  download(value) {
    let sting1 = encodeURI(JSON.stringify(this.apidata))
    let url =
      this.app.domain1 +
      "v1/project/series/export?projectId=" +
      this.projectId +
      "&operation=" +
      value +
      ""
    Tool.downfile(url, this.app)
  }
  //清空序列
  async clearandnew() {
    let json = {
      projectId: this.projectId
    }
    this.app.loading.show()
    let res = await this.api.clearseries(json)
    this.app.loading.hide()
    if (res.code == 0) {
      this.addimage(1)
      this.addmodel.close()
      this.addmodel = null
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  //添加序列
  async addimage(value) {
    if (this.model.getData("listInfo").list.length > 0) {
      this.dom.find(".viewimage").removeClass("hide")
      // that.model.getData('listInfo').list.forEach(function (val,idx) {
      //     that.apiData.seriesInstanceUidList.push(val.seriesInstanceUID);
      // })
      this.apiData.operation = value
      this.app.loading.show()
      let res = await this.api.updateproimage(this.apiData)
      this.app.loading.hide()
      if (res.code == 0) {
        this.addmodel.close()
        this.addmodel = null
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    } else {
      //this.dom.find('.viewimage').addClass('hide')
      this.getseries()
    }
  }
  //获取医院列表
  async gethospital(value, value2) {
    if (this.prodatapoll && this.prodatapoll.yymc) {
      this.prodatapoll.yymc.loading(true)
    }
    if (
      this.addmodel &&
      this.addmodel.duoxuanobj &&
      this.addmodel.duoxuanobj.hospitalCode
    ) {
      this.addmodel.duoxuanobj.hospitalCode.loading(true)
    }
    let json1 = {
      service: "DR",
      method: "/v1/hospital/search",
      params: JSON.stringify({
        code: value
      })
    }
    let res = await this.api.gethospital(json1)
    if (this.prodatapoll && this.prodatapoll.yymc) {
      this.prodatapoll.yymc.loading(false)
    }
    if (
      this.addmodel &&
      this.addmodel.duoxuanobj &&
      this.addmodel.duoxuanobj.hospitalCode
    ) {
      this.addmodel.duoxuanobj.hospitalCode.loading(false)
    }
    if (res.code == 0) {
      let list = []
      res.data.list.forEach(function(val, idx) {
        let obj = {
          idx: val.code,
          val: val.code
        }
        list.push(obj)
      })
      this.model.setData("hospitalInfo", list)
      if (this.prodatapoll) {
        this.prodatapoll.resetxlk(list)
      }
      if (value2) {
        this.model.setData("totalInfo", res.data)
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  //查询可添加的序列
  async getlist(value, value2) {
    this.app.loading.show()
    let json = {
      service: "DR",
      method: "/v1/series/search",
      params: JSON.stringify(value)
    }
    let res = await this.api.getimage(json)
    this.app.loading.hide()
    if (res.code == 0) {
      if (value2) {
        this.model.listInfo = res.data
        this.model.setData("totalInfo", res.data)
      } else {
        this.model.setData("listInfo", res.data)
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  //查询项目下配置的所有工具
  async alg_sar_list_tool() {
    let json = {
      projectId: this.projectId
    }
    this.toolList = []
    let res = await this.api.alg_sar_list_tool(json)
    if (res.code == 0) {
      res.data.forEach(val => {
        this.toolList.push({
          val: val.type,
          idx: val.id + "," + val.type
        })
      })
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  //查询已导入算法数据
  async queryImportResult() {
    let res = await this.api.get_import_result_list_search({
      projectId: this.projectId,
      page: 1,
      pageSize: 10
    })
    let alglist = this.app.loadModal(
      this.alglist,
      {
        adv: true
      },
      {
        data: res.data
      }
    )
    alglist.event._addEvent("alglist.listaction", async value => {
      switch (value.classname) {
        case "delete":
          break
        case "viewfail":
          let param = encodeURI(
            JSON.stringify({
              resourceId: value.id.split(",")[1]
            })
          )
          this.api.HttpRequest.downLoadFile(
            `${this.app.domain1}v1/base/fileResource/download?param=${param}&&accessToken=${window.localStorage.accessToken}`
          )
          break
      }
    })
    alglist.event._addEvent("alglist.pagenumber", async value => {
      let res = await this.api.get_import_result_list_search({
        projectId: this.projectId,
        page: value,
        pageSize: 10
      })
      alglist.setList(res.data, false)
    })
  }
  //渲染已引用该项目的任务列表头部
  // setTitle() {
  //   let obj = {}
  //   let obj1 = {}
  //   obj["icon"] = {
  //     taskName: {
  //       name: '<span data-i18n="age" data-name="年龄">任务名称</span>',
  //       type: "text",
  //       code: "checkid",
  //       w: "20%",
  //       ww: "20%",
  //       n: "40"
  //     },
  //     startTime: {
  //       name: '<span data-i18n="age" data-name="年龄">任务发布时间</span>',
  //       type: "text",
  //       code: "pid",
  //       w: "20%",
  //       ww: "20%"
  //     },
  //     endTime: {
  //       name: '<span data-i18n="age" data-name="年龄">任务到期时间</span>',
  //       type: "text",
  //       code: "pname",
  //       w: "20%",
  //       ww: "20%"
  //     },
  //     studyTotalCount: {
  //       name: '<span data-i18n="age" data-name="年龄">样本数量</span>',
  //       type: "text",
  //       code: "psex",
  //       w: "20%",
  //       ww: "20%"
  //     },
  //     vendors: {
  //       name: '<span data-i18n="age" data-name="年龄">派发公司</span>',
  //       type: "text",
  //       code: "age",
  //       w: "20%",
  //       ww: "20%"
  //     }
  //   }
  //   obj["type"] = "center"
  //   obj["chose"] = "all"
  //   obj["chosew"] = "30px"
  //   obj["initPagina"] = false
  //   obj["pagesizeSet"] = false
  //   obj["tablewidth"] = ES.selctorDoc(".yyytasklist").box().clientWidth - 40
  //   require.ensure("../moduleslibs/table/table", () => {
  //     let cont_table = require("../moduleslibs/table/table")
  //     this.table = this.app.loadModule(
  //       cont_table,
  //       this.dom.find(".yyytasklist"),
  //       {
  //         id: "yyytasklist",
  //         header: obj
  //       }
  //     )
  //     this.table.event._addEvent("table.pagenumber", value => {
  //       this.viewData.page = parseInt(value)
  //       this.table.changenum(this.viewData.page)
  //       this.setMain()
  //     })
  //     this.table.event._addEvent("table.pagesize", value => {
  //       this.viewData.pageSize = value.num
  //       this.viewData.page = 1
  //       this.setMain(true)
  //     })
  //     this.dom.find(".list-content").removeClass("hide")
  //     this.viewData.page = 1
  //     this.viewData.projectIdList = []
  //     this.viewData.projectIdList.push(parseInt(this.projectId))
  //     this.viewData.pagesize = 10
  //     this.setMain(true)
  //   })
  // }
  //渲染已引用该项目的任务列表
  async setMain(bool) {
    let data2 = []
    this.table.showloading()
    let res = await this.api.task_stayClone_search({
      projectId: this.projectId
    })
    if (res.code == 0) {
      if (res.data.length > 0) {
        res.data.forEach((val, idx) => {
          let obj = {}
          obj.id = val.taskId
          val.id = val.taskId
          val.vendors = ""
          if (val.venderNameList.length && val.venderNameList.length > 0) {
            val.venderNameList.forEach(function(v, i) {
              val.vendors += v
              if (i != val.venderNameList.length - 1) {
                val.vendors += "、"
              }
            })
          }
          data2.push(obj)
          val.startTime = Tool.time(val.startTime, "yyyy-mm-dd")
          val.endTime = Tool.time(val.endTime, "yyyy-mm-dd")
        })
        this.table.setData(res.data, data2)
      } else {
        this.table.noData()
        this.dom.find(".copytask").addClass("hide")
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.table.getTotal(res.data.pages, 2, res.data.total)
    }
    this.resize()
    this.initscroll()
  }
  //获取序列列表
  async getseries(value) {
    if (value) {
      value.projectId = this.projectId
    } else {
      value = {
        projectId: this.projectId,
        page: 1,
        pageSize: 10
      }
    }
    this.app.loading.show()
    let res = await this.api.getproimage(value)
    this.app.loading.hide()
    if (res.code == 0) {
      this.projectseries = res.data.list
      if (res.data.list && res.data.list.length > 0) {
        this.dom.find(".viewimage").removeClass("hide")
      }
      this.prodatapoll.setMain(res, this.resetPage)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
  //查询该项目下序列数
  async series_count(change) {
    this.app.loading.show()
    let res = await this.api.series_count({
      projectId: this.projectId
    })
    this.count = res.data.count
    this.app.loading.hide()
    if (res.data.count > 0) {
      this.dom.find(".viewimage").removeClass("hide")
    } else {
      this.dom.find(".viewimage").addClass("hide")
    }
    if (change) {
      this.model.setData("count", res.data.count)
      this.preview_count()
    }
  }
  //项目预览时判断是否有序列
  preview_count() {
    if (this.model.count > 0) {
      let page = this.bigPic ? "drapCanvasView" : "markpreview"
      window.location.href =
         window.location.origin +
        "/#!/" +
        page +
        "/1/" +
        this.projectId +
        "/preview/" +
        this.app.parpam.status +
        "/" +
        this.projectType
      window.location.reload()
    } else {
      this.app.alert.show({
        title: " ",
        msg: "项目下不存在影像序列，请先添加",
        close: true,
        footer: true
      })
    }
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 40
    ES.selctorDoc(".createprothree").css({
      height: ch,
      width: cw
    })
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc(".createprothree").attr("id", rid)
    this.myScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    })
  }
}

module.exports = createprothree
