require("./select.less");
class select extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name="select"
    }
    complete() {
        this.appendSelect(this.nowParam);
    }
    appendSelect(paramList) {
        this.data = paramList.data;
        this.firstSelect = paramList.firstSelect;
        if (paramList.title != undefined) {
            this.dom.find('.title').html(paramList.title);
        }
        var htmls = '';
        if (this.firstSelect != undefined) {
            self.dom.find(".selectCont1").append('<option data_id="">' + this.firstSelect + '</option>');
        }
        self.dom.find(".selectCont1").append(htmls);
    }
}


//原型链一定要有的
module.exports = select;