class permission extends Interstellar.pagesBase {
  complete() {
    let that = this
    this.menutreeConfig = {
      config: ["id"],
      icon: "no",
      bottom: undefined,
      itemconfig: []
    }
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="rolemanage"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "CREATE":
            this.menutreeConfig.bottom = { name: "创建权限" }
            break
          case "EDIT":
            this.menutreeConfig.itemconfig.push({ name: "修改", code: v.type })
            break
          case "DELETE":
            this.menutreeConfig.itemconfig.push({ name: "删除", code: v.type })
            break
        }
      })
    }
    this.roleModal = require("../modal/permissionSet/permissionSet")
    this.apidata = {}
    this.resource_all()
    this.renderMenu()
    this.dom.find(".roleName").on("keydown", function(e) {
      if (e.keyCode == 13) {
        that.permission_query(ES.selctorDoc(this).val())
      }
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
      this.permission_query("")
      this.menutree.event._addEvent("navFirst.choosed", value => {
        this.dom.find(".listArea .title").html(value.name)
        this.permission_read(value.id)
      })
      this.menutree.event._addEvent("menutree.itemAction", value => {
        switch (value.type) {
          case "CREATE":
            this.showModal(value)
            break
          case "EDIT":
            this.showModal(value)
            break
          case "DELETE":
            this.app.alert.show({
              title: "",
              template:
                '<span style="font-size: 18px;font-weight: bold;">确认删除吗？</span>',
              sure: async () => {
                let res = await this.api.permission_delete({ id: value.id })
                if (res.code == 0) {
                  this.permission_query("")
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

  async showModal(value) {
    this.role = this.app.loadModal(
      this.roleModal,
      { adv: true },
      { type: value.type, data: this.allPermission }
    )
    let roleRead = null
    if (value.type == "EDIT") {
      roleRead = await this.api.permission_read({ id: value.id })
      if (roleRead.code == 0) {
        this.role.renderData(roleRead.data)
      } else {
        Tool.errorshow(roleRead.msg, this.app)
      }
    }
    this.role.event._addEvent("roleModal.submit", async v => {
      if (value.type == "CREATE" || v.name !== roleRead.data.name) {
        let res = await this.api.name_volidate({ name: v.name })
        if (res.code == 401) {
          this.role.showError("名称已存在")
          return
        }
      }
      let res = null
      if (value.type == "EDIT") {
        v.id = value.id
        res = await this.api.permission_update(v)
      } else {
        res = await this.api.permission_create(v)
      }
      if (res.code == 0) {
        this.permission_query()
        this.role.close()
      } else {
        this.errorshow(res.msg)
      }
    })
  }

  async permission_query(value) {
    let res = await this.api.permission_query({ name: value })
    this.menutree.changeMenu(res.data.permissionPoList, "single")
    this.dom
      .find(".treeArea .navFirst")
      .eq(0)
      .click()
  }

  async permission_read(value) {
    let res = await this.api.permission_read({ id: value })
    let html = ""
    this.dom
      .find(".roleList")
      .html(
        '<li class="roleTitle">\n' +
          '                <p class="roleName">页面权限</p>\n' +
          '                <p class="roleContent">权限内容</p>\n' +
          "            </li>"
      )
    if (
      res.data.pageResourceList.length &&
      res.data.pageResourceList.length > 0
    ) {
      let temp = { 0: [] }
      res.data.pageResourceList.forEach(item => {
        if (!temp[item.parentId]) temp[item.parentId] = []
        if (item.parentId == 0) {
          temp[0].push(item)
        } else {
          temp[item.parentId].push(item)
        }
      })
      temp[0].forEach(v => {
        let str = ""
        if (temp[v.id]) {
          temp[v.id].forEach((action, index) => {
            str += action.name
            if (index !== temp[v.id].length - 1) {
              str += ","
            }
          })
        }
        html +=
          '<li><p class="roleName">' +
          v.name +
          '</p><p class="roleContent">' +
          str +
          "</p></li>"
      })
      this.dom.find(".roleList").append(html)
    } else {
      html = '<p class="noData">暂无内容</p>'
      this.dom.find(".roleList").html(html)
    }
  }

  async resource_all() {
    let res = await this.api.resource_all({})
    this.allPermission = {}
    let temp = { 0: [] }
    res.data.pageResourceList.forEach(item => {
      if (!temp[item.parentId]) temp[item.parentId] = []
      if (item.parentId == 0) {
        temp[0].push(item)
      } else {
        temp[item.parentId].push(item)
      }
    })
    this.allPermission = temp
  }

  errorshow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    })
  }
}

module.exports = permission
