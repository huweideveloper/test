function moduleBase() {
    var foriedA = ['app', 'dom', 'event', 'nowParam', 'init', 'templateArr']
    var event = require('../utils/event.js')
    var that = this
    this.app = null
    this.dom = null
    this.nowParam
    this.initDate = null
    this.event = new event()
    this.addMode = "html"
    this.templateArr = []
    this.init = function(app, dom, value) {
        that.app = app
        that.dom = dom
        that.nowParam = value
        that.initDate = value
        switch (this.addMode) {
            case 'html':
                that.dom.html(this.app.renderTemplate(that.html, this.initDate))
                break
            case 'append':
                that.dom.append(this.app.renderTemplate(that.html, this.initDate))
                break
            case "prepend":
                that.dom.append(this.app.renderTemplate(that.html, this.initDate))
                break
        }
        that.complete()
        if (that.app.languageMode) {
            //console.log(this.name,this.dom.find('[data-i18n]').dom)
            var moduleName = that.initDate ? that.initDate.moduleName : null
            that.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, that.app.language, moduleName || that.name)
        }
    }
    this.attrA = function(key, value) {
        if (value != undefined) {
            if (foriedA.search(key) == -1) {
                this[key] = value
            }
            /*switch (key) {
                case 'initDate':
                    that.dom.html(this.app.renderTemplate(that.html, this.initDate))
                    break
            }*/
        } else {
            return this[key]
        }
    }
    this.show = function() {
        that.dom.show()
    }
    this.hide = function() {
        that.dom.hide()
    }
    this.complete = function() {

    }
    this.dispose = function() {

    }
}

module.exports = moduleBase;