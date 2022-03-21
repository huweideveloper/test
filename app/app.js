import commonApi from '@/api/common.api.js'
//数据存储
var local = require("./model/local.js")
var model = require("./model/model.js")
var session = require("./model/session.js")

//模块基类和弹层基类
//var Base = require('./base/modulesbase.js')
//var modalBase = require('./base/modalbase.js')
//var modaAdvanceBase = require('./base/modalbase/modalbase.js')
var modaAdvanceHtml = require("./base/modalbase/tpl.html")

//模板方法
var JTemp = require("./libs/template.js")

//svg画图方法
var svgLib = require("./libs/drawsvg/lib.js")
var svgTip = require("./libs/tip.js")

//头部，尾部，菜单，加载模块
var headerClass = require("./moduleslibs/header/header.js")

var menuClass = require("./moduleslibs/menu/menu.js")
//var footer = require('./moduleslibs/footer/footer.js')

//通用弹框加载
var alert = require("./modallibs/alert/modal.js")
var loading = require("./modallibs/loading/loading.js")
var apialert = require("./modallibs/apialert/apialert.js")

//app的一些初始配置
var lM = require("./utils/language.js")
var app = {
  //domain: '/aaa/', //反向代理完成，全部使用本地的接口地址
  //domain1:'/dalution-api-impala/',
  cloud: window.cloud,
  domain: "/data/",
  libsUrl: "//172.16.100.221:44444/",
  domain1: "/aaa/",
  // domain2: '/user/', //用户中心
  domain3: "/config/", //配置中心
  language: "cn",
  languageMode: new lM(),
  _adapss: "2",
  _seen: "dsdj",
  main: "login", //无hash的时候跳转到的首页
  svgLib: svgLib,
  svgTip: svgTip,
  local: local,
  model: model,
  session: session,
  parpam: {},
  modalId: 0, //打开的弹层的id
  header: null,
  pagerclass: null,
  //footer: footerClass,
  menu: null,
  constmap: {},
  disease: {
    ANNO1: "骨折点",
    ANNO2: "骨分割",
    ANNO3: "肺结节",
    ANNO4: "钙化灶",
    ANNO5: "冠脉点",
    ANNO6: "眼底病灶",
    ANNO7: "肺结核"
  },
  toolList: [
    {
      val: "圆形",
      idx: "ELLIPSE"
    },
    {
      val: "矩形",
      idx: "RECTANGLE"
    },
    {
      val: "直线",
      idx: "LINE"
    },
    {
      val: "单点魔法棒",
      idx: "MAGIC_STICK_SINGLE"
    },
    {
      val: "多边形",
      idx: "POLYGON"
    },
    {
      val: "快速选择",
      idx: "QSELECT"
    },
    {
      val: "区域勾面",
      idx: "REGION_PAINT"
    },
    {
      val: "自由画笔",
      idx: "FREEHAND"
    },
    {
      val: "角度",
      idx: "ANGLE"
    },
    {
      val: "自由画笔（非mask）",
      idx: "FREEHANDLINE"
    },
    {
      val: "cobb角",
      idx: "COBB"
    },
    {
      val: "脊椎顺列",
      idx: "ALIGNMENT"
    }
  ],
  //   操作日志记录
  logcreate: function(value) {
    ES.ajax({
      url: app.domain + "op/log/create",
      type: "POST",
      dataType: "json",
      questring: value
    }).then(function(response) {
      if (response.code == "100001") {
        app.changePage("login")
      }
    })
  },
  //渲染模板的方法
  renderTemplate: function(html, data) {
    var backH = ""
    if (data) {
      var temp = new JTemp()
      temp.Temp(html)
      backH = temp.build(data)
      var newH = dotoAll(backH)
      backH = newH ? newH : backH
    } else {
      backH = html
    }
    return backH
  },
  //加载模块的方法
  loadModule: function(value, el, data, addMode) {
    let newModule = {}
    if (typeof value.prototype.complete === "function") {
      //新的继承方式
      newModule = new value(app, el, data, addMode)
      newModule = new Proxy(newModule, handler)
      newModule.init()
    }
    // else {
    //   //老的继承方式
    //   newModule = new Base()
    //   value.call(newModule)
    //   newModule.init(app, el, data)
    // }
    return newModule
  },
  //加载弹窗的方法
  loadModal: function(value, value1, parameter, addMode) {
    let newModule
    //console.log(value.prototype.complete,'value.prototype.complete')
    if (typeof value.prototype.complete === "function") {
      //新的继承方式
      return esloadModal(value, value1, parameter, addMode)
    } else {
      //老的继承方式
      //return loadModal(value, value1, parameter, addMode)
    }
  },
  setCookie: function() {
    var expireTime = new Date().getTime() + 1000 * 36000
    var da = new Date()
    da.setTime(expireTime)
    document.cookie =
      "SESSION=" +
      app.local.get("SESSION") +
      ";expires=" +
      da.toGMTString() +
      ";path=/"
  },
  goBack: function(value, def) {
    if (value.meta) {
      if (value.meta.status == "302") {
        app.changePage("login")
      } else if (value.meta.status == "403") {
        def.resolve(value)
      } else {
        def.resolve(value)
      }
    }
  },
  tokentime: function() {
    if (local.get("starttime")) {
      let rti = local.get("starttime") * 1
      let nti = new Date().getTime()
      if (nti - rti > 1000 * 60 * 1000) {
        // local.del('starttime')
        return false
      } else {
        local.set("starttime", nti)
      }
    } else {
      local.set("starttime", new Date().getTime())
    }
    return true
  },
  resize: function() {},
  apiresult: function(res) {
    switch (String(res.code)) {
      case "501":
        app.changePage("login")
        return false
        break
      case "0":
        break
      case "-1":
        app.alert.show({
          title: " ",
          msg: "繁忙",
          close: true,
          footer: true
        })
        return false
      case "503":
        app.alert.show({
          title: " ",
          msg: "账户已被冻结。",
          close: true,
          footer: false,
          sure: function() {
            app.changePage("login")
          }
        })
        setTimeout(function() {
          app.alert.hide()
          app.changePage("login")
        }, 5000)
        return false
        break
    }
    return true
  },
  refreshheader: function() {
    header.init(app, ES.selctorDoc("#header"))
    app.header.setloginname()
  },
  async querySysInfo(taskId) {
    const res = await commonApi.querySysInfo({ taskId })
    return res
  }
}
const handler = {
  get: function(obj, prop) {
    return obj[prop]
  },
  set: function(obj, prop, value) {
    if (_privateInvariant(prop, "set")) {
      obj[prop] = value
    }
    return true
  }
}

function _privateInvariant(property, action) {
  if (
    property[0] === "_" ||
    property === "dom" ||
    property === "nowParam" ||
    property === "app"
  ) {
    throw new Error(
      `Invalid attempt to ${action} private "${property}" property`
    ) // 禁止操作私有属性
    return false
  }
  return true
}

//多语言版的模式
if (navigator.language) {
  var languagewewqe = navigator.language
} else {
  var languagewewqe = navigator.browserLanguage
}
if (
  languagewewqe.lastIndexOf("zh-CN") != -1 ||
  languagewewqe.lastIndexOf("zh-cn") != -1
) {
  app.language = "cn"
} else {
  app.language = "en"
}
if (window.location.search) {
  let lan = window.location.search.replace("?", "")
  let aa = lan.split("&")
  aa.map(item => {
    if (item.lastIndexOf("en") != -1) {
      app.language = "en"
    } else {
      app.language = "cn"
    }
  })
  //app.language = window.location.search.replace('?', '')
}
let header = (app.header = app.loadModule(
  headerClass,
  ES.selctorDoc("#header")
))

let menu = (app.menu = app.loadModule(menuClass, ES.selctorDoc("#menu")))
//新老加载弹框的方法

//es6的弹框加载模式
function esloadModal(value, value1, parameter, addMode) {
  //console.log(value, value1, 'value211314')
  if (value1) {
    if (value1.adv) {
      let modalClass = new value(app, value1, parameter, addMode)
      modalClass = new Proxy(modalClass, handler)
      modalClass.init()
      return modalClass
    }
  }
  let modalClass = new value(app, value1, parameter, addMode)
  let newhtml = modaAdvanceHtml // new modaAdvanceBase().html
  let endHtml = modalClass.html
  modalClass.html = newhtml.replace(/(\$\{body-content\})/g, endHtml)
  modalClass = new Proxy(modalClass, handler)
  modalClass.init()
  if (value1.close) {
    modalClass.dom.find(".modal-close").on("click", function() {
      modalClass.close()
      modalClass.event._dispatch("modal.cancel")
    })
  }
  if (value1.cancel) {
    modalClass.dom.find(".btn-cancel").on("click", function() {
      modalClass.close()
      modalClass.event._dispatch("modal.cancel")
    })
  }
  modalClass.dom.find(".btn-confirm").on("click", function() {
    modalClass.event._dispatch("modal.confirm")
  })
  return modalClass
}

function dotoAll(value) {
  if (value) {
    // return value
    var nodeArray = value.match(
      /<template w-data(?:=[^{,},<,>])\S{1,} w-template(?:=[^{,},<,>])\S{1,}><\/template>/g
    )
    //console.log(nodeArray,value)
    if (!nodeArray) {
      return value
    }
    if (nodeArray.length != 0) {
      for (var i = 0; i < nodeArray.length; i++) {
        //console.log(nodeArray[i],i,'============')
        var data = nodeArray[i]
          .match(/w-data(?:=[^{,},<,>])\S{1,}/g)[0]
          .replace('w-data="', "")
          .replace(/"$/g, "")
        var link = nodeArray[i].match(/w-template(?:=[^{,},<,>])\S{1,}/g)[0] //.replace('w-template="', '').replace('"></template>', '')
        link = link.replace("w-template=", "").replace("></template>", "")
        var html = require("./templates/" + link)
        value = value.replace(
          nodeArray[i],
          app.renderTemplate(html, JSON.parse(data))
        )
      }
      return value
    }
  }
  return null
}

//app.token = __aw__(app._adap + '_' + app._seen)
//ES.selctorDoc('#header').html(header.html)
//$('#footer').html(footerClass.html)
//ES.selctorDoc('#menu').html(menuClass.html)
//header.init(app, ES.selctorDoc('#header'))
//footerClass.init(app, $('#footer'))
//menuClass.init(app, $('#menu'))

//初始化框架通用弹框
app.loading = app.loadModal(loading, { zin: 1200, adv: true })
app.loading.hide()

app.alert = app.loadModal(alert, { zin: 1200, adv: true })
app.alert.hide()

app.apialert = app.loadModal(apialert, { zin: 1200, adv: true })
app.apialert.hide()

module.exports = app
