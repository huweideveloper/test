var pageBase = require("./base/pagebase.js")

var appClass
var base
var pagesId
var route = {
  config: null,
  render: function(pages, app) {
    appClass = app
    var a
    var api
    var html
    //var def=$.
    pagesId = pages + "-content-fade"
    //extendBase()

    switch (pages) {
      case "template":
        require.ensure(["./pages/template.js"], function(data) {
          var a = require("./pages/template.js")
          var api = require("./api/index1.api.js")
          html = require("../pages/template.html")
          extendBase(a, api, html)
        })
        break
      case "induction":
        require.ensure(["./pages/induction.js"], function(data) {
          var a = require("./pages/induction.js")
          var api = require("./api/induction.api.js")
          html = require("../pages/induction.html")
          extendBase(a, api, html)
        })
        break
    }
  }
}

function extendBase(className, api, html) {
  //var className = require("./pages/" + pagesId.replace('-content-fade', '') + ".js");
  //var api = require('./api/' + pagesId.replace('-content-fade', '') + '.api.js')
  //var html = require('../pages/' + pagesId.replace('-content-fade', '') + '.html')
  if (base) {
    base.dispose()
  }
  base = new pageBase()
  //className.call(base)
  if (api) {
    api.app = appClass
  }

  className.done(function(value) {
    value.call(base)
    appClass.resize = base.resize
    appClass.loading.hide()
    if (!document.getElementById("right-content").innerHTML) {
      document.getElementById("right-content").innerHTML =
        '<div id="' + pagesId + '">' + html + "</div>"
      base.init(appClass, api, $("#right-content").children("div"))
    } else {
      if (
        $("#right-content").children("div").length == 1 &&
        pagesId !=
          $("#right-content")
            .children("div")
            .attr("id")
      ) {
        $("#right-content").append(
          '<div style="display:none" id="' + pagesId + '">' + html + "</div>"
        )
        $("#right-content")
          .children("div")
          .eq(0)
          .stop()
          .fadeOut(300, function() {
            $(this).remove()
          })
        $("#right-content")
          .children("#" + pagesId)
          .stop()
          .fadeIn(300, function() {})
        base.init(appClass, api, $("#right-content").children("#" + pagesId))
      } else {
        document.getElementById("right-content").innerHTML =
          '<div style="display:none" id="' + pagesId + '">' + html + "</div>"
        $("#right-content")
          .children("div")
          .eq(0)
          .stop()
          .fadeIn()
        base.init(appClass, api, $("#right-content").children("div"))
      }
    }
  })
  return

  //console.log(base)
  appClass.loading.hide()
  if (!document.getElementById("right-content").innerHTML) {
    // console.log('inin111');
    document.getElementById("right-content").innerHTML =
      '<div id="' + pagesId + '">' + html + "</div>"
    base.init(appClass, api, $("#right-content").children("div"))
  } else {
    if (
      $("#right-content").children("div").length == 1 &&
      pagesId !=
        $("#right-content")
          .children("div")
          .attr("id")
    ) {
      // console.log('len', $('#right-content').children('div').length)
      $("#right-content").append(
        '<div style="display:none" id="' + pagesId + '">' + html + "</div>"
      )
      $("#right-content")
        .children("div")
        .eq(0)
        .stop()
        .fadeOut(300, function() {
          $(this).remove()
        })
      base.init(appClass, api, $("#right-content").children("#" + pagesId))
      $("#right-content")
        .children("#" + pagesId)
        .stop()
        .fadeIn(300, function() {})
    } else {
      //console.log('ininss');
      document.getElementById("right-content").innerHTML =
        '<div style="display:none" id="' + pagesId + '">' + html + "</div>"
      $("#right-content")
        .children("div")
        .eq(0)
        .stop()
        .fadeIn()
      base.init(appClass, api, $("#right-content").children("div"))
    }
  }
  //document.getElementById("right-content").innerHTML = ''
  //document.getElementById("right-content").innerHTML = data
}
module.exports = route
