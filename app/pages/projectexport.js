class projectexport extends DataBase {
  complete() {
    let url_page = window.location.href.split("#!/")[1].split("/")[0]
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="' + url_page + '"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "EXPORT":
            this.model.listicon.action = {
              exportdata: {
                dis: "inline",
                link: "noLink",
                content: "标注项目统计"
              }
            }
            break
        }
      })
    }
    this.changeAll(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".projectexport").box().clientWidth - 140
    this.loadlist("group")
    this.dom.find(".createbtn").on("click", () => {
      this.app.session.set("ischanged", false)
      this.app.changePage("createproone", { type: "new" })
    })
    this.dom.find(".searchbtn").on("click", () => {
      this.model.condition.forEach(val => {
        if (val[0].name == "inspectTime") {
          this.model.apiData.startTime = this.getfiltercondition()[
            val[0].name
          ][0].startTime
          this.model.apiData.endTime = this.getfiltercondition()[
            val[0].name
          ][0].endTime
        } else {
          this.model.apiData[val[0].name] =
            this.getfiltercondition()[val[0].name].toString() == ""
              ? null
              : this.getfiltercondition()[val[0].name].toString()
        }
      })
      this.model.apiData.projectIdList = this.model.apiData.projectIdList
        ? this.model.apiData.projectIdList.split(",")
        : null
      this.model.apiData.page = 1
      this.search(true)
    })
  }

  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.queryproject(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val, idx) => {
          let obj = {}
          let temp =
            val.quotedByAuditProject || val.taskInProgressCount > 0 ? 2 : 1
          obj.id = val.id + "," + val.taskInProgressCount + "," + temp
          switch (val.status) {
            case 1:
              val.status = "未启用"
              break
            case 2:
              val.status = "已启用"
              break
          }
          obj.operation = this.model.listicon.action
          Tool.configxlkformat(this.app.constmap["MODALITY"]).forEach(function(
            a,
            b
          ) {
            if (a.idx == val.modality) {
              val.modality = a.val
            }
          })
          data2.push(obj)
          val.createTime = Tool.time(val.createTime, "yyyy-mm-dd")
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll("scrolltable")
  }

  listaction(value) {
    switch (value.classname) {
      case "exportdata":
        // if (value.id.split(',')[1] > 0) {
        let url =
          this.app.domain1 +
          "v1/project/statistics/export?projectId=" +
          value.id.split(",")[0]
        // Tool.downfile(url, this.app)
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        })
        // } else {
        //   this.app.alert.show({
        //     title: ' ',
        //     msg: '无已提交序列，不支持导出。',
        //     close: true,
        //     sure: function () {}
        //   })
        // }
        break
    }
  }

  getapidata(value) {
    const tempModuleobj = this.chooseData.moduleobj
    if (value) {
      let keyword = value.data.data
      keyword = keyword ? keyword.trim() : ""
      switch (value.name) {
        case "projectIdList":
          tempModuleobj.projectIdList.loading(true)
          this.project_name_search(keyword)
          break
        case "groupId":
          tempModuleobj.groupId.loading(true)
          this.queryProjectGroupList(keyword)
          break
      }
    } else {
      tempModuleobj.projectIdList.loading(true)
      tempModuleobj.groupId.loading(true)
      this.project_name_search("")
      this.queryProjectGroupList("")
    }
  }

  async project_name_search(projectName) {
    let { data } = await this.api.project_name_search({ projectName })
    this.chooseData.moduleobj.projectIdList.loading(false)
    let temparr = data.list.map(item => {
      return {
        idx: item.projectId,
        val: item.projectName
      }
    })
    this.chooseData.renderHtml(temparr, "projectIdList")
  }

  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      name: groupName,
      page: 1
    })
    this.chooseData.moduleobj.groupId.loading(false)
    let temparr = data.list.map(val => {
      return {
        idx: val.id,
        val: val.name
      }
    })
    this.chooseData.renderHtml(temparr, "groupId")
  }
}

module.exports = projectexport
