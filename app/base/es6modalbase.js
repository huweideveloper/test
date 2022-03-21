class modalBase {
    constructor(app, value, api, addMode) {
        this.app = app
        this.initDate = value || null
        this.api = api || null
        this.app.modalId = this.app.modalId + 1
        let zin = this.initDate ? this.initDate.zin : 1000
        zin = zin ? zin : 1000
        ES.selctorDoc('body').append('<div id="modal' + this.app.modalId + '" style="top:0;left:0;position: fixed;width: 100%;height: 100%;z-index:' + zin + ';"></div>')
        this.dom = ES.selctorDoc('#modal' + this.app.modalId)
        this._eventControl = new Interstellar.event()
        this.addMode = addMode || 'html'
        this.foriedA = ['app', 'dom', 'event', 'nowParam', 'init']
    }
    init() {
        switch (this.addMode) {
            case 'html':
                this.dom.html(this.app.renderTemplate(this.html, this.initDate))
                break
            case 'append':
                this.dom.append(this.app.renderTemplate(this.html, this.initDate))
                break
            case "prepend":
                this.dom.prepend(this.app.renderTemplate(this.html, this.initDate))
                break
        }
        this.dom.firstchildren('.modal').css({ 'margin-top': -this.dom.firstchildren('.modal').box().scrollHeight / 2 })
        if (this.app.languageMode) {
            var moduleName = this.initDate ? this.initDate.moduleName : null
           // console.log(this.name,this.dom.find('[data-i18n]').dom,this.name,moduleName)
            this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, moduleName||this.name)
        }
        this.complete()
    }
    attrA(key, value) {
        if (value != undefined) {
            if (this.foriedA.search(key) == -1) {
                this[key] = value
            }
        } else {
            return this[key]
        }
    }
    complete() {

    }
    get moduleData() {
        return this.nowParam
    }
    set moduleData(value) {
        this.nowParam = value
    }
    get event() {
        return this._eventControl
    }
    set event(value) {
        //this.nowParam = value
    }

    show() {
        this.dom.show()
    }
    hide() {
        this.dom.hide()
    }
    close() {
        this.dom.remove()
    }
    dispose() {

    }
}



window.Interstellar = window.Interstellar || {}
window.Interstellar.modalBase = window.Interstellar.modalBase || modalBase
module.exports = modalBase;
