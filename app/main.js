/*
history决定使用hash方式还是history方式，未开发
route.config根据router的配置来决定路径上面的参数和key值
*/
require('./base/base.less')
require('./base/element-ui.less')
require('./base/sassFrame.less')
require('./base/time.less')
require('./base/theme/index.css')
Promise = require('es6-promise')

import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import Element from 'element-ui'
import * as filters from './filters'
import {
  setSessionStorage,
  setLocalStorage
} from './utils/storage';

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
Vue.use(Element)
window.Vue = Vue

window.Proxy =
  window.Proxy ||
  function (target, handler) {
    if (typeof target !== 'function' && typeof target !== 'object') {
      throw new TypeError('Only support function proxy in this polyfill')
    }
    if (typeof target === 'object' && typeof handler === 'object') {
      Object.assign(target, handler)
      target.prototype = handler.prototype
    }
    var __Proxy__ = target //.apply(this, arguments);
    __Proxy__.prototype = target.prototype // 复制原对象的原型
    return __Proxy__
  }

import 'babel-polyfill'
Array.prototype.search = function (value) {
  if (this.length != 0) {
    var st = ',' + this.toString() + ','
    if (st.lastIndexOf(',' + value + ',') != -1) {
      return st.lastIndexOf(',' + value + ',')
    } else {
      return -1
    }
  }
  return -1
}

var history = 'hash'
var baseR = '../'
var app = require('./app.js')
let httpre = require('./utils/interceptAjax')
let HttpRequest = new httpre(app)
//var route = require("./route_dynamic.js")
//var route = require("./route_static.js")

var route = null
//require.ensure(['./route_dynamic_induction.js'], function(e) {
route = require('./route_static_new.js')
//route = require("./route_static.js")
//route = require('./route_dynamic_induction.js')
// console.log(route, 'dsdsdsd')
route.config = {
  taskdetail: 'taskdetail/taskId/type',
  newtaskdetail: 'newtaskdetail/taskId',
  createcomponent: 'createcomponent/type/componentid',
  createproject: 'createproject/type/projectid',
  createproone: 'createproone/type/projectid/status',
  createbackflowpro1: 'createbackflowpro1/type/projectid/status',
  createbackflowpro2: 'createbackflowpro2/type/projectid/status',
  createbackflowpro3: 'createbackflowpro3/type/projectid/status',
  createbackflowpro4: 'createbackflowpro4/type/projectid/status',
  createprotwo: 'createprotwo/type/projectid/status',
  createprothree: 'createprothree/type/projectid/status',
  createprofour: 'createprofour/type/projectid/status',
  // 创建C端审核项目
  createauditproc1: 'createauditproc1/type/projectid/status',
  createauditproc2: 'createauditproc2/type/projectid/status',
  createauditproc3: 'createauditproc3/type/projectid/status',
  // 创建C端审核任务
  createaudittaskc1: 'createaudittaskc1/type/taskid/projectid/status',
  createaudittaskc2: 'createaudittaskc2/type/taskid/projectid/status',
  createaudittaskc3: 'createaudittaskc3/type/taskid/projectid/status',

  createauditpro1: 'createauditpro1/type/projectid/status',
  createauditpro2: 'createauditpro2/type/projectid/status',
  createauditpro3: 'createauditpro3/type/projectid/status',
  createauditpro4: 'createauditpro4/type/projectid/status',
  createaudittask1: 'createaudittask1/type/taskid/projectid/status',
  createaudittask2: 'createaudittask2/type/taskid/projectid/status',
  createaudittask3: 'createaudittask3/type/taskid/projectid/status',
  createtask: 'createtask/type/taskid/projectid/status',
  createbackflowtask1: 'createbackflowtask1/type/taskid/projectid/status',
  createtask2: 'createtask2/type/taskid/projectid',
  createbackflowtask2: 'createbackflowtask2/type/taskid/projectid/status',
  mark: 'mark/taskId/projectId/type/sid', //人工标注页面
  markpreview: 'markpreview/taskId/projectId/type/status/projectType', //项目创建完成以后的预览页面
  markview: 'markview/taskId/projectId/type/uid/sid/rid/taskType', //标注完成以后的查看页面，暂时基于单序列的
  markaudit: 'markaudit/taskId/projectId/type', //项目审核页面
  markauditview: 'markauditview/taskId/taskInfo/type/uid', //项目审核完成以后的参看页面，基于任务维度，暂时基于单序列的
  markauditprojectview: 'markauditprojectview/projectId/projectInfo/type', //项目审核完成以后的参看页面，基于项目维度，暂时基于单序列的
  markseriesview: 'markseriesview/taskId/type/sid', //查看本批次进入的序列质量，基于序列来讲的，是否基于检查暂时无所谓
  ytjtaskdetail: 'ytjtaskdetail/taskid/taskType',
  ytjtaskstatistical: 'ytjtaskstatistical/sid/taskId/nidusId', // 查阅已提交任务 > 统计结果：sid:序列号 taskId:任务Id nidusId:病灶Id
  seriesdetail: 'seriesdetail/seriesId',
  studydetail: 'studydetail/seriesId/studyId',
  imagedatagl1: 'imagedatagl1/type',
  uploaddata: 'uploaddata/type',
  viewauditres: 'viewauditres/id',
  viewaudittask: 'viewaudittask/id',
  viewaudittaskc: 'viewaudittaskc/id/clientType',
  projectmanage: 'projectmanage/type',
  taskmanage: 'taskmanage/type',
  backflowproject: 'backflowproject/type',
  taggingNeedDetail: 'taggingNeedDetail/type/id',
  filterNeedDetail: 'filterNeedDetail/type/id',
  backflowtask: 'backflowtask/type',
  drapCanvas: 'drapCanvas/taskId/projectId/type/sid', // 超大图标注
  drapCanvasView: 'drapCanvasView/taskId/projectId/type/status/projectType', // 超大图预览
  drapCanvasAudEdit: 'drapCanvasAudEdit/taskId/projectId/type', // 超大图医生审核
  drapCanvasAud: 'drapCanvasAud/taskId/taskInfo/type/uid', // 项目审核完成以后的参看页面，基于任务维度，暂时基于单序列的
  drapCanvasCheck: 'drapCanvasCheck/taskId/projectId/type/uid/sid/rid/taskType', // 查阅
  drapCanvasPro: 'drapCanvasPro/projectId/projectInfo/type',
  doctorAudEdit: 'doctorAudEdit/taskId/projectId/type/uid/sid/rid/taskType', // 科研医生
  downloadpage: 'downloadpage/downloadPath' // 下载页面
}

var url

//app._adap='1'
app.changePage = function (value, value1) {
  ES.selctorDoc('#modal').remove()
  app.parpam = {}
  if (value1) {
    var urlP = route.config[value]
    var str = ''
    //console.log(urlP,value,value1)
    if (urlP) {
      var tempArr = urlP.split('/')
      var str = tempArr[0] + '/'
      for (var i = 1; i < tempArr.length; i++) {
        if (value1[tempArr[i]]) {
          app.parpam[tempArr[i]] = value1[tempArr[i]]
          str += value1[tempArr[i]] + '/'
        }
      }
      str = str.replace(/\/$/, '')
    } else {
      str = value
    }
    window.location.href = location.origin + '#!/' + str
  } else {
    window.location.href = location.origin + '#!/' + value
  }
}
app.returnRequier = function (value) {
  var num = 0
  var deferred = $.Deferred()
  var total = value.length
  for (var i = 0; i < value.length; i++) {
    value[i].done(function () {
      num++
      if (num == total) {
        //console.log('dsdjjk')
        deferred.resolve()
      }
    })
  }
  return deferred
}

function hashRenderPage() {
  var ttt = window.location.hash.split('/')
  if (ttt.length > 2) {
    var canshu
    if (route.config[ttt[1]]) {
      canshu = route.config[ttt[1]].split('/')
      for (var j = 2; j < ttt.length; j++) {
        var key = canshu[j - 1]
        app.parpam[key] = ttt[j]
      }
    }
  }
  app.loading.show()

  if (ttt[1] != 'errorpage' && ttt[1] != 'login' && window.localStorage.accessToken) {
    if (JSON.stringify(app.constmap) == '{}') {
      HttpRequest.POST('/dict/child/query', { value: null }).then((response) => {
        if (!app.apiresult(response)) {
          return
        }
        if (response.data) {
          setSessionStorage("commonData", response.data);
          response.data.map((item) => {
            app.constmap[item.value] = item
          })
          console.log('success constmap....', app.constmap);
        }
      })
    }

    // resource
    if (!app.userResource) {
      HttpRequest.POST('/base/user/resource', {
        id: JSON.parse(window.localStorage.all).userId
      }).then((response) => {
        setSessionStorage("resourceList", response.data.pageResourceList);
        let temp = { 0: [] }
        response.data.pageResourceList.forEach((item) => {
          if (!temp[item.parentId]) temp[item.parentId] = []
          if (item.parentId == 0) {
            temp[0].push(item)
          } else {
            temp[item.parentId].push(item)
          }
        })
        app.userResource = temp
        // app.menu.renderHtml()
        route.render(ttt[1], app)
      })
    } else {
      route.render(ttt[1], app)
    }
  } else {
    route.render(ttt[1], app)
  }
  if (ttt[1] == 'login' || (ttt[1].lastIndexOf('mark') != -1 && ttt[1] != 'markdataexport') || ttt[1].lastIndexOf('drap') != -1) {
    app.header.hide()
    ES.selctorDoc('#content').css({
      marginTop: 'unset'
    })
    // app.footer.hide()
  } else {
    app.refreshheader()
    if (app.header) {
      app.header.show()
      ES.selctorDoc('#content').css({
        marginTop: 70
      })
    }
  }
  /*if (app.header) {
      app.header.controlMenu()
  }*/
}

//$(window).on('hashchange', function() {
ES.selctorDoc(window).hashchange(function (e) {
  if (!app.local.get('accessToken')) {
    if (e.newURL.includes('login')) {
      return hashRenderPage()
    } else {
      return (window.location.hash = '#!/login')
    }
  }
  hashRenderPage()
})
if (!window.location.hash || window.location.hash.length < 3) {
  app.changePage(app.main)
} else {
  hashRenderPage()
}
