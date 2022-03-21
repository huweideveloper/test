class filterNeed extends DataBase {
  complete() {
    let that = this
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="filterNeed"]')
        .parent()
        .attr("id")
    ]
    permission.forEach(v => {
      switch (v.type) {
        case "START":
        case "STOP":
          break
        case "CREATE":
          this.dom
            .find(".btnarea")
            .append('<a class="createbtn strokeBtn">' + v.name + "</a>")
          break
        default:
          this.model.listicon.action.config.content.push({
            text: v.name,
            key: v.type
          })
          break
      }
    })
    this.changeAll(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".filterNeed").box().clientWidth - 140
    this.loadlist("group")
    this.addUser1 = require("../modal/addUser1/addUser")
    this.apidata = {}
    //新增用户
    this.dom.find(".createbtn").on("click", async () => {
      this.app.changePage("filterNeedDetail", { type: "new" })
    })
    this.dom.find(".search").on("click", () => {
      this.model.condition.forEach(val => {
        this.model.apiData[val[0].name] =
          this.getfiltercondition()[val[0].name].toString() == ""
            ? null
            : this.getfiltercondition()[val[0].name].toString()
      })
      if (that.model.apiData.codes) {
        let temp = []
        temp.push(that.model.apiData.codes)
        that.model.apiData.codes = temp
      }
      this.model.apiData.page = 1
      this.search(true)
    })
    this.dom.find(".filterarea input").on("change", function() {
      that.apidata[ES.selctorDoc(this).attr("api")] = ES.selctorDoc(this).val()
    })
  }

  getapidata(value) {}

  async listaction(value) {
    switch (value.classname) {
      case "EDIT":
        this.app.changePage("filterNeedDetail", { type: "edit", id: value.id })
        break
      case "READ":
        this.app.changePage("filterNeedDetail", { type: "view", id: value.id })
        break
      case "START":
        // this.app.alert.show({
        //   title: " ",
        //   msg: "确认执行吗？",
        //   close: true,
        //   sure: async () => {
        //     let res = await this.api.tagneed_batchExecuteTagTransferByTagNeedId(
        //       { tagNeedId: value.id * 1 }
        //     )
        //     if (res.code == 0) {
        //       this.search(true)
        //     } else {
        //       Tool.errorshow(res.msg, this.app)
        //     }
        //   }
        // })
        break
      case "STOP":
        this.app.alert.show({
          title: " ",
          msg: "确认暂停吗？",
          close: true,
          sure: async () => {
            let res = await this.api.tagneed_pauseByTagNeedId({
              tagNeedId: value.id * 1
            })
            if (res.code == 0) {
              this.search(true)
            } else {
              Tool.errorshow(res.msg, this.app)
            }
          }
        })
        break
      case "EXPORT":
        let json = {
          tagNeedId: value.id * 1
        }
        // let url = this.app.domain1 + 'v1/tagneed/exportSeries?param=' + encodeURI(JSON.stringify(json) + '&accessToken=' + window.localStorage.accessToken);
        let url =
          this.app.domain1 +
          "v1/tagneed/exportSeries?tagNeedId=" +
          value.id * 1 +
          "&accessToken=" +
          window.localStorage.accessToken
        //let token = this.app.local.get('accessToken')
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        })
        break
    }
  }

  //查询全部成员/管理员小组成员
  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.tagneed_searchTagNeedByCondition(
      { ...this.model.apiData, type: 2 }
    )
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {}
          obj.id = val.id
          switch (val.mode) {
            case 1:
              val.mode = "jpg化默认窗宽"
              break
            case 4:
              val.mode = "超大图切割"
              break
            case 5:
              val.mode = "人体坐标系"
              break
            case 6:
              val.mode = "dicom转mha"
              break
            case 7:
              val.mode = "jpg多窗宽"
              break
          }
          Tool.configxlkformat(this.app.constmap["SICKNESS_TYPE"]).forEach(
            function(a, b) {
              if (a.idx == val.sicknessType) {
                val.sicknessType = a.val
              }
            }
          )
          if (val.createTime)
            val.createTime = Tool.time(val.createTime, "yyyy-mm-dd")
          obj.operation = this.model.listicon.action
          data2.push(obj)
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
  }
  resize() {
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    ES.selctorDoc(".accountlist").css({ width: cw })
    ES.selctorDoc(".scrolltable").css({ height: ch - 200 })
  }
}

module.exports = filterNeed
