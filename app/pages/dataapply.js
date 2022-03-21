class dataapply extends DataBase {
  complete() {
    this.changeAll(this.model.condition)
    this.hospital_search("")
    this.recode = require("../modal/createapply/createapply")
    this.setpriority = require("../modal/formsubmit/formsubmit")
    this.createrecode = require("../modal/createrecode/createrecode")
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".dataapply").box().clientWidth - 240
    this.loadlist("group")
    this.dom.find(".create").on("click", () => {
      this.loadmodal("create")
    })
    this.dom.find(".searchbtn").on("click", () => {
      this.model.condition.forEach(val => {
        this.model.apiData[val[0].name] = this.getfiltercondition()[
          val[0].name
        ].toString()
      })
      this.model.apiData.page = 1
      this.search(true)
    })
  }

  listaction(value) {
    this.loadmodal(
      value.classname,
      value.id.split(",")[0],
      value.id.split(",")[1]
    )
  }

  async loadmodal(type, id, num) {
    if (type == "create") {
      let createapply = this.app.loadModal(
        this.recode,
        { adv: true },
        { title: "数据需求申请" }
      )
      createapply.event._addEvent("createapply.submit", async value => {
        value.requestPerson = JSON.parse(this.app.local.get("all")).name
        let json = {
          service: "DR",
          method: "/v1/info/request/create",
          params: JSON.stringify(value)
        }
        this.app.loading.show()
        let res = await this.api.data_request_create(json)
        this.app.loading.hide()
        if (res.code == 0) {
          this.model.apiData.page = 1
          createapply.close()
          this.search(true)
        }
      })
      return
    }
    if (id) {
      let json = {
        service: "DR",
        method: "/v1/info/request/read",
        params: JSON.stringify({ id: id })
      }
      this.app.loading.show()
      let res = await this.api.data_request_read(json)
      this.app.loading.hide()
      if (res.code == 0) {
        switch (type) {
          case "view":
            let viewapply = this.app.loadModal(
              this.recode,
              { adv: true },
              {
                title: "数据需求查看",
                type: "view",
                data: res.data
              }
            )
            break
          case "edit":
            let editapply = this.app.loadModal(
              this.recode,
              { adv: true },
              {
                title: "数据需求编辑",
                type: "edit",
                data: res.data,
                num: num
              }
            )
            editapply.event._addEvent("createapply.submit", async value => {
              let json = {
                service: "DR",
                method: "/v1/info/request/update",
                params: JSON.stringify(value)
              }
              this.app.loading.show()
              let res = await this.api.data_request_update(json)
              this.app.loading.hide()
              if (res.code == 0) {
                this.model.apiData.page = 1
                editapply.close()
                this.search(true)
              }
            })
            break
          case "setpriority":
            let config = [
              {
                name: "priority",
                type: "dropdown",
                title: "数据优先级设置",
                value: res.data.priority,
                check: "empty",
                remark: "",
                datatype: "arr",
                data: ["P0", "P1", "P2", "P3", "P4"]
              }
            ]
            let setp = this.app.loadModal(
              this.setpriority,
              { adv: true },
              { config: config }
            )
            setp.event._addEvent("formsubmit.submit", async value => {
              res.data.priority = value.priority
              let json = {
                service: "DR",
                method: "/v1/info/request/update",
                params: JSON.stringify(res.data)
              }
              this.app.loading.show()
              let updateRes = await this.api.data_request_update(json)
              this.app.loading.hide()
              if (updateRes.code == 0) {
                this.model.apiData.page = 1
                setp.close()
                this.search(true)
              }
            })
            break
          case "createcode":
            this.createrecode1 = this.app.loadModal(
              this.createrecode,
              { adv: true },
              {
                title: "创建记录",
                type: "apply",
                applydata: res.data,
                xlk: this.hospitaldata
              }
            )
            this.createrecode1.event._addEvent(
              "createrecode.submit",
              async value => {
                value.bodyPart = res.data.bodyPart
                value.projectName = res.data.projectName
                value.requestId = id
                value.createBy = JSON.parse(this.app.local.get("all")).name
                let json = {
                  service: "DR",
                  method: "/v1/info/collection/create",
                  params: JSON.stringify(value)
                }
                this.app.loading.show()
                let createRes = await this.api.data_collection_create(json)
                this.app.loading.hide()
                if (createRes.code == 0) {
                  this.model.apiData.page = 1
                  this.createrecode1.close()
                  this.search(true)
                }
              }
            )

            this.createrecode1.event._addEvent(
              "createrecode.dropinput",
              value => {
                this.hospital_search(value.data.data)
              }
            )
            this.createrecode1.event._addEvent(
              "createrecode.dropclear",
              value => {
                this.hospital_search("")
              }
            )
            break
        }
      }
    }
  }

  async hospital_search(value) {
    if (this.createrecode1) {
      this.createrecode1.showloading()
    }
    let res = await this.api.hospital_search({
      code: value,
      page: 1,
      pageSize: 10
    })
    if (res.code == 0) {
      this.hospitaldata = []
      res.data.list.forEach((val, idx) => {
        let obj = {
          val: val.code,
          idx: val.code
        }
        this.hospitaldata.push(obj)
      })
      if (this.createrecode1) {
        this.createrecode1.sethospitalxlk(this.hospitaldata)
      }
    }
  }

  async search(bool) {
    let data2 = []
    let json = {
      service: "DR",
      method: "/v1/info/request/search",
      params: JSON.stringify(this.model.apiData)
    }
    this.tablecont.showloading()
    let res = await this.api.data_request_search(json)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val, idx) => {
          let obj = {
            operation: this.model.listicon.action,
            id: val.id + "," + val.recordNum
          }
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          val.numGive = ""
          Tool.configxlkformat(this.app.constmap["BODY_PART"]).forEach(function(
            a,
            b
          ) {
            if (a.idx == val.bodyPart) {
              val.bodyPart = a.val
            }
          })
          data2.push(obj)
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
    this.initscroll("scrolltable")
  }
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc(".dataapply").css({ height: ch, width: cw })
    ES.selctorDoc(".scrolltable").css({ height: ch - 200 })
  }
}

module.exports = dataapply
