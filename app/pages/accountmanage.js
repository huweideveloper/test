class accountmanage extends DataBase {
  complete() {
    let that = this
    this.menutreeConfig = {
      config: ["id"],
      icon: "no",
      bottom: undefined,
      itemconfig: []
    }
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="accountmanage"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "CREATE_GROUP":
            this.menutreeConfig.bottom = { name: "创建群组" }
            break
          case "EDIT_GROUP":
            this.menutreeConfig.itemconfig.push({ name: "修改", code: v.type })
            break
          case "DELETE_GROUP":
            this.menutreeConfig.itemconfig.push({ name: "删除", code: v.type })
            break
          default:
            this.model.listicon.action.config.content.push({
              text: v.name,
              key: v.type
            })
            break
        }
      })
    }
    this.base_role_search()
    this.getAllUser("")
    this.changeAll(this.model.condition)
    this.model.tableconfig.tablewidth =
      ES.selctorDoc(".accountmanage").box().clientWidth - 320
    this.loadlist("group")
    this.addUser1 = require("../modal/addUser1/addUser")
    this.groupSet = require("../modal/groupSet/groupSet")
    this.apidata = {}
    this.renderMenu()
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

  renderMenu() {
    require.ensure("../moduleslibs/menutree/menutree.js", () => {
      let menu = require("../moduleslibs/menutree/menutree.js")
      this.menutree = this.app.loadModule(
        menu,
        this.dom.find(".groupArea"),
        this.menutreeConfig
      )
      this.group_search()
      this.menutree.event._addEvent("navFirst.choosed", value => {
        this.dom.find(".listArea .title").html(value.name)
        this.model.apiData.groupId = value.id
        this.search(true)
      })
      this.menutree.event._addEvent("menutree.itemAction", value => {
        switch (value.type) {
          case "CREATE":
            this.showModal(value)
            break
          case "EDIT_GROUP":
            this.showModal(value)
            break
          case "DELETE_GROUP":
            this.app.alert.show({
              title: "",
              template:
                '<span style="font-size: 18px;font-weight: bold;">确认删除吗？</span>',
              sure: async () => {
                let res = await this.api.group_delete({ id: value.id })
                if (res.code == 0) {
                  this.group_search()
                } else {
                  this.errorshow(res.msg)
                }
              },
              close: true
            })
            break
        }
      })
    })
  }

  async group_search() {
    let res = await this.api.group_search({})
    res.data.unshift({ id: "", name: "全部成员" })
    this.menutree.changeMenu(res.data, "single")
    this.dom
      .find(".treeArea .navFirst")
      .eq(0)
      .click()
    this.dom
      .find(".treeArea .icon-caozuo")
      .eq(0)
      .hide()
  }

  async listaction(value) {
    this.app.loading.show()
    let json = {
      id: value.id.split(",")[0]
    }
    let res = await this.api.user_read(json)
    this.app.loading.hide()
    this.showUserModal(value.classname, res)
    if (res.code == 0) {
      this.adduser.renderData(res.data)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  showUserModal(type, res) {
    this.adduser = this.app.loadModal(
      this.addUser1,
      { adv: true },
      {
        type: type,
        data: this.allRole
      }
    )
    this.adduser.event._addEvent("addUser.submit", async data => {
      if (type == "EDIT") {
        data.id = res.data.id
        data.mobile = res.data.mobile
        let updateRes = await this.api.user_update1(data)
        if (updateRes.code == 0) {
          this.adduser.close()
          this.dom.find(".menutree .choosedks").click()
        } else {
          Tool.errorshow(updateRes.msg, this.app)
        }
      } else {
        this.adduser.close()
      }
    })
  }

  async listOnOff(value) {
    this.app.alert.show({
      title: " ",
      msg: "确定切换该用户状态？",
      close: true,
      sure: async () => {
        let json = {
          id: value.id.split(",")[0],
          status: value.action == "on" ? "Y" : "N"
        }
        let res = await this.api.user_enable(json)
        if (res.code == 0) {
          this.search()
        } else {
          this.errorshow(res.msg)
          this.search()
        }
      },
      closeSure: () => {
        this.search()
      }
    })
  }

  async base_role_search() {
    let res = await this.api.base_role_search({ name: "" })
    this.allRole = res.data
  }

  //查询全部成员/管理员小组成员
  async search(bool) {
    let data2 = []
    this.tablecont.showloading()
    let res = await this.api.user_search(this.model.apiData)
    if (res.code == 0) {
      if (res.data.list && res.data.list.length > 0) {
        res.data.list.forEach(val => {
          for (let i in val) {
            val[i] = val[i] == null ? "" : val[i]
          }
          let obj = {}
          obj.id = val.id
          switch (val.annoStatus) {
            case "Y":
              val.annoStatus = true
              obj.operation = this.model.listicon.action
              break
            case "N":
              val.annoStatus = false
              obj.operation = this.model.listicon.action
              break
          }
          data2.push(obj)
          let tempStr = ""
          val.roleNameList = val.roleNameList[0].name.toString()
        })
        this.tablecont.setData(res.data.list, data2)
      } else {
        this.tablecont.noData()
      }
    }
    if (bool) {
      this.tablecont.getTotal(res.data.pages, 2, res.data.total)
    }
  }

  async showModal(value) {
    this.group = this.app.loadModal(
      this.groupSet,
      { adv: true },
      { type: value.type, data: this.allRole, allUser: this.allUSer }
    )
    if (value.type == "EDIT_GROUP") {
      let res = await this.api.group_read({ groupId: value.id })
      if (res.code == 0) {
        this.group.renderData(res.data)
      } else {
        Tool.errorshow(res.msg, this.app)
      }
    }
    this.group.event._addEvent("groupSet.submit", async v => {
      let res = null
      if (value.type == "EDIT_GROUP") {
        v.id = value.id
        res = await this.api.group_update(v)
      } else {
        res = await this.api.group_create(v)
      }
      if (res.code == 0) {
        this.group_search()
        this.group.close()
      } else if (res.code == 401) {
        this.group.showError("名称已存在")
      } else {
        this.errorshow(res.msg)
      }
    })
    this.group.event._addEvent("groupSet.search", v => {
      this.getAllUser(v.name, true)
    })
  }

  async getAllUser(name, refresh) {
    let res = await this.api.user_search({
      name: name,
      page: 1,
      pageSize: 10000
    })
    if (refresh) {
      this.group.unchoosedUser(res.data.list)
    } else {
      this.allUSer = res.data.list
    }
  }

  errorshow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    })
  }
}

module.exports = accountmanage
