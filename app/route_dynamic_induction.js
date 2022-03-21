//var pageBase = require('./base/pagebase.js')

let appClass
let base
let pagesId
var route = {
    config: null,
    render: function(pages, app) {
        appClass = app
        var a
        var api
        var html
        pagesId = pages + '-content-fade'
        extendBase()
    }
}

function extendBase() {
    if (base) {
        base.dispose()
        if (base.model) {
            base.model.clear()
        }
    }
    require("./less/" + pagesId.replace('-content-fade', '') + ".less")
    var className = require("./pages/" + pagesId.replace('-content-fade', '') + ".js");
    var api = require('./api/' + pagesId.replace('-content-fade', '') + '.api.js')
    var html = require('../pages/' + pagesId.replace('-content-fade', '') + '.html')
    let model
    try {
        model = require('../pagesmodel/' + pagesId.replace('-content-fade', '') + '.js')
    } catch (err) {
        console.log(err);
    }
    api.app = appClass
    appClass.loading.hide()
    animation.clearTimeObj()
    if (typeof className.prototype.complete === "function") {
        newClassExtent(appClass, api, className, html, model)
    }
    /*else {
           base = new pageBase()
           if (typeof className === 'function') {
               className.call(base)
               pageDeal(appClass, base, api, html)
           } else {
               className.done(function(value) {
                   value.call(base)
                   pageDeal(appClass, base, api, html)
               })
           }
       }*/
    if (appClass.languageMode) {
        appClass.languageMode.setTranslate(ES.selctorDoc('#right-content #' + pagesId).find('[data-i18n]').dom, appClass.language, pagesId.replace('-content-fade', ''))
    }

    //console.log(ES.selctorDoc('#right-content #' + pagesId).find('[data-i18n]').dom, pagesId)
}
//新的加载方式
function newClassExtent(appClass, api, className, html, model) {
    if (!document.getElementById("right-content").innerHTML) {
        document.getElementById("right-content").innerHTML = '<div id="' + pagesId + '">' + html + '</div>'
    } else {
        if (pagesId != ES.selctorDoc('#right-content').firstchildren('div').attr('id')) {
            ES.selctorDoc('#right-content').append('<div style="display:none" id="' + pagesId + '">' + html + '</div>')
            var tempDom = ES.selctorDoc('#right-content').firstchildren('div')
            // animation.fadeOut(tempDom, {}, function() {
            tempDom.remove()
            // })
            animation.fadeIn(ES.selctorDoc('#right-content #' + pagesId))
        } else {
            document.getElementById("right-content").innerHTML = '<div style="display:none" id="' + pagesId + '">' + html + '</div>'
            animation.fadeIn(ES.selctorDoc('#right-content').firstchildren('div'))
        }
    }
    let tempM = null
    if (model) {
        tempM = new model()
    }
    base = new className(appClass, api, ES.selctorDoc('#content #right-content').find('#' + pagesId), tempM)
    //appClass.resize = base.resize

    appClass.pagerclass = base
}
//老的加载方式
/*function pageDeal(appClass, base, api, html) {
    appClass.loading.hide()
    if (!document.getElementById("right-content").innerHTML) {
        document.getElementById("right-content").innerHTML = '<div id="' + pagesId + '">' + html + '</div>'
        base.init(appClass, api, ES.selctorDoc('#right-content').firstchildren('div'))
    } else {
        if (pagesId != ES.selctorDoc('#right-content').firstchildren('div').attr('id')) {
            ES.selctorDoc('#right-content').append('<div style="display:none" id="' + pagesId + '">' + html + '</div>')
            var tempDom = ES.selctorDoc('#right-content').firstchildren('div')
            //animation.fadeOut(tempDom, {}, function() {
            tempDom.remove()
            //})
            animation.fadeIn(ES.selctorDoc('#right-content #' + pagesId))
        } else {
            document.getElementById("right-content").innerHTML = '<div style="display:none" id="' + pagesId + '">' + html + '</div>'
            animation.fadeIn(ES.selctorDoc('#right-content').firstchildren('div'))
        }
        base.init(appClass, api, ES.selctorDoc('#content #right-content').find('#' + pagesId))
    }
    //appClass.resize = base.resize
    appClass.pagerclass = base

}*/
module.exports = route;
