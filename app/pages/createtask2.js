//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import { MessageBox } from 'element-ui'
class createtask2 extends Interstellar.pagesBase {
  complete() {
    let that = this
    this.apidata = {}
    this.apidata.condition = null
    this.apidata.remark = ""
    this.type = this.app.parpam.type
    this.taskId = this.app.parpam.taskid * 1
    this.projectId = this.app.parpam.projectid * 1
    this.prodata = require("../modal/projectdata/projectdata")
    this.exportdata = require("../modal/exportdata/exportdata")
    this.listshow = require("../modal/listshow/listshow")
    this.app.header.openControl("taskmanage")
    this.app.header.changeselected(2)
    this.styleModel(1)
    this.task_series_count()
    this.task_read()

    this.dom.find(".yrdata").on("click", function() {
      if (!ES.selctorDoc(this).hasClass("disabled")) {
        that.prodatapoll = that.app.loadModal(
          that.prodata,
          { adv: true },
          {
            type: "add",
            id: that.taskId,
            seriesImgFileType: that.seriesImgFileType
          }
        )
        that.resetPage = true
        that.prodatapoll.event._addEvent("projectdata.addall", async value => {
          that.apidata.condition = value.query
          that.apidata.operation = 1
          that.apidata.taskId = that.taskId
          that.apidata.randomAddNum = parseInt(value.randomAddNum)
          that.apidata.currentSearchReqId = value.currentSearchReqId
          delete that.apidata.condition.page
          delete that.apidata.condition.pageSize
          that.app.loading.show()
          let res = await that.api.updateseries(that.apidata)
          that.app.loading.hide()
          if (res.code == 0) {
            that.task_series_count()
            if (value.total > 0) {
              that.dom.find(".yyrarea").removeClass("hide")
              that.dom.find(".yyr .num").html(value.total)
            }
          } else {
            Tool.errorshow(res.msg, that.app)
          }
          that.prodatapoll.close()
        })
        that.prodatapoll.event._addEvent("projectdata.search", value => {
          that.resetPage = true
          that.model.setData("proseriesdata", value.data)
        })
        that.prodatapoll.event._addEvent("projectdata.datachange", () => {
          that.resetPage = true
          that.task_series_count()
        })
        that.prodatapoll.event._addEvent("hospital.input", value => {
          that.getxlvalue(value)
        })
        that.prodatapoll.event._addEvent("projectdata.taskinput", value => {
          that.gettask(value)
        })
        that.prodatapoll.event._addEvent("prodata.pagenumber", value => {
          that.resetPage = false
          that.model.setData("proseriesdata", value.data)
        })
        that.prodatapoll.event._addEvent("prodata.pagesize", value => {
          that.resetPage = true
          that.model.setData("proseriesdata", value.data)
        })
        that.getxlvalue("")
        that.model.setData("proseriesdata", {
          page: 1,
          pageSize: 10,
          assigned: false,
          needCache: true
        })
      }
    })
    this.model._event._addEvent("proseriesdata.change", async () => {
      let json = this.model.getData("proseriesdata")
      json["projectId"] = this.projectId
      json["needCache"] = true
      this.app.loading.show()
      let res = await this.api.getproseries(json)
      this.app.loading.hide()
      if (res.code == 0) {
        if (this.resetPage) {
          this.prodatapoll.setMain(res, true)
        } else {
          this.prodatapoll.setMain(res)
        }
      } else {
        Tool.errorshow(res.msg, that.app)
      }
    })
    this.model._event._addEvent("querytask.change", () => {
      this.gettaskseries()
    })
    this.dom.find(".yyr").on("click", () => {
      this.prodatapoll = this.app.loadModal(
        this.prodata,
        { adv: true },
        {
          type: "view",
          candel: this.type === "view" ? false : true,
          seriesImgFileType: that.seriesImgFileType
        }
      )
      this.prodatapoll.event._addEvent("prodata.pagenumber", value => {
        this.resetPage = false
        this.model.setData("querytask", value.data)
      })
      this.prodatapoll.event._addEvent("prodata.pagesize", value => {
        this.resetPage = true
        this.model.setData("querytask", value.data)
      })
      this.prodatapoll.event._addEvent("hospital.input", value => {
        this.getxlvalue(value)
      })
      this.prodatapoll.event._addEvent("projectdata.search", value => {
        delete value.data.assigned
        delete value.data.taskIdList
        value.data.seriesSubmitCount = value.data.seriSubmitCount
        //delete value.data.seriSubmitCount;
        value.data.taskId = this.taskId
        value.data.needCache = true
        this.resetPage = true
        this.model.setData("querytask", value.data)
      })
      this.prodatapoll.event._addEvent(
        "projectdata.deleteresult",
        async value => {
          if (value.totalnum == 0) {
            this.app.alert.show({
              title: " ",
              msg: "查询结果为空",
              close: true,
              footer: true
            })
          } else {
            this.apidata.condition = null
            delete value.data.page
            delete value.data.pageSize
            let json = {
              taskId: this.taskId,
              condition: value.data,
              currentSearchReqId: value.currentSearchReqId
            }
            this.app.loading.show()
            let res = await this.api.searchresult_remove(json)
            this.app.loading.hide()
            if (res.code == 0) {
              this.task_series_count()
            } else {
              Tool.errorshow(res.msg, this.app)
            }
            this.model.setData("proseriesdata", {
              page: 1,
              pageSize: 10,
              assigned: false
            })
          }
        }
      )
      this.prodatapoll.event._addEvent("projectdata.exportresult", value => {
        if (value.totalnum == 0) {
          this.app.alert.show({
            title: " ",
            msg: "查询结果为空，不支持导出。",
            close: true,
            footer: true
          })
        } else {
          delete value.data.assigned
          delete value.data.taskIdList
          delete value.data.page
          delete value.data.pageSize
          let json = {
            taskId: this.taskId,
            condition: value.data,
            currentSearchReqId: value.currentSearchReqId,
            operation: "URL"
          }
          let url =
            this.app.domain1 +
            "v1/task/series/searchresult/export?param=" +
            encodeURI(
              JSON.stringify(json) +
                "&accessToken=" +
                window.localStorage.accessToken
            )
          this.api.HttpRequest.downLoadFile(url, {
            key: "accessToken",
            val: this.app.local.get("accessToken")
          })
        }
      })
      this.getxlvalue("")
      this.resetPage = true
      this.model.setData("querytask", { page: 1, pageSize: 10 })
    })
    this.dom.find(".choosePart .radio-box").on("click", async function() {
      let dom = ES.selctorDoc(this)
      if (dom.hasClass("choose")) {
        that.app.alert.show({
          title: "",
          template:
            '<span style="font-size: 18px;margin-left:20px;">确认取消部分标注吗</span>',
          sure: async () => {
            dom.removeClass("choose")
            that.dom.find(".exportArea").addClass("hide")
            let res = await that.api.task_portionAnno({
              taskId: that.taskId * 1,
              portionAnno: false
            })
            if (res.code == 0) {
            } else {
              Tool.errorshow(res.msg, this.app)
            }
          },
          close: true
        })
      } else {
        dom.addClass("choose")
        that.dom.find(".exportArea").removeClass("hide")
        let res = await that.api.task_portionAnno({
          taskId: that.taskId * 1,
          portionAnno: true
        })
        if (res.code == 0) {
        } else {
          Tool.errorshow(res.msg, this.app)
        }
      }
    })
    this.dom.find(".choosePart .export").on("click", () => {
      this.exportData = this.app.loadModal(this.exportdata, { adv: true }, {})
      this.exportData.event._addEvent("uploadalgdata.upload", value => {
        if (this.seriesCount <= 0) {
          that.app.alert.show({
            title: "",
            template:
              '<span style="font-size: 18px;margin-left:20px;">请先引入影像文件</span>',
            sure: false,
            close: true,
            footer: true
          })
          return
        }
        let filePath = ES.selctorDoc("#file1").val()
        let fileType = Tool.getFileType(filePath)
        if ("xlsx" !== fileType && "xls" !== fileType) {
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
          this.app.loading.show()
          $.ajaxFileUpload({
            url: "/aaa/v1/task/series/import/needAnno", // that.app.domain+'/ccc/user/import',
            secureuri: false,
            dataType: "JSON",
            async: false,
            data: {
              taskId: this.taskId * 1,
              accessToken: window.localStorage.accessToken
            },
            type: "post",
            fileElementId: "file1",
            success: (data, status, e) => {
              this.app.loading.hide()
              let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
              that.exportData.close()
              console.log(jsonArr, "jsonAee")
              if (jsonArr.code == 0) {
                this.app.alert.show({
                  title: "",
                  template:
                    '<span style="font-size: 18px;margin-left:20px;">成功导入' +
                    jsonArr.data.successCount +
                    "条，失败" +
                    jsonArr.data.errorCount +
                    "条</span>",
                  sure: false,
                  close: true,
                  footer: true
                })
                this.event._dispatch("projectdata.datachange")
              } else {
                let msg = jsonArr.code == -1 ? "繁忙" : jsonArr.msg
                this.app.alert.show({
                  title: "",
                  template:
                    '<span style="font-size: 18px;margin-left:20px;">' +
                    msg +
                    "</span>",
                  sure: false,
                  close: true,
                  footer: true
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
    })
    let config = {
      icon: {
        seriesTotalCount: {
          name: '<span data-i18n="age" data-name="年龄">总序列数</span>',
          type: "text",
          code: "checkid",
          w: "20%",
          ww: "20%",
          n: "40"
        },
        successCount: {
          name: '<span data-i18n="age" data-name="年龄">匹配序列数</span>',
          type: "text",
          code: "checkid",
          w: "20%",
          ww: "20%"
        },
        errorCount: {
          name: '<span data-i18n="age" data-name="年龄">未匹配序列数</span>',
          type: "text",
          code: "pid",
          w: "20%",
          ww: "20%"
        },
        importTime: {
          name: '<span data-i18n="age" data-name="年龄">导入时间</span>',
          type: "text",
          code: "pname",
          w: "20%",
          ww: "20%"
        },
        action: {
          name: '<span data-i18n="age" data-name="年龄">操作</span>',
          type: "action",
          code: "pname",
          w: "20%",
          ww: "20%"
        }
      },
      type: "center",
      tablewidth: 800,
      operation: {
        export: { dis: "inline", link: "noLink", content: "导出" }
      }
    }
    this.dom.find(".choosePart .viewexported").on("click", async () => {
      this.listShow = this.app.loadModal(
        this.listshow,
        { adv: true },
        { headerconfig: config, title: "查看指定序列" }
      )
      let res = await this.api.task_series_import_infoList({
        taskId: that.taskId,
        page: 1,
        pageSize: 10
      })
      this.listShow.setMain(res, true)
      this.listShow.event._addEvent("listshow.change", async value => {
        let res = await this.api.task_series_import_infoList({
          taskId: that.taskId,
          page: value.page,
          pageSize: value.pageSize
        })
        this.listShow.setMain(res, value.refreshPage)
      })
      this.listShow.event._addEvent("listshow.action", async value => {
        console.log(value, "value")
        that.api.HttpRequest.downLoadFile(
          `${that.app.domain1}v1/task/series/import/infoList/export?id=${value.id}&accessToken=${window.localStorage.accessToken}`
        )
      })
    })
    if (this.type == "view") {
      this.dom.find(".yrdata").addClass("hide")
      this.dom.find(".peizhun-import-btn").addClass("hide") // 随访配准导入按钮
      this.dom.find(".exportArea .export").addClass("hide")
      this.dom.find(".choosePart .radio-box").off("click")
    }

    // 初始化随访配准的导入按钮事件
    this.initPeizhunImportBtn()
  }

  // 初始化随访配准的导入按钮事件
  initPeizhunImportBtn() {
    // 导入事件
    this.dom.find('.peizhun-import-btn').on('click', () => {
      this.dom.find('#peizhunfile').click()
      // 重新添加事件，ajaxFileUpload插件会把原来的file元素替换成新的file元素
      $('#peizhunfile').on('change', (e) => {
        let filePath = e.target.value;
        if (!filePath) return
        let fileType = Tool.getFileType(filePath)
        if ("xls" != fileType && "xlsx" != fileType) {
          MessageBox.alert('格式错误，上传失败', '提示')
        }else{
          this.app.loading.show()
          $.ajaxFileUpload({
            url: '/aaa/v1/alg/sar/import/task/series',
            secureuri: false,
            dataType: "JSON",
            async: false,
            data: {
              taskId: this.taskId * 1,
              accessToken: window.localStorage.accessToken
            },
            type:'post',
            fileElementId: 'peizhunfile',
            success: (data, status, e) => {
              this.app.loading.hide()
              let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
              if (jsonArr.code == 0) {
                  MessageBox.alert('导入成功', '提示')
              } else {
                MessageBox.alert(`<pre>${jsonArr.msg}</pre>`, '提示', {
                  dangerouslyUseHTMLString: true
                })
              }
              // 重置，否则重复导入相同文件不会进入change方法
              $("#peizhunfile").val('')
            }
          });
        }
      })
    })
    // 查看导入的配准数据事件
    this.dom.find(".sfpzarea").on("click", () => {
      this.task_series_statistics()
    })

    // 导出模板事件
    this.dom.find(".sfpz_down_templete").on("click", () => {
      this.app.loading.show()
      setTimeout(() => {
        this.app.loading.hide()
      }, 1000)
      var a = document.createElement("a")
      var url = "/images/page/随访导入模板.xlsx"
      a.href = url
      a.download = "随访导入模板.xlsx"
      a.click()
    })

    // 先将按钮隐藏
    this.dom.find(".image-import-content").addClass("hide")
    this.dom.find(".peizhun-import-content").addClass("hide")
  }

  async gettaskseries() {
    let json = this.model.getData("querytask")
    json.taskId = parseInt(this.taskId)
    this.app.loading.show()
    let res = await this.api.querytaskseries(json)
    this.app.loading.hide()
    if (res.code == 0) {
      if (this.resetPage) {
        this.prodatapoll.setMain(res, true)
      } else {
        this.prodatapoll.setMain(res)
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  async task_series_count() {
    this.app.loading.show()
    let res = await this.api.task_series_count({
      taskId: parseInt(this.taskId)
    })
    this.app.loading.hide()
    if (res.code == 0) {
      this.seriesCount = res.data.count
      if (res.data.count > 0) {
        this.dom.find(".yyrarea").removeClass("hide")
        this.dom.find(".yyr .num").html(res.data.count)
      } else {
        this.dom.find(".yyrarea").addClass("hide")
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  // 获取随访配准的导入数据
  async task_series_statistics() {
    this.app.loading.show()
    let res = await this.api.task_series_statistics({
      taskId: parseInt(this.taskId)
    })
    this.app.loading.hide()
    if (res.code == 0) { // TODO
      const { seriesNumber, seriesGroupNumber, imageResultNumber } = res.data || {}
      MessageBox.alert(`
        <div>
          <p>已导入序列总数：${seriesNumber}</p>
          <p>已导入随访配准序列组总数：${seriesGroupNumber}</p>
          <p>已导入病灶总数：${imageResultNumber}</p>
        </div>
      `, '已导入的随访配准数据', {
        dangerouslyUseHTMLString: true
      })

    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  async getxlvalue(value) {
    let json1 = {
      service: "DR",
      method: "/v1/hospital/search",
      params: JSON.stringify({ code: value })
    }
    if (this.prodatapoll.yymc) {
      this.prodatapoll.yymc.loading(true)
    }
    let res = await this.api.hospitalName(json1)
    this.prodatapoll.yymc.loading(false)
    this.hospital = []
    res.data.list.forEach(val => {
      let obj = {}
      obj.idx = val["code"]
      obj.val = val["code"]
      this.hospital.push(obj)
    })
    this.prodatapoll.resetxlk(this.hospital)
  }

  async gettask(value) {
    let json = {
      taskNameKey: value,
      projectId: parseInt(this.projectId),
      type: 1
    }
    let res = await this.api.task_like_query(json)
    if (res.code == 0) {
      this.prodatapoll.tasklist(res.data.list)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  async setData() {
    let json = {
      id: parseInt(this.taskId)
    }
    let res = await this.api.querytaskseries(json)
    if (res.code == 0) {
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    this.model.setData("querytask", this.model.getData("querytask"))
  }

  async task_read() {
    let res = await this.api.task_read({ id: parseInt(this.taskId) })
    const { portionAnno, studyAnno, seriesImgFileType, status } = res.data
    this.seriesImgFileType = seriesImgFileType
    if (res.code == 0) {
      if (portionAnno) {
        this.dom.find(".choosePart .radio-box").addClass("choose")
        this.dom.find(".exportArea").removeClass("hide")
      }
      if (!studyAnno) {
        this.dom.find(".choosePart").addClass("hide")
      }
      // 如果是随访配准，则只显示导入随访配准按钮
      if (seriesImgFileType === 9) {
        this.dom.find(".image-import-content").addClass("hide")
        this.dom.find(".peizhun-import-content").removeClass("hide")
        if ([2, 3].includes(status)) { // 状态是2，3不显示导入随准配访统计
          this.dom.find(".peizhun-import-content .sfpzarea").addClass("hide")
        } else {
          this.dom.find(".peizhun-import-content .sfpzarea").removeClass("hide")
        }
      } else {
        this.dom.find(".image-import-content").removeClass("hide")
        this.dom.find(".peizhun-import-content").addClass("hide")
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }
}

module.exports = createtask2
