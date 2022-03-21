class dataconfig extends Interstellar.pagesBase {
  complete() {
    this.action = {}
    this.addNew = false
    let permission = this.app.userResource[
      ES.selctorDoc('.menu .twolink[link="dataconfig"]')
        .parent()
        .attr("id")
    ]
    if (permission && permission.length > 0) {
      permission.forEach(v => {
        switch (v.type) {
          case "CREATE_TYPE":
            this.addNew = true
            break
          case "CREATE":
            this.dom
              .find(".btnarea")
              .append('<div class="fillBtn addc">' + v.name + "</div>")
            break
          case "EDIT":
            this.action = {
              viewmark: { dis: "inline", link: "noLink", content: "编辑" }
            }
            break
        }
      })
    }
    this.loadmoudel()
    this.loadTable()
    this.btnEvent()
    this.apiload()
  }

  async apiload() {
    this.app.loading.show()
    let value = await this.api.dict_search({
      parentId: 0,
      page: 0,
      pageSize: -1
    })
    this.app.loading.hide()
    this.dataControl.setData(value.data.list)
  }

  btnEvent() {
    this.dom.find(".addc").on("click", () => {
      if (!this.dataControl.chooseData) {
        return
      }
      this.openModal("add", null)
    })
  }

  //打开弹框
  openModal(type, data) {
    if (data) {
      data.code = data.value
    }
    let config = [
      {
        name: "name",
        type: "input",
        title: "名称",
        value: data ? data.name : "",
        check: "empty",
        remark: ""
      },
      {
        name: "value",
        type: "input",
        title: "编码",
        value: data ? data.value : "",
        check: "empty",
        remark: "",
        disabled: type == "add" ? "" : "disabled"
      },
      {
        name: "remark",
        type: "input",
        title: "数值",
        value: data ? data.remark : "",
        check: "",
        remark: ""
      }
    ]
    let editdataconfig = this.app.loadModal(
      this.editdataconfigClass,
      {
        adv: false,
        class: "xs",
        title: type == "add" ? "创建" : "编辑",
        type: "code-need"
      },
      { config: config }
    )
    editdataconfig.event._addEvent("formsubmit.submit", async data1 => {
      this.app.loading.show()
      data1.parentId = this.dataControl.chooseData.bid * 1
      let res = null
      if (type == "add") {
        res = await this.api.dict_create(data1)
      } else {
        data1.id = data.id * 1
        res = await this.api.dict_update(data1)
      }
      this.app.loading.hide()
      this.codeFinish(res, editdataconfig)
    })
  }

  //接口返回的统一处理
  codeFinish(value, dom) {
    if (value.code * 1 == 0) {
      dom.close()
      this.newList = true
      let temp = this.model.listInfo.pageSize
      this.model.listInfo = {
        parentId: this.dataControl.chooseData.bid * 1,
        page: 1,
        pageSize: temp
      }
      this.model.setData("listInfo", this.model.listInfo)
    } else {
      dom.showerror({
        value: value.msg
      })
    }
  }

  //加载table模块
  loadTable() {
    let obj = {}
    obj["icon"] = {
      value: {
        name: '<span data-i18n="date" data-name="检查时间">编码</span>',
        type: "text",
        code: "date",
        w: "30%",
        ww: "30%"
      },
      name: {
        name: '<span data-i18n="action" data-name="操作">名称</span>',
        type: "text",
        code: "action",
        w: "40%",
        ww: "40%"
      },
      remark: {
        name: '<span data-i18n="action" data-name="操作">数值</span>',
        type: "text",
        code: "action",
        w: "40%",
        ww: "40%"
      }
    }
    obj["actionulwidth"] = 100
    obj["tablewidth"] = this.dom.find(".content_list").box().clientWidth - 140
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
        this.dom.find(".content_list"),
        {
          id: "content_list",
          header: obj
        }
      )
      this.table.event._addEvent("table.action", value => {
        this.openModal("edit", this.listdata[value.id])
      })
      this.table.event._addEvent("table.pagenumber", value => {
        this.newList = false
        this.model.listInfo.page = parseInt(value)
        this.model.setData("listInfo", this.model.listInfo)
        this.table.changenum(this.model.listInfo.page)
      })
      this.table.event._addEvent("table.pagesize", value => {
        this.model.listInfo.page = 1
        this.model.listInfo.pageSize = value.num
        this.newList = true
        this.model.setData("listInfo", this.model.listInfo)
      })
      this.dom.find(".list-content").removeClass("hide")
    })
  }

  //加载左侧列表
  loadmoudel() {
    // this.editdataconfigClass = require("../modal/editdataconfig/editdataconfig.js")
    this.editdataconfigClass = require("../modal/configModal/configModal.js")
    let datalist = require("../modules/datalist/datalist")
    this.dataControl = this.app.loadModule(
      datalist,
      this.dom.find(".list_left"),
      { addnew: this.addNew }
    )
    this.dataControl.event._addEvent("datalist.addChoose", value => {
      let config = [
        {
          name: "name",
          type: "input",
          title: "选项类型名称",
          value: "",
          check: "empty",
          remark: ""
        },
        {
          name: "value",
          type: "input",
          title: "编码",
          value: "",
          check: "empty",
          remark: ""
        },
        {
          name: "type",
          type: "dropdown",
          title: "显示类型",
          value: "",
          remark: "",
          check: "empty",
          data: [
            { val: "时间模式", idx: "time" },
            { val: "数字范围模式", idx: "number" },
            { val: "复选模式", idx: "checkBox" },
            { val: "单选模式", idx: "radio" }
          ]
        }
      ]
      let editdataconfig = this.app.loadModal(
        this.editdataconfigClass,
        {
          adv: false,
          class: "xs",
          title: "创建选项数据类型",
          type: "code-need",
          itemtitle: { yyy: "选项类型名称" }
        },
        { config: config }
      )
      editdataconfig.event._addEvent("formsubmit.submit", async data => {
        this.app.loading.show()
        data.parentId = 0
        let res = await this.api.dict_create(data)
        this.app.loading.hide()
        if (res.code == 0) {
          editdataconfig.close()
          this.apiload()
        } else {
          editdataconfig.showerror({
            value: res.msg
          })
        }
      })
    })
    this.dataControl.event._addEvent("datalist.choose", value => {
      this.newList = true
      this.model.listInfo = { parentId: value.bid, page: 1, pageSize: 10 }
      this.model.setData("listInfo", this.model.listInfo)
    })
  }

  //右侧的列表加载
  async listInfo() {
    if (this.table) this.table.showloading()
    let value = await this.api.dict_search(this.model.listInfo)
    if (value.data.list.length != 0) {
      let data2 = []
      this.listdata = {}
      value.data.list.map(item => {
        this.listdata[item.id] = item
        item.remark = item.remark ? item.remark : ""
        data2.push({
          id: item.id,
          operation: this.action
        })
      })
      this.table.setData(value.data.list, data2)
    } else {
      this.table.noData()
    }
    if (this.newList) {
      this.table.getTotal(value.data.pages, 2, value.data.total)
    }
  }
}

module.exports = dataconfig
