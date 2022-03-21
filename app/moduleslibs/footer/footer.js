require("./footer.less")
class footer extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')

    }
    complete() {

    }

}

module.exports = footer;