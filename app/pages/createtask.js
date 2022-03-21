//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import TaskNameItem from '@/components/task-name-item'
import SelectTablePage from '@/components/select-table-page'

class createtask extends Interstellar.pagesBase {
  complete() {
    this.app.loading.show()
    this.taskType = window.location.hash.indexOf("createtask") !== -1 ? 1 : 3
    if (this.taskType == 1) {
      this.app.header.openControl("taskmanage")
    } else {
      this.app.header.openControl("backflowtask")
    }
    this.yymcdata = [
      {
        val: "",
        idx: ""
      }
    ]
    this.taskDetail = {}
    this.apidata = {}
    this.apidata.condition = null
    this.dropobj = {}
    this.type = this.app.parpam.type
    this.taskId = this.app.parpam.taskid * 1
    this.companyarr = []
    this.companys = {}
    this.projectList = [] // 所属项目列表

    // 初始化Vue
    this.initVuePage()

    this.companyli = require("../modules/companyli/companyli")
    this.prodata = require("../modal/projectdata/projectdata")
    if (this.type == "view") {
      this.dom.find(".left1 .nowtitle").html("查看任务")
      // this.dom.find(".save").addClass("hide")
    } else {
      this.dom.find(".left1 .nowtitle").html("编辑任务")
      this.type === 'new' && this.app.loading.hide()
    }
    this.queryCompany("all")
    this.app.header.changeselected(1)
    this.styleModel(1)
    this.render()
    let that = this
    this.dom.find(".apidata").on("change", function() {
      let domtemp = ES.selctorDoc(this)
      let domApi = domtemp.attr("api")
      let domVal = domtemp.val()
      if (domtemp.attr("api") == "remark") {
        that.apidata[domApi] = JSON.stringify(domVal.trim()).slice(1, -1)
      } else if (domtemp.attr("api") == "cost") {
        that.apidata[domApi] = domVal * 1
      } else {
        that.apidata[domApi] = domVal
      }
      that.app.session.set("ischanged", true)
    })
    this.dom.find(".save").on("click", async () => {
      let isValidate = true
      // 验证vue的数据
      const data = this.vuePage.getFormData()
      if (data !== false) {
        this.apidata.name = data.name
      } else {
        isValidate = false
      }

      this.dom.find(".inputLine").dom.forEach(function(val, idx) {
        val.find("." + val.attr("redlabel")).removeClass("redborder")
        val.find(".required").remove()
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          val.find("." + val.attr("redlabel")).addClass("redborder")
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
              Tool.checkForm(ES.selctorDoc(val).dom, "red") +
              "</span>"
            )
        }
      })
      if (
        this.dom.find(".redborder").dom &&
        this.dom.find(".redborder").dom.some(item => {
          return item.box().clientHeight !== 0
        })
      ) {
        return false
      }


      this.apidata.type = this.taskType
      this.apidata.crossMarkNum = this.apidata.crossMarkNum
        ? parseInt(this.apidata.crossMarkNum)
        : null
      if (this.apidata.method == 1) { // 承包式
        // 校验表单数据
        const { companys = {}, companyarr = [] } = this
        const isAllValid = Object.values(companys).every((company, i) => {
          if (companyarr[i].delete) return true // 删除的不验证
          return company.validate()
        })

        if (!isAllValid) return false

        this.apidata.venderAssignList = this.companyarr.filter(item => {
          return item.delete !== true
        })
      }

      if (!isValidate) return false // 验证不通过

      if (this.type == "new") {
        this.app.loading.show()
        let res = await this.api.createTask(this.apidata)
        this.app.loading.hide()
        if (res.code == 0) {
          this.app.session.clearAll()
          this.app.changePage(
            this.taskType == 1 ? "createtask2" : "createbackflowtask2",
            {
              type: "edit",
              taskid: res.data.taskId,
              projectid: this.apidata.projectId
            }
          )
        } else {
          this.app.alert.show({
            title: " ",
            msg: res.msg,
            close: false
          })
        }
      } else {
        this.apidata.id = this.taskId
        this.apidata.cost = this.dom.find(".apidata[api=cost]").val() * 1
        this.app.loading.show()
        let res = await this.api.updaTetask(this.apidata)
        this.app.loading.hide()
        if (res.code == 0) {
          this.app.session.clearAll()
          this.app.changePage(
            this.taskType == 1 ? "createtask2" : "createbackflowtask2",
            {
              type: this.type,
              taskid: this.taskId,
              projectid: this.apidata.projectId
            }
          )
        } else {
          this.app.alert.show({
            title: " ",
            msg: res.msg,
            close: false
          })
        }
      }
    })
    // 目前发现是废代码
    this.dom.find(".yrdata").on("click", function() {
      if (!ES.selctorDoc(this).hasClass("disabled")) {
        that.prodatapoll = that.app.loadModal(
          that.prodata,
          { adv: true },
          { type: "add", id: that.taskId }
        )
        that.resetPage = true
        that.prodatapoll.event._addEvent("projectdata.addall", value => {
          that.apidata.condition = value.query
          delete that.apidata.condition.page
          delete that.apidata.condition.pageSize
          if (value.total > 0) {
            that.dom.find(".yyrarea").removeClass("hide")
            that.dom.find(".yyr .num").html(value.total)
          }
          that.prodatapoll.close()
        })
        that.prodatapoll.event._addEvent("projectdata.search", value => {
          that.resetPage = true
          that.model.setData("proseriesdata", value.data)
        })
        that.prodatapoll.event._addEvent("hospital.input", value => {
          that.queryHospitalName(value)
        })
        that.prodatapoll.event._addEvent("prodata.pagenumber", value => {
          that.resetPage = false
          that.model.setData("proseriesdata", value.data)
        })
        that.prodatapoll.event._addEvent("prodata.pagesize", value => {
          that.resetPage = true
          that.model.setData("proseriesdata", value.data)
        })
        that.queryHospitalName("")
        that.model.setData("proseriesdata", this.model.getData("proseriesdata"))
      }
    })
    this.dom.find(".viewproject").on("click", this.porjectDetail.bind(this))
    // this.dom.find(".icon-tianjia").on("click", () => {
    //   this.companyarr.push({ venderId: "", cost: "", costVisible: "" })
    //   this.addcompanyli()
    // })
    
    this.dom.find(".kfsarea .cost-visible").on("click", function() {
      if (that.type != "view") {
        if (ES.selctorDoc(this).hasClass("choose")) {
          ES.selctorDoc(this).removeClass("choose")
          that.apidata.costVisible = false
        } else {
          ES.selctorDoc(this).addClass("choose")
          that.apidata.costVisible = true
        }
      }
    })

    this.dom.find(".inputLine .stenosis-detection-copy").on("click", function() {
      if (that.type != "view") {
        if (ES.selctorDoc(this).hasClass("choose")) {
          ES.selctorDoc(this).removeClass("choose")
          that.apidata.stenosisDetectionCopy = false
        } else {
          ES.selctorDoc(this).addClass("choose")
          that.apidata.stenosisDetectionCopy = true
        }
      }
    })
  }
  // Vue相关
  initVuePage() {
    const _this = this;
    this.vuePage = new Vue({
      el: '#createtask',
      components: {
        TaskNameItem,
        SelectTablePage
      },
      data() {
        return {
          placeholder: '请选择所属项目',
          projectId: '',
          multiple: false,
          likeListPage: {},

          taskType: _this.taskType, // 1: 标注 2: 算法
          type: _this.type, // new, view, edit
          projectDetail: {},
          ruleForm: {
            nameData: '',
            name: ''
          },
          rules: {
            name: [{ required: true, message: '请输入任务名称', trigger: ['change', 'blur'] }],
          }
        }
      },
      watch: {
        'ruleForm.nameData'(val) {
          this.ruleForm.name = val
        },
        projectId(value){
          console.log(value);
          value ? this.handleClick(value) : this.clearClick();
        }
      },
      computed: {
        isAdd: () => this.type === 'new',
        isView: () => this.type === 'view'
      },
      async mounted(){
        console.log(_this.type);
        this.queryProject();
        this.projectId ? this.handleClick(value) : this.clearClick();
      },
      methods: {
        initProjectData(data) {
          this.projectDetail = data || {}
        },
        initFormData(data) {
          const { name, projectName, projectId } = data
          this.ruleForm.name = name
          this.placeholder = projectName;
          this.projectId = projectId;
          _this.apidata.projectId = projectId
        },
        getFormData() {
          let data = this.ruleForm
          this.$refs.taskNameRef && this.$refs.taskNameRef.validateForm(val => {
            if (!val) data = false
          })
          this.$refs.ruleForm.validate(val => {
            if (!val) data = false
          })
          return data
        },
        async queryProject(options={}) {
          let { data } = await _this.api.queryProject(
            options.page || 1,
            options.pageSize || 20,
            options.value,
            _this.taskType,
            _this.taskId
          );
          this.likeListPage = data;
        },
        handleClick(value){
          _this.apidata.projectId = value
          _this.apidata.condition = null
          _this.apidata.cleared = true
          _this.dom.find(".yyr .num").html("0")
          _this.dom.find(".yyrarea").addClass("hide")
          _this.dom.find(".viewproject").removeClass("disabled")
          _this.dom.find(".btnline .biaozhubtn").removeClass("disabled")
          _this.app.session.set("ischanged", true)
          this.initProjectData(_this.projectList.find(v => v.id === _this.apidata.projectId)) // 初始化vue数据
        },
        clearClick(){
          _this.apidata.projectId = ""
          _this.apidata.condition = null
          _this.apidata.cleared = true
          _this.queryProject("", true)
          _this.dom.find(".viewproject").addClass("disabled")
          _this.dom.find(".btnline .biaozhubtn").addClass("disabled")
          this.initProjectData({}) // 初始化vue数据
        }
      }
    })
  }

  // 查看项目详情
  async porjectDetail() {
    if (!this.dom.find(".viewproject").hasClass("disabled")) {
      let res = await this.api.projectDetail(this.apidata.projectId)
      this.vuePage.initProjectData(res.data) // 初始化vue数据
      let modal = require("../modal/projectdetail/projectdetail")
      this.app.loadModal(modal, { adv: true }, { data: res.data })
    }
  }

  // 查询医院
  async queryHospitalName(name) {
    let { data } = await this.api.queryHospitalName(name)
    let hospitals = data.list.map(item => {
      let obj = {}
      obj.idx = item["code"]
      obj.val = item["name"]
      return obj
    })
    this.prodatapoll.resetxlk(hospitals)
  }

  // 查询公司
  async queryCompany(type, value) {
    if (type == "all") {
      this.companydata = []
    } else {
      this.inputcompany = []
    }
    let json = {
      page: 1,
      pageSize: 1000,
      name: value ? value.data.data : ""
    }
    let { data } = await this.api.queryCompany(json)
    data.list.forEach((val, idx) => {
      let obj = {
        idx: val.id,
        val: val.name
      }
      if (type == "all") {
        this.companydata.push(obj)
      } else {
        this.inputcompany.push(obj)
      }
    })
    if (type !== "all") {
      this.companys[value.num].setxlkvalue(this.inputcompany)
    }
  }


  
  

  // 查看项目
  async queryProject(val, bool) {
    let { data } = await this.api.queryProject(
      1,
      20,
      val,
      this.taskType,
      this.taskId
    )
    let projects = data.list.map(item => {
      let obj = {}
      obj.val = item.name
      obj.idx = item.id
      return obj
    })
    this.projectList = data.list
    // this.dropobj["ssxm"].renderHtml(projects)
    if (this.type !== "new" && !bool) {
      this.setData();
    }
  }

  todisabled() {
    this.dom.find("input:not(.el-input__inner)").attr("disabled", "disabled") // companyli里的input可以编辑
    this.dom.find("textarea").attr("disabled", "disabled")
    this.dom.find(".showData").off("click")
    this.dom.find(".btnline .biaozhubtn").off("click")
    this.dom.find(".showData i").off("mouseenter")
    this.dom.find(".btnline .biaozhubtn").addClass("hide")
    for (let i in this.dropobj) {
      this.dropobj[i].disable()
    }
    // for (let i in this.companys) {
    //   this.companys[i].disabled()
    // }
    // this.dom.find(".icon-tianjia").remove()
  }

  async setData() {
    this.app.loading.show()
    let { data } = await this.api.taskDetail(parseInt(this.app.parpam.taskid))
    this.vuePage.initFormData(data) // 初始化vue数据
    this.taskDetail = data
    this.app.loading.hide()
    this.dom
      .find(".apidata[api=remark]")
      .val(data.remark ? JSON.parse('"' + data.remark + '"') : "")
    let temp = data.algPreAnnotation == true ? 1 : 0
    if (
      this.dom.find('.algPreAnnotation .option[data-idx="' + temp + '"]').dom
    ) {
      this.dom
        .find('.algPreAnnotation .option[data-idx="' + temp + '"]')
        .click()
    }
    // if (this.dom.find('.ssxm .option[data-idx="' + data.projectId + '"]').dom) {
    //   this.dom.find('.ssxm .option[data-idx="' + data.projectId + '"]').click()
    // }
    this.apidata.cleared = false
    if (
      this.dom.find(
        '.assignMethod .option[data-idx="' + data.assignMethod + '"]'
      ).dom
    ) {
      this.dom
        .find('.assignMethod .option[data-idx="' + data.assignMethod + '"]')
        .click()
    }
    this.dom.find(".apidata[api=crossMarkNum]").val(data.crossMarkNum)
    this.apidata.crossMarkNum = data.crossMarkNum
    this.startdate.refresh({ st: Tool.time(data.startTime, "yyyy-mm-dd") })
    this.endTime.refresh({ st: Tool.time(data.endTime, "yyyy-mm-dd") })
    this.dom.find(".apidata[api=cost]").val(data.cost)

    if (data.costVisible) {
      this.dom.find(".kfsarea .cost-visible").addClass("choose")
    }
    if (data.stenosisDetectionCopy) {
      this.dom.find(".inputLine .stenosis-detection-copy").addClass("choose")
    }
    if (this.dom.find('.method .option[data-idx="' + data.method + '"]').dom) {
      this.dom.find('.method .option[data-idx="' + data.method + '"]').click()
    }
    if (data.venderAssignList) {
      this.companyarr = []
      this.dom.find(".companys").remove()
      data.venderAssignList.forEach((val, idx) => {
        this.companyarr.push(val)
        this.addcompanyli(val, idx)
      })
    }
    if (data.seriesTotalNum > 0) {
      this.dom.find(".yyrarea").removeClass("hide")
      this.dom.find(".yyrarea .yyr .num").html(data.seriesTotalNum)
    }
    this.app.session.clearAll()
    if (this.type == "view") {
      this.todisabled()
    }
    this.model.setData("querytask", this.model.getData("querytask"))
  }

  render() {
    let calendar = require("../moduleslibs/times/times")
    this.startdate = this.app.loadModule(
      calendar,
      this.dom.find(".startdate"),
      { type: "s", dateShow: true }
    )
    this.endTime = this.app.loadModule(calendar, this.dom.find(".enddate"), {
      type: "s",
      dateShow: true
    })
    this.endTime.event._addEvent("times.startend", value => {
      this.apidata.endTime = value.st + " 23:59:59"
      this.app.session.set("ischanged", true)
      this.startdate.refreshData({ max: value.st }, "maxmin")
    })
    this.endTime.event._addEvent("times.dele", () => {
      this.apidata.endTime = ""
      this.startdate.refreshData({ max: "" }, "maxmin")
    })
    this.startdate.event._addEvent("times.startend", value => {
      this.apidata.startTime = value.st + " 00:00:00"
      this.app.session.set("ischanged", true)
      this.endTime.refreshData({ min: value.st }, "maxmin")
    })
    this.startdate.event._addEvent("times.dele", () => {
      this.apidata.startTime = ""
      this.endTime.refreshData({ min: "" }, "maxmin")
    })
    let dropconfig = [
      {
        name: "algPreAnnotation",
        className: "kxlk",
        firstSelect: { val: "请选择任务类型", idx: "" },
        data: [
          { val: "人工标注", idx: 0 },
          { val: "算法标注", idx: 1 }
        ]
      },
      // {
      //   name: "ssxm",
      //   className: "kxlk",
      //   firstSelect: { val: "请选择一个项目", idx: "" },
      //   input: true,
      //   data: this.yymcdata
      // },
      {
        className: "kxlk",
        name: "method",
        firstSelect: { val: "请选择任务方式", idx: "" },
        data: [
          { val: "承包式", idx: 1 },
          { val: "开放式", idx: 2 }
        ]
      },
      {
        className: "xlk",
        name: "assignMethod",
        firstSelect: { val: "请选择任务分配方式", idx: "" },
        data: [
          { val: "抢单式", idx: 2 },
          { val: "交叉式", idx: 3 }
        ]
      }
    ]
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      dropconfig.forEach((val, idx) => {
        let drop = this.app.loadModule(
          dropdown,
          this.dom.find("." + val.name),
          {
            className: val.className,
            firstSelect: val.firstSelect,
            data: val.data,
            input: val.input
          }
        )
        drop.event._addEvent("option.click", value => {
          this.apidata[val.name] = parseInt(value.idx)
          this.app.session.set("ischanged", true)
        })
        drop.event._addEvent("dropDown.clear", value => {
          this.apidata[val.name] = ""
        })
        drop.event._addEvent("drop.input", debounce(function(value){
          this.queryProject(value.data, true)
        }).bind(this))
        this.dropobj[val.name] = drop
      })
      this.dropobj["algPreAnnotation"].event._addEvent(
        "option.click",
        value => {
          if (value.idx == "1") {
            this.dom.find('.method .option[data-idx="1"]').click()
            this.dom.find('.assignMethod .option[data-idx="2"]').click()
            this.dom.find(".cbsarea .iconfont").addClass("hide")
            this.dropobj["method"].disable()
            this.dropobj["assignMethod"].disable()
          } else {
            this.dropobj["method"].able()
            this.dropobj["assignMethod"].able()
            this.dom.find(".cbsarea .iconfont").removeClass("hide")
          }
          this.apidata.algPreAnnotation = Boolean(parseInt(value.idx))
          this.app.session.set("ischanged", true)
        }
      )
      this.dropobj["assignMethod"].event._addEvent("option.click", value => {
        this.apidata.crossMarkNum = null
        if (value.idx == 2) {
          this.dom
            .find(".marktimes")
            .parent()
            .addClass("hide")
          this.dom.find(".marktimes").val("")
          this.apidata.assignMethod = 2
        } else {
          this.dom
            .find(".marktimes")
            .parent()
            .removeClass("hide")
          this.apidata.assignMethod = 3
        }
        this.app.session.set("ischanged", true)
      })
      // this.dropobj["ssxm"].event._addEvent("option.click", value => {
      //   this.apidata.projectId = parseInt(value.idx)
      //   this.apidata.condition = null
      //   this.apidata.cleared = true
      //   this.dom.find(".yyr .num").html("0")
      //   this.dom.find(".yyrarea").addClass("hide")
      //   this.dom.find(".viewproject").removeClass("disabled")
      //   this.dom.find(".btnline .biaozhubtn").removeClass("disabled")
      //   this.app.session.set("ischanged", true)
      //   this.vuePage.initProjectData(this.projectList.find(v => v.id === this.apidata.projectId)) // 初始化vue数据
      // })
      // this.dropobj["ssxm"].event._addEvent("dropDown.clear", value => {
      //   this.apidata.projectId = ""
      //   this.apidata.condition = null
      //   this.apidata.cleared = true
      //   this.queryProject("", true)
      //   this.dom.find(".viewproject").addClass("disabled")
      //   this.dom.find(".btnline .biaozhubtn").addClass("disabled")
      //   this.vuePage.initProjectData({}) // 初始化vue数据
      // })
      this.dropobj["method"].event._addEvent("option.click", value => {
        this.dom.find(".rwfsarea").addClass("hide")
        this.apidata.method = parseInt(value.idx)
        this.companyarr = []
        if (value.idx == "1") {
          this.dom.find(".cbsarea").removeClass("hide")
          if (this.companyarr.length == 0) {
            this.companyarr.push({ venderId: "", cost: "", costVisible: "" })
            this.dom.find(".companys").remove()
            this.addcompanyli()
          }
        } else if (value.idx == "2") {
          this.dom.find(".kfsarea").removeClass("hide")
          this.getpeoplenum()
        }
        this.app.session.set("ischanged", true)
      })
      this.queryProject()
    })
  }

  // 查询参与标注人数
  async getpeoplenum() {
    let res = await this.api.userCount({ taskType: 1 })
    if (res.code == 0) {
      this.dom.find(".kfsarea .people").html(res.data.count)
    } else {
      Tool.errorshow(res.msg, this.app)
    }
  }

  // 添加公司
  addcompanyli(val) {
    this.dom
      .find(".cbsarea")
      .append(
        '<li id="company' + this.companyarr.length + '" class="companys company' + this.companyarr.length + '" previous="' + !!val + '"></li>'// 添加previous属性是为了区别之前已经添加的和本次新添加的
      )
    let company = this.app.loadModule(
      this.companyli,
      this.dom.find(".company" + this.companyarr.length),
      { num: this.companyarr.length, previous: !!val, status: this.taskDetail.status }
    )
    company.setxlkvalue(this.companydata)
    company.event._addEvent("companyli.getCompanyarr", target => {
      target.companyarr = this.companyarr || []
    })
    company.event._addEvent("companyli.addcompany", value => {
      this.companyarr.push({ venderId: "", cost: "", costVisible: "" })
      this.addcompanyli()
    })
    company.event._addEvent("companyli.choosed", value => {
      this.user_list(value.data.idx, value.num)
      this.companyarr.forEach(function(val, idx) {
        if (val.venderId == parseInt(value.data.idx) && idx !== value.num - 1) {
          company.cleardata()
        }
      })
    })
    company.event._addEvent("companyli.datachange", value => {
      this.companyarr[value.num - 1] = value.data
    })
    company.event._addEvent("companyli.delete", value => {
      if (this.dom.find(".companys").dom.length === 1) {
        this.app.alert.show({
          title: " ",
          msg: '只剩一行不能再删了',
          close: false
        })
        return
      }
      this.companyarr[value.num - 1].delete = true
      this.dom.find(".company" + value.num).remove()
      // 通知子组件总数更新
      Object.values(this.companys).forEach(company => company.onCompanyarrChange(this.companyarr))
    })
    company.event._addEvent("companyli.cominput", value => {
      this.queryCompany("input", value)
    })
    this.companys[this.companyarr.length] = company
    if (val) {
      company.setdata(val)
    }
    // 通知子组件总数更新
    Object.values(this.companys).forEach(company => company.onCompanyarrChange(this.companyarr))
  }
  async user_list(id, index) {
    let res = await this.api.user_list({ venderId: id * 1, taskType: 1 })
    res.data.list.forEach(v => {
      v.idx = v.id
      v.val = v.name + "(" + v.mobile + ")"
    })
    this.companys[index].renderPeople(res.data.list)
  }
}

module.exports = createtask
