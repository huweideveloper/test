//var pageBase = require('./base/pagebase.js')
import { MessageBox } from 'element-ui'

const SYS_NOTICE_VERSION = 'sysNoticeVersion' // 系统公告是否关闭过

let appClass
let base
let pagesId
let pageName
var route = {
  config: null,
  render: function(_pages, app) {
    const pages = _pages.split("?")[0];
    appClass = app
    pageName = pages
    pagesId = pages + '-content-fade'
    let template = require('./viewsMiddleware/template.html');
    switch (pages) {
      // 
      //新标注项目详情（新建、编辑、查看）
      case 'labelProjectDetail':
        require.ensure(['./viewsMiddleware/labelModule/labelProjectDetail.js'], function(data) {
          let className = require('./viewsMiddleware/labelModule/labelProjectDetail.js')
          let model = function(){}
          extendBase(className, {}, template, model);
        })
        break

      //新标注项目
      case 'labelProject':
        require.ensure(['./viewsMiddleware/labelModule/labelProject.js'], function(data) {
          let className = require('./viewsMiddleware/labelModule/labelProject.js')
          let model = function(){}
          extendBase(className, {}, template, model);
        })
        break
       //新标注任务
      case 'labelTask':
        require.ensure(['./viewsMiddleware/labelModule/labelTask.js'], function(data) {
          let className = require('./viewsMiddleware/labelModule/labelTask.js')
          let model = function(){}
          extendBase(className, {}, template, model);
        })
        break



      case 'configManage':
        require.ensure(['./pages/configManage/configManage.js'], function(data) {
          require('./pages/configManage/configManage.less')
          let className = require('./pages/configManage/configManage.js')
          let html = require('./pages/configManage/configManage.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'group':
        require.ensure(['./pages/group/group.js'], function(data) {
          require('./pages/group/group.less')
          let className = require('./pages/group/group.js')
          let html = require('./pages/group/group.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'ethic':
        require.ensure(['./pages/ethic/ethic.js'], function(data) {
          require('./pages/ethic/ethic.less')
          let className = require('./pages/ethic/ethic.js')
          let html = require('./pages/ethic/ethic.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'label':
        require.ensure(['./pages/label/label.js'], function(data) {
          require('./pages/label/label.less')
          let className = require('./pages/label/label.js')
          let html = require('./pages/label/label.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'userStat':
        require.ensure(['./pages/userStat/userStat.js'], function(data) {
          require('./pages/userStat/userStat.less')
          let className = require('./pages/userStat/userStat.js')
          let html = require('./pages/userStat/userStat.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'intoGroup':
        require.ensure(['./pages/intoGroup/intoGroup.js'], function(data) {
          require('./pages/intoGroup/intoGroup.less')
          let className = require('./pages/intoGroup/intoGroup.js')
          let html = require('./pages/intoGroup/intoGroup.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'store':
        require.ensure(['./pages/store/store.js'], function(data) {
          require('./pages/store/store.less')
          let className = require('./pages/store/store.js')
          let html = require('./pages/store/store.html')
          let model = function(){}
          extendBase(className, {}, html, model);
        })
        break
      case 'register':
        require.ensure(['./pages/register.js'], function(data) {
          require('./less/register.less')
          let a = require('./pages/register.js')
          let api = require('./api/register.api.js')
          let html = require('../pages/register.html')
          let model = require('./pagesmodel/register.js')
          extendBase(a, api, html, model)
        })
        break
      case 'taskmanage':
        require.ensure(['./pages/taskmanage.js'], function(data) {
          require('./less/taskmanage.less')
          require('./pages/base/data_base')
          let a = require('./pages/taskmanage.js')
          let api = require('./api/taskmanage.api.js')
          let html = require('../pages/taskmanage.html')
          let model = require('./pagesmodel/taskmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'alltasklist':
        require.ensure(['./pages/alltasklist.js'], function(data) {
          require('./less/alltasklist.less')
          let a = require('./pages/alltasklist.js')
          let api = require('./api/alltasklist.api.js')
          let html = require('../pages/alltasklist.html')
          let model = require('./pagesmodel/alltasklist.js')
          extendBase(a, api, html, model)
        })
        break
      case 'taskdetail':
        require.ensure(['./pages/taskdetail.js'], function(data) {
          require('./less/taskdetail.less')
          let a = require('./pages/taskdetail.js')
          let api = require('./api/taskdetail.api.js')
          let html = require('../pages/taskdetail.html')
          let model = require('./pagesmodel/taskdetail.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createtask':
        require.ensure(['./pages/createtask.js'], function(data) {
          require('./less/createtask.less')
          let a = require('./pages/createtask.js')
          let api = require('./api/createtask.api.js')
          let html = require('../pages/createtask.html')
          let model = require('./pagesmodel/createtask.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createbackflowtask1':
        require.ensure(['./pages/createtask.js'], function(data) {
          require('./less/createtask.less')
          let a = require('./pages/createtask.js')
          let api = require('./api/createtask.api.js')
          let html = require('../pages/createtask.html')
          let model = require('./pagesmodel/createtask.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createtask2':
        require.ensure(['./pages/createtask2.js'], function(data) {
          require('./less/createtask2.less')
          let a = require('./pages/createtask2.js')
          let api = require('./api/createtask2.api.js')
          let html = require('../pages/createtask2.html')
          let model = require('./pagesmodel/createtask2.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createbackflowtask2':
        require.ensure(['./pages/createbackflowtask2.js'], function(data) {
          require('./less/createtask2.less')
          let a = require('./pages/createbackflowtask2.js')
          let api = require('./api/createbackflowtask2.api.js')
          let html = require('../pages/createbackflowtask2.html')
          let model = require('./pagesmodel/createtask2.js')
          extendBase(a, api, html, model)
        })
        break
      case 'mark':
        require.ensure(['./pages/base/mark_base.js'], function(data) {
          require('./less/mark.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/mark.js')
          let api = require('./api/mark.api.js')
          let html = require('../pages/mark.html')
          let model = require('./pagesmodel/mark.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markpreview':
        require.ensure(['./pages/base/mark_base.js'], function(data) {
          require('./less/markpreview.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markpreview.js')
          let api = require('./api/markpreview.api.js')
          let html = require('../pages/mark.html')
          let model = require('./pagesmodel/mark.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markview':
        require.ensure(['./pages/base/mark_base.js'], function(data) {
          require('./less/markview.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markview.js')
          let api = require('./api/markview.api.js')
          let html = require('../pages/markview.html')
          let model = require('./pagesmodel/markview.js')
          extendBase(a, api, html, model)
        })
        break
      case 'accountmanage':
        require.ensure(['./pages/accountmanage.js'], function(data) {
          require('./less/accountmanage.less')
          require('./pages/base/data_base')
          let a = require('./pages/accountmanage.js')
          let api = require('./api/accountmanage.api.js')
          let html = require('../pages/accountmanage.html')
          let model = require('./pagesmodel/accountmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'login':
        require.ensure(['./pages/login.js'], function(data) {
          let html
          if (process.env.APP_ENV === 'jys') {
            html = require('../pages/jyslogin.html')
            require('./less/jyslogin.less')
          } else {
            html = require('../pages/login.html')
            require('./less/login.less')
          }
          let a = require('./pages/login.js')
          let api = require('./api/login.api.js')
          let model = require('./pagesmodel/login.js')
          extendBase(a, api, html, model)
        })
        break
      case 'personalaccount':
        require.ensure(['./pages/personalaccount/index.js'], function(data) {
          let a = require('./pages/personalaccount/index.js')
          let api = require('./pages/personalaccount/api.js')
          let html = require('./pages/personalaccount/index.html')
          extendBase(a, api, html)
        })
        // require.ensure(["./pages/personalaccount.js"], function(data) {
        //   require("./less/personalaccount.less")
        //   let a = require("./pages/personalaccount.js")
        //   let api = require("./api/personalaccount.api.js")
        //   let html = require("../pages/personalaccount.html")
        //   let model = require("./pagesmodel/personalaccount.js")
        //   extendBase(a, api, html, model)
        // })
        break
      case 'downloadpage':
        require.ensure(['./pages/download-page/index.js'], function(data) {
          let a = require('./pages/download-page/index.js')
          // let api = require('./pages/download-page/api.js')
          let html = require('./pages/download-page/index.html')
          extendBase(a, {}, html)
        })
        break
      case 'ytjtaskdetail':
        require.ensure(['./pages/ytjtaskdetail.js'], function(data) {
          require('./less/ytjtaskdetail.less')
          let a = require('./pages/ytjtaskdetail.js')
          let api = require('./api/ytjtaskdetail.api.js')
          let html = require('../pages/ytjtaskdetail.html')
          let model = require('./pagesmodel/ytjtaskdetail.js')
          extendBase(a, api, html, model)
        })
        break
      case 'ytjtaskstatistical':
        require.ensure(['./pages/taskmanage/ytjtaskstatistical/index.js'], function(data) {
          let a = require('./pages/taskmanage/ytjtaskstatistical/index.js')
          let api = require('./pages/taskmanage/api.js')
          let html = require('./pages/taskmanage/ytjtaskstatistical/index.html')
          extendBase(a, api, html)
        })
        break
      case 'projectmanage':
        require.ensure(['./pages/projectmanage.js'], function(data) {
          require('./less/projectmanage.less')
          require('./pages/base/data_base')
          let a = require('./pages/projectmanage.js')
          let api = require('./api/projectmanage.api.js')
          let html = require('../pages/projectmanage.html')
          let model = require('./pagesmodel/projectmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'componentmanage':
        require.ensure(['./pages/componentmanage.js'], function(data) {
          require('./less/componentmanage.less')
          let a = require('./pages/componentmanage.js')
          let api = require('./api/componentmanage.api.js')
          let html = require('../pages/componentmanage.html')
          let model = require('./pagesmodel/componentmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createcomponent':
        require.ensure(['./pages/createcomponent.js'], function(data) {
          require('./less/createcomponent.less')
          let a = require('./pages/createcomponent.js')
          let api = require('./api/createcomponent.api.js')
          let html = require('../pages/createcomponent.html')
          let model = require('./pagesmodel/createcomponent.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markdataexport':
        require.ensure(['./pages/markdataexport.js'], function(data) {
          require('./less/markdataexport.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/markdataexport.js')
          let api = require('./api/markdataexport.api.js')
          let model = require('./pagesmodel/markdataexport.js')
          let html = require('../pages/markdataexport.html')
          extendBase(a, api, html, model)
        })
        break
      case 'algdataExport':
        require.ensure(['./pages/markdataexport.js'], function(data) {
          require('./less/markdataexport.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/markdataexport.js')
          let api = require('./api/markdataexport.api.js')
          let model = require('./pagesmodel/markdataexport.js')
          let html = require('../pages/markdataexport.html')
          extendBase(a, api, html, model)
        })
        break
      case 'rolemanage':
        require.ensure(['./pages/rolemanage.js'], function(data) {
          require('./less/rolemanage.less')
          let a = require('./pages/rolemanage.js')
          let api = require('./api/rolemanage.api.js')
          let html = require('../pages/rolemanage.html')
          let model = require('./pagesmodel/rolemanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'newtaskdetail':
        require.ensure(['./pages/newtaskdetail.js'], function(data) {
          require('./less/newtaskdetail.less')
          let a = require('./pages/newtaskdetail.js')
          let api = require('./api/newtaskdetail.api.js')
          let html = require('../pages/newtaskdetail.html')
          extendBase(a, api, html)
        })
        break
      case 'createproone':
        require.ensure(['./pages/createpro/step1/index.js'], function(data) {
          let a = require('./pages/createpro/step1/index.js')
          let api = require('./pages/createpro/api.js')
          let html = require('./pages/createpro/step1/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createbackflowpro1':
        require.ensure(['./pages/createpro/step1/index.js'], function(data) {
          let a = require('./pages/createpro/step1/index.js')
          let api = require('./pages/createpro/api.js')
          let html = require('./pages/createpro/step1/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createprotwo':
        require.ensure(['./pages/createprotwo.js'], function(data) {
          require('./less/createprotwo.less')
          let a = require('./pages/createprotwo.js')
          let api = require('./api/createprotwo.api.js')
          let html = require('../pages/createprotwo.html')
          let model = require('./pagesmodel/createprotwo.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createbackflowpro2':
        require.ensure(['./pages/createprotwo.js'], function(data) {
          require('./less/createprotwo.less')
          let a = require('./pages/createprotwo.js')
          let api = require('./api/createprotwo.api.js')
          let html = require('../pages/createprotwo.html')
          let model = require('./pagesmodel/createprotwo.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createprothree':
        require.ensure(['./pages/createprothree.js'], function(data) {
          require('./less/createprothree.less')
          let a = require('./pages/createprothree.js')
          let api = require('./api/createprothree.api.js')
          let html = require('../pages/createprothree.html')
          let model = require('./pagesmodel/createprothree.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createprofour':
        require.ensure(['./pages/createprofour.js'], function(data) {
          require('./less/createprothree.less')
          let a = require('./pages/createprofour.js')
          let api = require('./api/createprothree.api.js')
          let html = require('../pages/createprofour.html')
          let model = require('./pagesmodel/createprothree.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createbackflowpro3':
        require.ensure(['./pages/createprothree.js'], function(data) {
          require('./less/createprothree.less')
          let a = require('./pages/createprothree.js')
          let api = require('./api/createprothree.api.js')
          let html = require('../pages/createprothree.html')
          let model = require('./pagesmodel/createprothree.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createbackflowpro4':
        require.ensure(['./pages/createbackflowpro4.js'], function(data) {
          require('./less/createprothree.less')
          let a = require('./pages/createbackflowpro4.js')
          let api = require('./api/createprothree.api.js')
          let html = require('../pages/createprofour.html')
          let model = require('./pagesmodel/createprothree.js')
          extendBase(a, api, html, model)
        })
        break
      case 'dataconfig':
        require.ensure(['./pages/dataconfig.js'], function(data) {
          require('./less/dataconfig.less')
          let a = require('./pages/dataconfig.js')
          let api = require('./api/dataconfig.api.js')
          let html = require('../pages/dataconfig.html')
          let model = require('./pagesmodel/dataconfig.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markseriesview':
        require.ensure(['./pages/markseriesview.js'], function(data) {
          require('./less/markseriesview.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markseriesview.js')
          let api = require('./api/markseriesview.api.js')
          let html = require('../pages/markseriesview.html')
          let model = require('./pagesmodel/markseriesview.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markaudit':
        require.ensure(['./pages/markaudit.js'], function(data) {
          require('./less/markaudit.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markaudit.js')
          let api = require('./api/markaudit.api.js')
          let html = require('../pages/markaudit.html')
          let model = require('./pagesmodel/markaudit.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markauditview':
        require.ensure(['./pages/markauditview.js'], function(data) {
          require('./less/markauditview.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markauditview.js')
          let api = require('./api/markauditview.api.js')
          let html = require('../pages/markauditview.html')
          let model = require('./pagesmodel/markaudit.js')
          extendBase(a, api, html, model)
        })
        break
      case 'markauditprojectview':
        require.ensure(['./pages/markauditprojectview.js'], function(data) {
          require('./less/markauditprojectview.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let a = require('./pages/markauditprojectview.js')
          let api = require('./api/markauditprojectview.api.js')
          let html = require('../pages/markauditprojectview.html')
          let model = require('./pagesmodel/markaudit.js')
          extendBase(a, api, html, model)
        })
        break
      case 'audittask':
      case 'audittaskc':
        require.ensure(['./pages/audittask/list/index.js'], function() {
          let a = require('./pages/audittask/list/index.js')
          let api = require('./pages/audittask/api.js')
          let html = require('./pages/audittask/list/index.html')
          extendBase(a, api, html)
        })
        break
      case 'auditproject':
      case 'auditprojectc':
        require.ensure(['./pages/auditpro/list/index.js'], function() {
          let a = require('./pages/auditpro/list/index.js')
          let api = require('./pages/auditpro/api.js')
          let html = require('./pages/auditpro/list/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createauditproc1':
        require.ensure(['./pages/auditpro/step1/index.js'], function(data) {
          let a = require('./pages/auditpro/step1/index.js')
          let api = require('./pages/auditpro/api.js')
          let html = require('./pages/auditpro/step1/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createauditproc2':
        require.ensure(['./pages/auditpro/step2/index.js'], function(data) {
          let a = require('./pages/auditpro/step2/index.js')
          let api = require('./pages/auditpro/api.js')
          let html = require('./pages/auditpro/step2/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createauditproc3':
        require.ensure(['./pages/auditpro/step3/index.js'], function(data) {
          let a = require('./pages/auditpro/step3/index.js')
          let api = require('./pages/auditpro/api.js')
          let html = require('./pages/auditpro/step3/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createaudittaskc1':
        require.ensure(['./pages/audittask/step1/index.js'], function() {
          let a = require('./pages/audittask/step1/index.js')
          let api = require('./pages/audittask/api.js')
          let html = require('./pages/audittask/step1/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createaudittaskc2':
        require.ensure(['./pages/audittask/step2/index.js'], function() {
          let a = require('./pages/audittask/step2/index.js')
          let api = require('./pages/audittask/api.js')
          let html = require('./pages/audittask/step2/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createaudittaskc3':
        require.ensure(['./pages/audittask/step3/index.js'], function() {
          let a = require('./pages/audittask/step3/index.js')
          let api = require('./pages/audittask/api.js')
          let html = require('./pages/audittask/step3/index.html')
          extendBase(a, api, html)
        })
        break
      case 'createauditpro1':
        require.ensure(['./pages/createauditpro1.js'], function(data) {
          require('./less/createauditpro1.less')
          let a = require('./pages/createauditpro1.js')
          let api = require('./api/createauditpro1.api.js')
          let html = require('../pages/createauditpro1.html')
          let model = require('./pagesmodel/createauditpro1.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createauditpro2':
        require.ensure(['./pages/createauditpro2.js'], function(data) {
          require('./less/createauditpro2.less')
          let a = require('./pages/createauditpro2.js')
          let api = require('./api/createauditpro2.api.js')
          let html = require('../pages/createauditpro2.html')
          let model = require('./pagesmodel/createauditpro2.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createauditpro3':
        require.ensure(['./pages/createauditpro3.js'], function(data) {
          require('./less/createauditpro3.less')
          let a = require('./pages/createauditpro3.js')
          let api = require('./api/createauditpro3.api.js')
          let html = require('../pages/createauditpro3.html')
          let model = require('./pagesmodel/createauditpro3.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createauditpro4':
        require.ensure(['./pages/createauditpro4.js'], function(data) {
          require('./less/createprothree.less')
          let a = require('./pages/createauditpro4.js')
          let api = require('./api/createprothree.api.js')
          let html = require('../pages/createprofour.html')
          let model = require('./pagesmodel/createprothree.js')
          extendBase(a, api, html, model)
        })
        break
      case 'viewauditres':
        require.ensure(['./pages/viewauditres.js'], function(data) {
          require('./less/viewauditres.less')
          let a = require('./pages/viewauditres.js')
          let api = require('./api/viewauditres.api.js')
          let html = require('../pages/viewauditres.html')
          let model = require('./pagesmodel/viewauditres.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createaudittask1':
        require.ensure(['./pages/createaudittask1.js'], function(data) {
          require('./less/createaudittask1.less')
          let a = require('./pages/createaudittask1.js')
          let api = require('./api/createaudittask1.api.js')
          let html = require('../pages/createaudittask1.html')
          let model = require('./pagesmodel/createaudittask1.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createaudittask2':
        require.ensure(['./pages/createaudittask2.js'], function(data) {
          require('./less/createaudittask2.less')
          let a = require('./pages/createaudittask2.js')
          let api = require('./api/createaudittask2.api.js')
          let html = require('../pages/createaudittask2.html')
          let model = require('./pagesmodel/createaudittask2.js')
          extendBase(a, api, html, model)
        })
        break
      case 'createaudittask3':
        require.ensure(['./pages/createaudittask3.js'], function(data) {
          require('./less/createaudittask3.less')
          let a = require('./pages/createaudittask3.js')
          let api = require('./api/createaudittask3.api.js')
          let html = require('../pages/createaudittask3.html')
          let model = require('./pagesmodel/createaudittask3.js')
          extendBase(a, api, html, model)
        })
        break
      case 'releasetask':
        require.ensure(['./pages/releasetask.js'], function(data) {
          require('./less/releasetask.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/releasetask.js')
          let api = require('./api/releasetask.api.js')
          let html = require('../pages/releasetask.html')
          let model = require('./pagesmodel/releasetask.js')
          extendBase(a, api, html, model)
        })
        break
      case 'audittaskexport':
        require.ensure(['./pages/audittaskexport.js'], function(data) {
          require('./less/audittaskexport.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/audittaskexport.js')
          let api = require('./api/audittaskexport.api.js')
          let html = require('../pages/audittaskexport.html')
          let model = require('./pagesmodel/audittaskexport.js')
          extendBase(a, api, html, model)
        })
        break
      case 'projectexport':
        require.ensure(['./pages/projectexport.js'], function(data) {
          require('./less/projectexport.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/projectexport.js')
          let api = require('./api/projectexport.api.js')
          let html = require('../pages/projectexport.html')
          let model = require('./pagesmodel/projectexport.js')
          extendBase(a, api, html, model)
        })
        break
      case 'backflowproject':
        require.ensure(['./pages/projectmanage.js'], function(data) {
          require('./less/projectmanage.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/projectmanage.js')
          let api = require('./api/projectmanage.api.js')
          let html = require('../pages/projectmanage.html')
          let model = require('./pagesmodel/projectmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'backflowtask':
        require.ensure(['./pages/taskmanage.js'], function(data) {
          require('./less/taskmanage.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/taskmanage.js')
          let api = require('./api/taskmanage.api.js')
          let html = require('../pages/taskmanage.html')
          let model = require('./pagesmodel/taskmanage.js')
          extendBase(a, api, html, model)
        })
        break
      case 'taggingNeed':
        require.ensure(['./pages/taggingNeed.js'], function(data) {
          require('./less/taggingNeed.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/taggingNeed.js')
          let api = require('./api/taggingNeed.api.js')
          let html = require('../pages/taggingNeed.html')
          let model = require('./pagesmodel/taggingNeed.js')
          extendBase(a, api, html, model)
        })
        break
      case 'taggingNeedDetail':
        require.ensure(['./pages/taggingNeedDetail.js'], function(data) {
          require('./less/taggingNeedDetail.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/taggingNeedDetail.js')
          let api = require('./api/taggingNeedDetail.api.js')
          let html = require('../pages/taggingNeedDetail.html')
          let model = require('./pagesmodel/taggingNeedDetail.js')
          extendBase(a, api, html, model)
        })
        break
      case 'filterNeed':
        require.ensure(['./pages/filterNeed.js'], function(data) {
          require('./less/filterNeed.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/filterNeed.js')
          let api = require('./api/filterNeed.api.js')
          let html = require('../pages/filterNeed.html')
          let model = require('./pagesmodel/filterNeed.js')
          extendBase(a, api, html, model)
        })
        break
      case 'filterNeedDetail':
        require.ensure(['./pages/filterNeedDetail.js'], function(data) {
          require('./less/filterNeedDetail.less')
          require('./pages/base/data_base.js')
          let a = require('./pages/filterNeedDetail.js')
          let api = require('./api/filterNeedDetail.api.js')
          let html = require('../pages/filterNeedDetail.html')
          let model = require('./pagesmodel/filterNeedDetail.js')
          extendBase(a, api, html, model)
        })
        break
      case 'taskQuery':
        require.ensure(['./pages/system-operation/task-query/index.js'], function(data) {
          const a = require('./pages/system-operation/task-query/index.js')
          const api = require('./pages/system-operation/task-query/api.js')
          const html = require('./pages/system-operation/task-query/index.html')
          extendBase(a, api, html)
        })
        break
      case 'pathologySettlementTrial':
        require.ensure(['./pages/system-operation/pathology-settlement-trial/index.js'], function(data) {
          const a = require('./pages/system-operation/pathology-settlement-trial/index.js')
          const api = require('./pages/system-operation/pathology-settlement-trial/api.js')
          const html = require('./pages/system-operation/pathology-settlement-trial/index.html')
          extendBase(a, api, html)
        })
        break
      case 'viewaudittask':
        require.ensure(['./pages/viewaudittask.js'], function(data) {
          require('./less/viewaudittask.less')
          let a = require('./pages/viewaudittask.js')
          let api = require('./api/viewaudittask.api.js')
          let html = require('../pages/viewaudittask.html')
          let model = require('./pagesmodel/viewaudittask.js')
          extendBase(a, api, html, model)
        })
        break
      case 'viewaudittaskc':
        require.ensure(['./pages/audittask/view/index.js'], function(data) {
          require('./pages/audittask/view/index.less')
          let a = require('./pages/audittask/view/index.js')
          let api = require('./pages/audittask/api.js')
          let html = require('./pages/audittask/view/index.html')
          extendBase(a, api, html)
        })
        break
      case 'errorpage':
        require.ensure(['./pages/errorpage.js'], (data) => {
          require('./less/errorpage.less')
          let a = require('./pages/errorpage.js')
          let api = {}
          let html = require('../pages/errorpage.html')
          let model = class createaudittask2 extends Interstellar.modelBase { }
          extendBase(a, api, html, model)
        })
        break
      case 'drapCanvas':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvas.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvas.js')
          let a = require('./pages/drapCanvas.js')
          let html = require('../pages/drapCanvas.html')
          let model = require('./pagesmodel/drapCanvas.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'drapCanvasView':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvasView.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvasView.js')
          let a = require('./pages/drapCanvasView.js')
          let html = require('../pages/drapCanvasView.html')
          let model = require('./pagesmodel/drapCanvas.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'drapCanvasAud':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvasAud.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvasAud.js')
          let a = require('./pages/drapCanvasAud.js')
          let html = require('../pages/drapCanvasAud.html')
          let model = require('./pagesmodel/drapCanvasAudEdit.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'drapCanvasAudEdit':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvasAudEdit.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvasAudEdit.js')
          let a = require('./pages/drapCanvasAudEdit.js')
          let html = require('../pages/drapCanvasAudEdit.html')
          let model = require('./pagesmodel/drapCanvasAudEdit.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'drapCanvasCheck':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvasCheck.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvasCheck.js')
          let a = require('./pages/drapCanvasCheck.js')
          let html = require('../pages/drapCanvasCheck.html')
          let model = require('./pagesmodel/drapCanvasCheck.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'drapCanvasPro':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/drapCanvasPro.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/drapCanvasPro.js')
          let a = require('./pages/drapCanvasPro.js')
          let html = require('../pages/drapCanvasPro.html')
          let model = require('./pagesmodel/drapCanvasAudEdit.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'doctorAudEdit':
        require.ensure(['./pages/base/mark_base.js'], (data) => {
          require('./less/doctorAudEdit.less')
          require('./pages/base/mark_base.js')
          require('./pagesmodel/base/mark_base.js')
          let api = require('./api/doctorAudEdit.js')
          let a = require('./pages/doctorAudEdit.js')
          let html = require('../pages/doctorAudEdit.html')
          let model = require('./pagesmodel/mark.js')
          extendBase(a, api, html, model, 1)
        })
        break
      case 'permission':
        require.ensure(['./pages/permission.js'], function(data) {
          require('./less/permission.less')
          let a = require('./pages/permission.js')
          let api = require('./api/permission.api.js')
          let html = require('../pages/permission.html')
          let model = require('./pagesmodel/permission.js')
          extendBase(a, api, html, model)
        })
        break
      case 'projectgroup':
        require.ensure(['./pages/projectgroup/index.js'], function() {
          let a = require('./pages/projectgroup/index.js')
          let api = require('./pages/projectgroup/api.js')
          let html = require('./pages/projectgroup/index.html')
          extendBase(a, api, html)
        })
        break
      case 'nidusstatistics':
        require.ensure(['./pages/nidusstatistics/index.js'], function() {
          let a = require('./pages/nidusstatistics/index.js')
          let api = require('./pages/nidusstatistics/api.js')
          let html = require('./pages/nidusstatistics/index.html')
          extendBase(a, api, html)
        })
        break
      case 'settlementstatics':
        require.ensure(['./pages/settlementstatics/index.js']).then(main => {
          const api = require('./pages/settlementstatics/api.js')
          const html = require('./pages/settlementstatics/index.html')
          extendBase(main, api, html)
        })
        break
      case 'pathologystatistics':
        require.ensure(['./pages/pathologystatistics/index.js']).then(main => {
          const api = require('./pages/pathologystatistics/api.js')
          const html = require('./pages/pathologystatistics/index.html')
          extendBase(main, api, html)
        })
        break
      case 'documentupload':
        require.ensure(['./pages/documentupload/index.js']).then(main => {
          const api = require('./pages/documentupload/api.js')
          const html = require('./pages/documentupload/index.html')
          extendBase(main, api, html)
        })
        break
      case 'settlementconfig':
        require.ensure(['./pages/settlementconfig/index.js']).then(main => {
          const api = require('./pages/settlementconfig/api.js')
          const html = require('./pages/settlementconfig/index.html')
          extendBase(main, api, html)
        })
        break
    }
  }
}

// a, api, html, model
function extendBase(className, api, html, model) {
  appClass.menu.refreshmenu()
  if (base && base.dispose) {
    base.dispose()
    if (base.model && base.model.clear) {
      base.model.clear()
    }
  }
  var className = className
  var api = api
  var html = html
  api.app = appClass
  let HttpRequest = require('./utils/interceptAjax')
  api.HttpRequest = new HttpRequest()
  api.HttpRequest.app = appClass
  appClass.loading.hide()
  animation.clearTimeObj()
  if (typeof className.prototype.complete === 'function') {
    newClassExtent(appClass, api, className, html, model)
  }
  if (appClass.languageMode) {
    appClass.languageMode.setTranslate(ES.selctorDoc('#right-content #' + pagesId).find('[data-i18n]').dom, appClass.language, pagesId.replace('-content-fade', ''))
  }
}

//新的加载方式
function newClassExtent(appClass, api, className, html, model) {
  appClass.pagerclass = null
  if (!document.getElementById('right-content').innerHTML) {
    document.getElementById('right-content').innerHTML = '<div id="' + pagesId + '">' + html + '</div>'
  } else {
    if (pagesId != ES.selctorDoc('#right-content').firstchildren('div').attr('id')) {
      ES.selctorDoc('#right-content').append('<div style="display:none" id="' + pagesId + '">' + html + '</div>')
      var tempDom = ES.selctorDoc('#right-content').firstchildren('div')
      tempDom.remove()
      animation.fadeIn(ES.selctorDoc('#right-content #' + pagesId))
    } else {
      document.getElementById('right-content').innerHTML = '<div style="display:none" id="' + pagesId + '">' + html + '</div>'
      animation.fadeIn(ES.selctorDoc('#right-content').firstchildren('div'))
    }
  }
  let tempM = null
  if (model) {
    tempM = new model(appClass)
  }
  base = new className(appClass, api, ES.selctorDoc('#content #right-content').find('#' + pagesId), tempM)
  appClass.pagerclass = base

  handleSysNoticeVisible()
}

// 处理系统公告展示与否
function handleSysNoticeVisible() {
  setTimeout(() => {
    const sysNotice = appClass.constmap.SYS_NOTICE
    if (!sysNotice) return
    const { remark } = sysNotice.children[0] || {}
    const { version, content } = JSON.parse(remark)
    if (!version || !content || appClass.local.get(SYS_NOTICE_VERSION) === version) return
    MessageBox.alert(content, '系统公告', {
      callback: action => {
        appClass.local.set(SYS_NOTICE_VERSION, version)
      }
    })
  }, 20)
}

module.exports = route
