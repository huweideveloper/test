class componentmanage extends Interstellar.pagesBase {
  complete() {
    this.action = {
      config: {
        dis: "inline",
        link: "noLink",
        content: []
      }
    }
    this.action1 = {
      config: {
        dis: "inline",
        link: "noLink",
        content: []
      }
    }
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="componentmanage"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "CREATE":
            this.dom
              .find(".btnarea")
              .append('<a class="createbtn strokeBtn">' + v.name + "</a>")
            break
          case "EDIT":
            this.action.config.content.push({ text: v.name, key: v.type })
            break
          case "CORRECT":
            this.action1.config.content.push({ text: v.name, key: v.type })
            break
          default:
            this.action.config.content.push({ text: v.name, key: v.type })
            this.action1.config.content.push({ text: v.name, key: v.type })
            break
        }
      })
    }
    this.apidata = { page: 1, pageSize: 10 }
    this.render()
    this.setTitle()
    this.component = require("../modal/createcomponent/createcomponent")
    this.formsubmit = require("../modal/formsubmit/formsubmit")
    this.dom.find(".createbtn").on("click", () => {
      let newcomponent = this.app.loadModal(
        this.component,
        { adv: true },
        { type: "new" }
      )
      newcomponent.event._addEvent("component.new", async value => {
        this.app.loading.show()
        let res = await this.api.create(value.data)
        this.app.loading.hide()
        if (res.code == 0) {
          newcomponent.close()
          this.apidata.page = 1
          this.setMain(true)
          this.app.changePage("componentmanage")
        } else {
          Tool.errorshow(res.msg, this.app)
        }
      })
      newcomponent.event._addEvent("component.createlabel", async value => {
        let json = {
          category: "component",
          text: value.data.val
        }
        this.app.loading.show()
        let res = await this.api.createlabel(json)
        this.app.loading.hide()
        if (res.code == 0) {
          newcomponent.createlabel(res, value)
        } else {
          Tool.errorshow(res.msg, this.app)
        }
      })
      newcomponent.event._addEvent("component.inputlabel", async value => {
        let json = {
          pageSize: 10,
          category: "component",
          text: value.data.val
        }
        let res = await this.api.searchlabel(json)
        if (res.code == 0) {
          newcomponent.showlabel(res)
        } else {
          Tool.errorshow(res.msg, this.app)
        }
      })
    })
    this.dom.find(".searchbtn").on("click", () => {
      this.apidata.name = this.dom.find(".name").val()
      this.apidata.text = this.dom.find(".label").val()
      this.apidata.page = 1
      this.setMain(true)
    })
  }

  render() {
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      this.type1 = this.app.loadModule(dropdown, this.dom.find(".kjlx"), {
        className: "xlk",
        firstSelect: {
          val: "控件类型选择",
          idx: ""
        },
        data: [
          {
            val: "文本框",
            idx: "text"
          },
          {
            val: "下拉框",
            idx: "select"
          },
          {
            val: "单选框",
            idx: "radiobox"
          },
          {
            val: "复选框",
            idx: "checkbox"
          },
          {
            val: '二级下拉菜单',
            idx: 'child_select'
          }
        ]
      })
      this.type1.event._addEvent("option.click", value => {
        this.apidata.type = value.idx
      })
      this.type1.event._addEvent("dropDown.clear", value => {
        this.apidata.type = ""
      })
    })
  }

  setTitle() {
    let obj = {}
    obj["icon"] = {
      code: {
        name: '<span data-i18n="age" data-name="年龄">标注字段编码</span>',
        type: "text",
        code: "checkid",
        w: "20%",
        ww: "20%"
      },
      name: {
        name: '<span data-i18n="age" data-name="年龄">标注字段名称</span>',
        type: "text",
        code: "checkid",
        w: "20%",
        ww: "20%"
      },
      type: {
        name: '<span data-i18n="age" data-name="年龄">控件类型</span>',
        type: "text",
        code: "pid",
        w: "20%",
        ww: "20%"
      },
      editable: {
        name: '<span data-i18n="age" data-name="年龄">是否已有任务启用</span>',
        type: "text",
        code: "pid",
        w: "15%",
        ww: "15%"
      },
      label: {
        name: '<span data-i18n="age" data-name="年龄">标签</span>',
        type: "text",
        code: "pname",
        w: "15%",
        ww: "15%"
      },
      createUserName: {
        name: '<span data-i18n="age" data-name="年龄">创建人</span>',
        type: "text",
        code: "pname",
        w: "20%",
        ww: "20%"
      }
    }
    obj["tablewidth"] =
      ES.selctorDoc(".componentmanage").box().clientWidth - 140
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
        this.dom.find(".componenttable"),
        {
          id: "componenttable",
          header: obj
        }
      )
      this.table.event._addEvent("table.pagenumber", value => {
        this.apidata.page = parseInt(value)
        this.table.changenum(this.apidata.page)
        this.setMain()
      })
      this.table.event._addEvent("table.action", async value => {
        switch (value.classname) {
          case "READ":
            this.getcomdetail(value.id, "view")
            break
          case "EDIT":
            this.getcomdetail(value.id, "edit")
            break
          case "EDIT_LABEL":
            this.getcomdetail(value.id, "editlabel")
            break
          case "CORRECT":
            this.getcomdetail(value.id, "correct")
            break
          case "COPY":
            this.app.loading.show()
            let res = await this.api.formComponent_clone({ id: value.id })
            this.app.loading.hide()
            if (res.code == 0) {
              this.apidata.page = 1
              this.setMain(true)
            } else {
              Tool.errorshow(res.msg, this.app)
            }
        }
      })
      this.table.event._addEvent("table.pagesize", value => {
        this.apidata.pageSize = value.num
        this.apidata.page = 1
        this.setMain(true)
      })
      this.dom.find(".list-content").removeClass("hide")
      this.apidata.page = 1
      this.setMain(true)
    })
  }

  async getcomdetail(value, type) {
    let json = {
      id: value
    }
    this.app.loading.show()
    let res = await this.api.getdetails(json)
    this.app.loading.hide()
    if (res.code == 0) {
      if (type == "edit" || type == "editlabel") {
        let editcomponent = this.app.loadModal(
          this.component,
          { adv: true },
          {
            type: type,
            data: res.data,
            componentid: value
          }
        )
        editcomponent.event._addEvent("component.edit", async value => {
          this.app.loading.show()
          let res = await this.api.update(value.data)
          this.app.loading.hide()
          if (res.code == 0) {
            editcomponent.close()
            this.apidata.page = 1
            this.setMain(true)
          } else {
            Tool.errorshow(res.msg, this.app)
          }
        })
        // 保存成功
        editcomponent.event._addEvent("component.saveSuccess", async res => {
          editcomponent.close()
          this.apidata.page = 1
          this.setMain(true)
        })
        editcomponent.event._addEvent("component.createlabel", async value => {
          let json = {
            category: "COMPONENT",
            text: value.data.val
          }
          this.app.loading.show()
          let res = await this.api.createlabel(json)
          this.app.loading.hide()
          if (res.code == 0) {
            editcomponent.createlabel(res, value)
          } else {
            Tool.errorshow(res.msg, this.app)
          }
        })
        editcomponent.event._addEvent("component.inputlabel", async value => {
          let json = {
            pageSize: 10,
            category: "COMPONENT",
            text: value.data.val
          }
          let res = await this.api.searchlabel(json)
          if (res.code == 0) {
            editcomponent.showlabel(res)
          } else {
            Tool.errorshow(res.msg, this.app)
          }
        })
      } else if (type == "view") {
        let viewcomponent = this.app.loadModal(
          this.component,
          { adv: true },
          { type: "view", data: res.data }
        )
      } else if (type == "correct") {
        let config = [
          {
            name: "correctionPassword",
            type: "input",
            title: "修正密钥:",
            value: "",
            check: "empty",
            remark: "",
            inputtype: "password"
          }
        ]
        let keyinput = this.app.loadModal(
          this.formsubmit,
          { adv: true },
          { config: config, title: "" }
        )
        keyinput.event._addEvent("formsubmit.submit", async data => {
          data.userId = JSON.parse(this.app.local.get("all")).userId
          let res1 = await this.api.formComponent_correction(data)
          if (res1.code == 0) {
            keyinput.close()
            let editcomponent = this.app.loadModal(
              this.component,
              { adv: true },
              {
                type: type,
                data: res.data,
                componentid: value
              }
            )
            editcomponent.event._addEvent("component.edit", async value => {
              let res = await this.api.update(value.data)
              this.app.loading.hide()
              if (res.code == 0) {
                editcomponent.close()
                this.apidata.page = 1
                this.setMain(true)
              } else {
                Tool.errorshow(res.msg, this.app)
              }
            })
            editcomponent.event._addEvent(
              "component.createlabel",
              async value => {
                let json = {
                  category: "COMPONENT",
                  text: value.data.val
                }
                this.app.loading.show()
                let res = await this.api.createlabel(json)
                this.app.loading.hide()
                if (res.code == 0) {
                  editcomponent.createlabel(res, value)
                } else {
                  Tool.errorshow(res.msg, this.app)
                }
              }
            )
            editcomponent.event._addEvent(
              "component.inputlabel",
              async value => {
                let json = {
                  pageSize: 10,
                  category: "COMPONENT",
                  text: value.data.val
                }
                let res = await this.api.searchlabel(json)
                if (res.code == 0) {
                  editcomponent.showlabel(res)
                } else {
                  Tool.errorshow(res.msg, this.app)
                }
              }
            )
          } else if (res1.code == 1071) {
            keyinput.showerror({ correctionPassword: "修正密钥错误" })
          } else {
            Tool.errorshow(res1.msg, this.app)
          }
        })
      }
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  async setMain(bool) {
    let data2 = []
    this.table.showloading()
    let res = await this.api.querylist(this.apidata)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val, idx) => {
          let obj = {}
          obj.id = val.id
          data2.push(obj)
          val.label = ""
          val.tagList.forEach(function(value, index) {
            if (index < val.tagList.length - 1) {
              val.label += value.text + ","
            } else {
              val.label += value.text
            }
          })
          switch (val.type) {
            case "text":
              val.type = "文本框"
              break
            case "select":
              val.type = "下拉框"
              break
            case "checkbox":
              val.type = "复选框"
              break
            case "radiobox":
              val.type = "单选框"
              break
            case 'child_select':
              val.type = '二级下拉菜单'
              break
          }
          if (val.editable) {
            obj.operation = this.action
            val.editable = "否"
          } else {
            obj.operation = this.action1
            val.editable = "是"
          }
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
    }
  }
}

module.exports = componentmanage
