class rolemanage extends Interstellar.pagesBase {
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
            this.menutreeConfig.bottom = { name: "创建角色" }
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
    this.roleModal = require("../modal/roleModal/roleModal")
    this.apidata = {}
    this.permission_search()
    this.renderMenu()
    this.dom.find(".roleName").on("keydown", function(e) {
      if (e.keyCode == 13) {
        that.role_search(ES.selctorDoc(this).val())
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
      this.role_search("")
      this.menutree.event._addEvent("navFirst.choosed", value => {
        console.log(value)
        this.dom.find(".listArea .title").html(value.name)
        this.role_read(value.id)
      })
      this.menutree.event._addEvent("menutree.itemAction", value => {
        console.log(value)
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
                let res = await this.api.role_delete({ id: value.id })
                if (res.code == 0) {
                  this.role_search("")
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
      roleRead = await this.api.role_read({ id: value.id })
      if (roleRead.code == 0) {
        this.role.renderData(roleRead.data)
      } else {
        Tool.errorshow(roleRead.msg, this.app)
      }
    }
    this.role.event._addEvent("roleModal.submit", async v => {
      if (value.type == "CREATE" || v.name !== roleRead.data.name) {
        let res = await this.api.role_nameExit({ name: v.name })
        if (res.code == 401) {
          this.role.showError("名称已存在")
          return
        }
      }
      v.action = value.type == "CREATE" ? 1 : 2
      if (value.type == "EDIT") {
        v.id = value.id
      }
      let res = await this.api.role_edit(v)
      if (res.code == 0) {
        this.role_search()
        this.role.close()
      } else {
        this.errorshow(res.msg)
      }
    })
  }

  async role_search(value) {
    let res = await this.api.role_search({ name: value })
    this.menutree.changeMenu(res.data, "single")
    this.dom
      .find(".treeArea .navFirst")
      .eq(0)
      .click()
  }

  async role_read(value) {
    let res = await this.api.role_read({ id: value })
    let html = ""
    this.dom
      .find(".roleList")
      .html(
        '<li class="roleTitle">\n' +
          '                <p class="roleName">权限名称</p>\n' +
          '                <p class="roleContent">权限内容</p>\n' +
          "            </li>"
      )
    if (res.data.permissionList.length && res.data.permissionList.length > 0) {
      res.data.permissionList.forEach(v => {
        let temp = ""
        if (v.resourceList && res.data.permissionList.length > 0) {
          v.resourceList.forEach(item => {
            temp +=
              '<span class="permissions" title="' +
              item.resourceParentName +
              "(" +
              item.resourceCode.toString() +
              ")" +
              '">' +
              item.resourceParentName +
              '<label class="soft">' +
              "(" +
              item.resourceCode.toString() +
              ") " +
              "</label></span>"
          })
        }
        html +=
          '<li><p class="roleName">' +
          v.permissionName +
          '</p><p class="roleContent">' +
          temp +
          "</p></li>"
      })
      this.dom.find(".roleList").append(html)
    } else {
      html = '<p class="noData">暂无内容</p>'
      this.dom.find(".roleList").html(html)
    }
  }

  async permission_search() {
    let res = await this.api.permission_search({})
    this.allPermission = {}
    res.data.permissionPoList.forEach(v => {
      let temp = { 0: [] }
      v.pageResourceList.forEach(item => {
        if (!temp[item.parentId]) temp[item.parentId] = []
        if (item.parentId == 0) {
          temp[0].push(item)
        } else {
          temp[item.parentId].push(item)
        }
      })
      this.allPermission[v.id] = {
        name: v.name,
        data: temp
      }
    })
  }

  errorshow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    })
  }
}

module.exports = rolemanage
