class addalgorithm extends Interstellar.modalBase {
  complete() {
    let that = this
    this.yymcdata = [
      {
        val: "医院1",
        idx: "1"
      },
      {
        val: "医院2",
        idx: "2"
      }
    ]
    this.apidata = {}
    this.render()
    this.setTitle()
    this.resize()
    this.dom.find(".create").on("click", function() {
      that.app.changePage("createtask")
    })
  }
  render() {
    let that = this
    require.ensure("../../moduleslibs/duoxuanxlk/duoxuanxlk.js", function() {
      let dropdown = require("../../moduleslibs/duoxuanxlk/duoxuanxlk.js")
      that.xmmc = that.app.loadModule(dropdown, that.dom.find(".xmmc"), {
        showname: "项目名称",
        data: that.yymcdata
      })
      that.xmmc.event._addEvent("duoxuan.select", function(value) {
        that.apidata["xmmc"] = value.name
        console.log(that.apidata, "apidata")
      })
      that.bbmc = that.app.loadModule(dropdown, that.dom.find(".bbmc"), {
        datatype: "arr",
        showname: "部位名称",
        data: that.yymcdata
      })
      that.bbmc.event._addEvent("duoxuan.select", function(value) {
        that.apidata["bbmc"] = value.name
        console.log(that.apidata, "apidata")
      })
      that.getxlvalue()
    })
    require.ensure("../../moduleslibs/times_double/times.js", function() {
      let calendar = require("../../moduleslibs/times_double/times.js")
      let todayTime = new Date()
      let Month =
        todayTime.getMonth() + 1 < 10
          ? "0" + (todayTime.getMonth() + 1)
          : todayTime.getMonth() + 1
      let today =
        todayTime.getFullYear() + "-" + Month + "-" + todayTime.getDate()
      that.startTime = that.app.loadModule(
        calendar,
        that.dom.find(".timefilter"),
        { titleShow: false, defaultword: "请选择时间" }
      )
      that.startTime.event._addEvent("times1.day", function(value) {
        that.apidata.startDate = value.st
        that.apidata.endDate = value.et
        console.log(that.apidata)
      })
      that.startTime.event._addEvent("times.dele", function() {
        that.search.startStudyDate = ""
        that.endTime.refreshData(
          {
            min: "",
            max: today
          },
          "maxmin"
        )
        that.event._dispatch("homeleft.able", { idx: 1 })
      })
    })
  }
  getxlvalue() {
    let that = this
    that.api.bodyPartExamined().done(function(res) {
      that.bbmc.setData(res.data)
    })
  }
  setTitle() {
    let obj = {}
    let that = this
    obj["icon"] = {
      examCode: {
        name:
          '<span data-i18n="age" data-name="年龄">项目ID</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "checkid",
        w: "10%",
        ww: "10%",
        n: "40"
      },
      patientId: {
        name:
          '<span data-i18n="age" data-name="年龄">项目名称</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "pid",
        w: "15%",
        ww: "10%"
      },
      patientName: {
        name:
          '<span data-i18n="age" data-name="年龄">版本ID</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "pname",
        w: "8%",
        ww: "8%"
      },
      patientSex: {
        name:
          '<span data-i18n="age" data-name="年龄">版本名称</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "psex",
        w: "10%",
        ww: "8%"
      },
      patientAge: {
        name:
          '<span data-i18n="age" data-name="年龄">备注</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "age",
        w: "14%",
        ww: "14%"
      },
      positive: {
        name:
          '<span data-i18n="aidiag" data-name="智能诊断">导入日期</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "positive",
        w: "10%",
        ww: "9%"
      },
      deviceName: {
        name:
          '<span data-i18n="shebei" data-name="设备">对应影像文件名称</span><span><i nowid="0" class="arrowimg1" name="exam_code"></i></span>',
        type: "text",
        code: "shebei",
        w: "17%",
        ww: "17%"
      },
      studyDate: {
        name: '<span data-i18n="date" data-name="检查时间">序列号</span>',
        type: "text",
        code: "date",
        w: "8%",
        ww: "8%"
      },
      handler: {
        name: '<span data-i18n="handler" data-name="状态">对应文件类型</span>',
        type: "text",
        code: "handler",
        w: "8%",
        ww: "8%"
      }
    }
    obj["actionicon"] = {
      operation: {
        name: '<span data-i18n="action" data-name="操作">操作</span>',
        type: "action",
        code: "action",
        w: "100%",
        ww: "100%"
      }
    }
    obj["minwidth"] = 1300
    obj["tablewidth"] = ES.selctorDoc(".algorithmtable").box().clientWidth - 140
    obj["type"] = "center"
    require.ensure("../../moduleslibs/table_group/table_group", function() {
      let cont_table = require("../../moduleslibs/table_group/table_group")
      that.table = that.app.loadModule(
        cont_table,
        that.dom.find(".algorithmtable"),
        {
          id: "algorithmtable",
          header: obj
        }
      )
      that.table.event._addEvent("table.pagenumber", function(value) {
        that.apiData.currentPage = parseInt(value)
        that.setMain()
      })
      that.table.event._addEvent("table.paixu", function(value) {
        if (value.sort) {
          that.apiData.order = value.order
          that.apiData.orderColumn = value.sort
        }
        that.setMain()
      })
      that.table.event._addEvent("table.list1", function(value) {
        let url1 = window.location.href
        let url
        if (that.nowlistData[value].deviceName == "CT") {
          //that.app.changePage('ct', { studyId: value })
          url = url1.split("#")[0] + "#!/newct/" + value
          that.openWindow(url)
        } else {
          url =
            url1.split("#")[0] +
            "#!/xray/" +
            value +
            "/" +
            that.nowlistData[value].deviceName
          that.openWindow(url)
          //that.app.changePage('xray', { studyId: value,xtype:that.nowlistData[value].deviceName })
        }
      })
      that.table.event._addEvent("table.ul", function(value) {
        let url1 = window.location.href
        let url
        if (that.nowlistData[value].deviceName == "CT") {
          //that.app.changePage('ct', { studyId: value })
          url = url1.split("#")[0] + "#!/newct/" + value
          that.openWindow(url)
        } else {
          url =
            url1.split("#")[0] +
            "#!/xray/" +
            value +
            "/" +
            that.nowlistData[value].deviceName
          that.openWindow(url)
          //that.app.changePage('xray', { studyId: value,xtype:that.nowlistData[value].deviceName })
        }
      })
      that.dom.find(".list-content").removeClass("hide")
      that.initscroll()
      that.inittable()
      that.setMain(true)
    })
  }
  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    this.dom.find(".algorithmdata").attr("id", rid)
    this.myScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    })
  }
  inittable() {
    if (this.myScroll1) {
      this.myScroll1.refresh()
      return
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc(".maintable").attr("id", rid)
    this.myScroll1 = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      scrollX: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    })
  }
  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc(".algorithmdata").css({ height: ch })
    ES.selctorDoc(".algorithmtable").css({ width: cw })
  }
  getTotal() {
    table.getTotal(totalPage, 7)
  }
}
module.exports = addalgorithm
