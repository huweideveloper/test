function modalBase() {
    var event = require('../utils/event.js')
    var foriedA = ['app', 'dom', 'nowParam', 'init', 'event']
    var that = this
    this.app = null
    this.dom
    this.initDate
    this.event = new event()
    this.addMode = 'html'
    this.init = function(app, value, api) {
        that.app = app
        that.initDate = value || null
        that.api = api || null
        that.app.modalId = that.app.modalId + 1
        var zin = that.initDate ? that.initDate.zin : 1000
        zin = zin ? zin : 1000
        ES.selctorDoc('body').append('<div id="modal' + that.app.modalId + '" style="top:0;left:0;position: fixed;width: 100%;height: 100%;z-index:' + zin + ';"></div>')
        that.dom = ES.selctorDoc('#modal' + that.app.modalId)
        switch (this.addMode) {
            case 'html':
                that.dom.html(this.app.renderTemplate(that.html, this.initDate))
                break
            case 'append':
                that.dom.append(this.app.renderTemplate(that.html, this.initDate))
                break
            case "prepend":
                that.dom.prepend(this.app.renderTemplate(that.html, this.initDate))
                break
        }
        //console.log(that.dom.firstchildren('.modal').box())
        that.dom.firstchildren('.modal').css({'margin-top':-that.dom.firstchildren('.modal').box().clientHeight / 2})
        that.dom.firstchildren('.modal').css({'margin-left':-that.dom.firstchildren('.modal').box().clientWidth / 2})
        that.complete()
        if (that.app.languageMode) {
            //console.log(this.name,this.dom.find('[data-i18n]').dom)
            var modalName = that.initDate ? that.initDate.modalName : null
            that.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, that.app.language, that.initDate.modalName||that.name)
        }

        if (typeof this.btnInitview === 'function') {
            //console.log(that)
            this.btnInitview(this)
        }

    }
    this.attrA = function(key, value) {
        if (value != undefined) {
            if (foriedA.search(key) != -1) {
                this[key] = value
            }
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
    this.close = function() {
        that.dom.remove()
    }
    this.complete = function() {

    }
    this.dispose = function() {

    }

}

module.exports = modalBase;