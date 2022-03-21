var pageBase = require('./base/pagebase.js')

var appClass
var base
var pagesId
var route = {
  config: null,
  render: function (pages, app) {
    appClass = app
    var a
    var api
    var html
    pagesId = pages + '-content-fade'
    extendBase()
  }
}

function extendBase() {
  //function extendBase(className, api, html) {
  if (base) {
    base.dispose()
  }
  var className = require("./pages/" + pagesId.replace('-content-fade', '') + ".js");
  var api = require('./api/' + pagesId.replace('-content-fade', '') + '.api.js')
  var html = require('../pages/' + pagesId.replace('-content-fade', '') + '.html')
  base = new pageBase()
  className.call(base)
  appClass.resize = className.resize
  if (api) {
    api.app = appClass
  }
  appClass.loading.hide()
  //if (!document.getElementById("right-content").innerHTML) {
  document.getElementById("right-content").innerHTML = '<div id="' + pagesId + '">' + html + '</div>'
  base.init(appClass, api, ES.selctorDoc('#right-content').firstchildren('div'))
  /*} else {
      if (pagesId != ES.selctorDoc('#right-content').firstchildren('div').attr('id')) {
          ES.selctorDoc('#right-content').append('<div style="display:none" id="' + pagesId + '">' + html + '</div>')
          $('#right-content').children('div').eq(0).stop().fadeOut(300, function() {
              $(this).remove()
          })
          $('#right-content').children('#' + pagesId).stop().fadeIn(300, function() {

          })
          base.init(appClass, api, $('#right-content').children('#' + pagesId))
      } else {
          document.getElementById("right-content").innerHTML = '<div style="display:none" id="' + pagesId + '">' + html + '</div>'
          $('#right-content').children('div').eq(0).stop().fadeIn()
          base.init(appClass, api, $('#right-content').children('div'))

      }
  }*/
  //document.getElementById("right-content").innerHTML = ''
  //document.getElementById("right-content").innerHTML = data


}
module.exports = route;