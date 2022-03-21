class createbackflowpro4 extends Interstellar.pagesBase {
  complete() {
    let that = this
    this.projectId = parseInt(this.app.parpam.projectid)
    this.type = this.app.parpam.type
    this.projectType = 3
    this.app.header.openControl("backflowproject")
    this.app.header.changeselected(4)
    this.styleModel(1)
    this.resize()
    // this.render()
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
      this.dom.find(".yyytask").removeClass("hide")
      this.setTitle()
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
      let temphtml =
        '<a class="biaozhubtn deleteres">删除查询结果</a>\n' +
        '            <a class="biaozhubtn exportname">导出结果序列名</a>'
      this.prodatapoll = this.app.loadModal(
        this.prodata,
        {
          adv: true
        },
        {
          type: "custom",
          html: temphtml,
          del: this.type
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
    this.dom.find(".viewsfdata").on("click", () => {
      this.queryImportResult()
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
    this.dom.find(".downtemplete").on("click", () => {
      this.app.loading.show()
      setTimeout(() => {
        this.app.loading.hide()
      }, 1000)
      var a = document.createElement("a")
      var url = "/images/page/s.csv"
      a.href = url
      a.download = "模板.csv"
      a.click()
    })
    this.dom.find(".copytask").on("click", async () => {
      let taskIdList = []
      if (this.dom.find(".list-content .choose").dom) {
        this.dom.find(".list-content .choose").dom.forEach(val => {
          console.log(val.parent().parent())
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
    this.dom.find(".batchexport").on("click", async () => {
      let taskIdList = []
      if (this.dom.find(".list-content .choose").dom) {
        this.dom.find(".list-content .choose").dom.forEach(val => {
          taskIdList.push(val.parent().parent().attr("nowid"))
        })
        const url = this.app.domain1 + "v1/anno/series_result/batch_export/csv?taskIds=" + taskIdList + "&type=TASK"
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        })
      } else {
        this.app.alert.show({
          title: "",
          template:
            '<span style="font-size: 18px;margin-left:20px;">请先选择需要导出的任务</span>',
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
    this.project_basic_read()
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
          timeout: 60000,
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
            console.log(data, "data", status, e)
            console.log(data.match(/{.+}/g))
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
            this.app.loading.hide()
            if (jsonArr.code == 0) {
              console.log("success")
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
  loadmodules(data) {
    this.dropobj = {}
    let dropConfig = [
      {
        name: "algType",
        className: "xlk",
        firstSelect: {
          val: "算法模型",
          idx: ""
        },
        data: Tool.configxlkformat(this.app.constmap["ALG_VERSION"])
      },
      {
        name: "versionNumber",
        className: "xlk",
        firstSelect: {
          val: "模型版本",
          idx: ""
        },
        data: [],
        datatype: "arr"
      }
    ]
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
            input: val.input,
            datatype: val.datatype
          }
        )
        this.dropobj[val.name] = drop
      })
      this.dropobj["algType"].event._addEvent("option.click", value => {
        this.algType = value.idx
        let arr = []
        this.app.constmap["ALG_VERSION"].children.forEach(v => {
          if (value.idx == v.value) {
            arr = v.remark.split("/")
          }
        })
        this.dropobj["versionNumber"].renderHtml(arr)
        this.dropobj["versionNumber"].reset()
        this.versionNumber = null
      })
      this.dropobj["algType"].event._addEvent("dropDown.clear", val => {
        this.algType = null
        this.dropobj["versionNumber"].renderHtml([])
      })
      this.dropobj["versionNumber"].event._addEvent("option.click", val => {
        this.versionNumber = val.idx
      })
      this.dropobj["versionNumber"].event._addEvent("dropDown.clear", val => {
        this.versionNumber = null
      })
      if (data) {
        this.dom
          .find('.algType .option[data-idx="' + data.algType + '"]')
          .click()
        this.dom
          .find('.versionNumber .option[data-idx="' + data.versionNumber + '"]')
          .click()
      }
    })
  }
  async project_basic_read() {
    let res = await this.api.project_basic_read({
      id: this.projectId
    })
    if (res.code == 0) {
      // let toolArr = []
      // toolArr = res.data.algResultType.split(',')
      if (res.data.algType) {
        if (res.data.haveMaskResult) {
          this.versionNumber = res.data.versionNumber
            ? res.data.versionNumber
            : ""
          this.dom.find(".versionNumber").html(res.data.versionNumber)
        } else {
          this.loadmodules(res.data)
        }
      }
      // if (toolArr.length > 0) {
      //     this.dom.find('.isgetalgres .radio-box').click()
      //     toolArr.forEach((val) => {
      //         this.dom.find('.toolChoose p[data-id="' + val + '"').find('.check-box').addClass('choose')
      //     })
      // }
    } else {
      Tool.errorshow(res.msg, this.app)
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
      console.log(value)
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
      console.log(value, "page")
      let res = await this.api.get_import_result_list_search({
        projectId: this.projectId,
        page: value,
        pageSize: 10
      })
      alglist.setList(res.data, false)
    })
  }
  //渲染已引用该项目的任务列表头部
  setTitle() {
    let obj = {}
    let obj1 = {}
    obj["icon"] = {
      taskId: {
        name: '<span data-i18n="age" data-name="年龄">任务ID</span>',
        type: "text",
        code: "tid",
        w: "10%",
        ww: "10%"
      },
      taskName: {
        name: '<span data-i18n="age" data-name="年龄">任务名称</span>',
        type: "text",
        code: "checkid",
        w: "20%",
        ww: "20%"
      },
      startTime: {
        name: '<span data-i18n="age" data-name="年龄">任务发布时间</span>',
        type: "text",
        code: "pid",
        w: "15%",
        ww: "15%"
      },
      endTime: {
        name: '<span data-i18n="age" data-name="年龄">任务到期时间</span>',
        type: "text",
        code: "pname",
        w: "15%",
        ww: "15%"
      },
      studyTotalCount: {
        name: '<span data-i18n="age" data-name="年龄">样本数量</span>',
        type: "text",
        code: "psex",
        w: "10%",
        ww: "10%"
      },
      submittedStudyCount: {
        name: '<span data-i18n="age" data-name="年龄">已提交序列数</span>',
        type: "text",
        code: "psex",
        w: "10%",
        ww: "10%"
      },
      vendors: {
        name: '<span data-i18n="age" data-name="年龄">派发公司</span>',
        type: "text",
        code: "age",
        w: "20%",
        ww: "20%"
      }
    }
    obj["type"] = "center"
    obj["chose"] = "all"
    obj["chosew"] = "30px"
    obj["initPagina"] = false
    obj["pagesizeSet"] = false
    obj["tablewidth"] = ES.selctorDoc(".yyytasklist").box().clientWidth - 40
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table")
      this.table = this.app.loadModule(
        cont_table,
        this.dom.find(".yyytasklist"),
        {
          id: "yyytasklist",
          header: obj
        }
      )
      this.table.event._addEvent("table.pagenumber", value => {
        this.viewData.page = parseInt(value)
        this.table.changenum(this.viewData.page)
        this.setMain()
      })
      this.table.event._addEvent("table.pagesize", value => {
        this.viewData.pageSize = value.num
        this.viewData.page = 1
        this.setMain(true)
      })
      this.dom.find(".list-content").removeClass("hide")
      this.viewData.page = 1
      this.viewData.projectIdList = []
      this.viewData.projectIdList.push(parseInt(this.projectId))
      this.viewData.pagesize = 10
      this.setMain(true)
    })
  }
  //渲染已引用该项目的任务列表
  async setMain(bool) {
    let data2 = []
    this.table.showloading()
    let res = await this.api.task_stayClone_search({
      projectId: this.projectId
    })
    if (res.code == 0) {
      if (res.data.length > 0) {
        this.dom.find(".copytask").removeClass("hide")
        // 判断有没有批量导出权限start
        let permission = this.app.userResource[
          ES.selctorDoc('.menu .twolink[link="audittask"]')
            .parent()
            .attr("id")
        ]
        if (permission && permission.length > 0) {
          permission.forEach(v => {
            switch (v.type) {
              case "EXPORT":
                this.dom.find(".batchexport").removeClass("hide")
                break
            }
          })
        }
        // 判断有没有批量导出权限end
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
        // this.dom.find(".copytask").addClass("hide")
        // this.dom.find(".batchexport").addClass("hide")
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

module.exports = createbackflowpro4
