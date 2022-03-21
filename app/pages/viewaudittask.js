//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class viewaudittask extends Interstellar.pagesBase {
  complete() {
    this.styleModel(1)
    this.id = this.app.parpam.id
    this.total = 0
    this.model._event._addEvent("taskid.change", () => {
      this.settaskdata()
    })
    this.action = {
      viewmark: {
        dis: "inline",
        link: "noLink",
        content: "查看审核结果"
      }
    }
    this.render()
    this.setTitle()
    this.dom.find(".breadcrumb .lastlink").on("click", () => {
      this.app.model.del("viewaudittask")
      this.app.changePage("audittask")
    })
    this.model._event._addEvent("querylist.change", async () => {
      let temp = this.model.getData("querylist").reset
      this.app.loading.show()
      let res = await this.api.audit_task_user_series_search(
        this.model.getData("querylist")
      )
      this.app.loading.hide()
      if (res.code == 0) {
        this.setMain(res, temp)
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    })
  }

  render() {
    require.ensure("../moduleslibs/menutree/menutree.js", () => {
      let menu = require("../moduleslibs/menutree/menutree.js")
      this.menutree = this.app.loadModule(
        menu,
        this.dom.find(".personarea .left"),
        {
          config: [
            "mobilePhone",
            "venderName",
            "seriesAuditNum",
            "imageAnnoNum"
          ]
        }
      )
      this.model.setData("taskid", this.taskId)
      this.menutree.event._addEvent("navFirst.choosed", value => {
        //that.dom.find('label[api="seriesEndNum"]').html(parseInt(that.perseriesnum)-parseInt(value.config.split(',')[3]))
        this.doingnum = value.config.split(",")[3]
        this.dom.find('label[api="username"]').html(value.config.split(",")[0])
        this.dom
          .find('label[api="venderName"]')
          .html(value.config.split(",")[1])
        this.dom
          .find('label[api="seriesAuditNum"]')
          .html(value.config.split(",")[2])
        this.dom
          .find('label[api="imageAnnoNum"]')
          .html(value.config.split(",")[3])
        // this.dom.find('input[api="serialNumber"]').val('')
        this.chooseUserId = parseInt(value.id)
        this.model.querylist.userId = parseInt(value.id)
        this.model.querylist.serialNumber = this.dom
          .find('input[api="serialNumber"]')
          .val()
        this.model.setData("querylist", this.model.querylist)
        // this.model.setData('querylist', {
        //   id: parseInt(this.id),
        //   userId: parseInt(value.id),
        //   serialNumber:this.dom.find('input[api="serialNumber"]').val(),
        //   page: 1,
        //   pageSize: 10,
        //   reset: true,
        // })
      })
    })
    this.dom.find(".viewall").on("click", () => {
      this.app.model.set("viewaudittask", this.model.querylist)
      this.app.changePage(
        this.taskInfo.data.largeFigure ? "drapCanvasAud" : "markauditview",
        {
          taskId: this.app.parpam["id"],
          taskInfo: this.total + "$$0",
          type: "check_viewer_all",
          uid: this.model.querylist.userId
        }
      )
      // let url = this.taskInfo.data.largeFigure ? 'drapCanvasAud' : 'markauditview'
      // window.location.href =  window.location.origin + `/#!/${url}/` + this.app.parpam['id'] + '/' + this.total + '_0/check_viewer_all/' + this.model.querylist.userId
      // window.location.reload()
    })
    this.dom.find(".sequencearea .search").on("click", () => {
      this.model.setData("querylist", {
        id: parseInt(this.id),
        userId: parseInt(this.dom.find(".choosedks").attr("did")),
        page: 1,
        pageSize: 10,
        reset: true,
        serialNumber: this.dom.find('input[api="serialNumber"]').val()
      })
    })
  }

  setTitle() {
    let obj = {}
    obj["icon"] = {
      serialNumber: {
        name: '<span data-i18n="date" data-name="检查时间">序列名称</span>',
        type: "text",
        code: "date",
        w: "40%",
        ww: "40%",
        n: 40
      },
      imageAnnoNum: {
        name: '<span data-i18n="action" data-name="操作">病灶数量</span>',
        type: "text",
        code: "action",
        w: "20%",
        ww: "20%"
      },
      status: {
        name: '<span data-i18n="action" data-name="操作">序列状态</span>',
        type: "text",
        code: "action",
        w: "15%",
        ww: "15%"
      },
      auditTime: {
        name: '<span data-i18n="action" data-name="操作">审核时间</span>',
        type: "text",
        code: "action",
        w: "30%",
        ww: "30%"
      }
    }
    obj["actionulwidth"] = 200
    obj["tablewidth"] = ES.selctorDoc(".viewaudittask").box().clientWidth - 471
    obj["type"] = "center"
    obj["actionicon"] = {
      operation: {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: "action",
        code: "action",
        w: "100%",
        ww: "100%"
      }
    }
    require.ensure("../moduleslibs/table_group/table_group", () => {
      let cont_table = require("../moduleslibs/table_group/table_group")
      this.table = this.app.loadModule(
        cont_table,
        this.dom.find(".serieslist"),
        {
          id: "serieslist",
          header: obj
        }
      )
      this.table.event._addEvent("table.action", value => {
        this.app.model.set("viewaudittask", this.model.querylist)
        this.app.changePage(
          this.taskInfo.data.largeFigure ? "drapCanvasAud" : "markauditview",
          {
            taskId: this.app.parpam["id"],
            taskInfo: value.id,
            type: "check_viewer"
          }
        )
        // let url = this.taskInfo.data.largeFigure ? 'drapCanvasAud' : 'markauditview'
        // window.location.href =  window.location.origin + `/#!/${url}/` + this.app.parpam['id'] + '/' + value.id + '/check_viewer/'
        // window.location.reload()
      })
      this.table.event._addEvent("table.pagenumber", value => {
        let json = this.model.getData("querylist")
        json.reset = false
        json.page = parseInt(value)
        this.model.setData("querylist", json)
      })
      this.table.event._addEvent("table.pagesize", value => {
        let json = this.model.getData("querylist")
        json.page = 1
        json.pageSize = value.num
        json.reset = true
        this.model.setData("querylist", json)
      })
      this.dom.find(".list-content").removeClass("hide")
    })
  }

  setMain(res, bool) {
    let data2 = []
    if (res.code == 0) {
      this.total = res.data.total
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {}
          val.id =
            val.serialNumber +
            "$$" +
            val.sarId +
            "$$" +
            this.model.querylist.userId
          obj.id = val.id
          if (String(val.status) == "2" || String(val.status) == "1") {
            val.status = "审核进行中"
            obj.operation = this.action
          } else {
            val.status = "已提交"
            obj.operation = this.action
          }
          data2.push(obj)
          val.auditTime = val.auditTime
            ? Tool.time(val.auditTime, "yyyy-mm-dd HH:MM:ss")
            : "无"
        })
        this.table.setData(res.data.list, data2)
      } else {
        this.table.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.table.getTotal(res.data.pages, 2, res.data.total)
      this.table.changenum(
        this.model.querylist.page,
        this.model.querylist.pageSize
      )
    }
  }

  async settaskdata() {
    let json = {
      id: this.id
    }
    let temp = [
      "name",
      "projectName",
      "joinTaskList",
      "remark",
      "seriesTotalNum",
      "seriesAuditNum",
      "auditChoose",
      "clusterType"
    ]
    this.app.loading.show()
    let res = await this.api.audit_task_read(json)
    this.taskInfo = res
    this.app.loading.hide()
    if (res.code == 0) {
      let temp1 = ""
      res.data.description = JSON.parse('"' + res.data.description + '"')
      res.data.joinTaskList.forEach(function(val) {
        temp1 += val.name + "   "
      })
      res.data.joinTaskList = temp1
      switch (res.data.auditChoose) {
        case 1:
          res.data.auditChoose = "一致部分"
          break
        case 2:
          res.data.auditChoose = "不一致部分"
          break
        case 3:
          res.data.auditChoose = "全集"
          break
      }
      switch (res.data.clusterType) {
        case 1:
          res.data.clusterType = "序列征象"
          break
        case 2:
          res.data.clusterType = "影像标注"
          break
        case 3:
          res.data.clusterType = "阴阳性"
          break
      }
      temp.forEach(val => {
        if (val == "remark") {
          this.dom
            .find('label[apidata="' + val + '"]')
            .html(res.data[val] ? JSON.parse('"' + res.data[val] + '"') : "")
        } else if (val == "name") {
          this.dom
            .find('label[apidata="' + val + '"]')
            .html(
              res.data[val] + (res.data.studyAnno ? "(以检查号为维度)" : "")
            )
        } else {
          this.dom.find('label[apidata="' + val + '"]').html(res.data[val])
        }
      })
      this.projectId = res.data.projectId
      if (res.data.status == 3 || res.data.status == 4) {
        switch (res.data.joinAuditProjectStatus) {
          case 0:
            this.dom.find(".joinpro").html("合并结果")
            this.clickevent()
            break
          case 1:
            this.dom.find(".joinpro").html("合并中")
            break
          case 2:
            this.dom.find(".joinpro").html("合并完成")
            break
          case 3:
            this.dom.find(".joinpro").html("合并结果")
            this.clickevent()
            break
        }
      } else {
        this.dom.find(".joinpro").addClass("hide")
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    let userlist = await this.api.audit_task_user_list(json)
    if (userlist.code == 0) {
      this.menutree.changeMenu(userlist.data.userList, "single")
      if (this.app.model.get("viewaudittask")) {
        this.model.setData("querylist", this.app.model.get("viewaudittask"))
        if (this.app.model.get("viewaudittask").serialNumber) {
          this.dom
            .find('.filterarea input[api="serialNumber"]')
            .val(this.app.model.get("viewaudittask").serialNumber)
        }
        if (this.app.model.get("viewaudittask").userId) {
          this.dom
            .find(
              '.treeArea .navFirst[did="' +
                this.app.model.get("viewaudittask").userId +
                '"]'
            )
            .click()
        }
      } else {
        this.dom
          .find(".treeArea .navFirst")
          .eq(0)
          .click()
      }
    } else {
      Tool.errorshow(userlist.msg, this.app)
    }
  }

  clickevent() {
    this.dom.find(".joinpro").on("click", async () => {
      let res = await this.api.series_result_task_join({ taskId: this.id })
      if (res.code == 0) {
        this.dom.find(".joinpro").html("合并中")
        this.dom.find(".joinpro").off("click")
      } else {
        this.app.alert.show({
          title: " ",
          msg: res.msg,
          close: false
        })
      }
    })
  }
}

module.exports = viewaudittask
