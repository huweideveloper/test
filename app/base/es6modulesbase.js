class moduleBase {
    constructor(app, dom, value, addMode) {
        this.app = app
        this.dom = dom
        this.nowParam = value
        this.initDate = value
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
                this.dom.append(this.app.renderTemplate(this.html, this.initDate))
                break
        }
        if (this.app.languageMode) {
            var moduleName = this.initDate ? this.initDate.moduleName : null
            this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, moduleName || this.name)
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
    dispose() {

    }
}

window.Interstellar = window.Interstellar || {}
window.Interstellar.moduleBase = window.Interstellar.moduleBase || moduleBase
module.exports = moduleBase;