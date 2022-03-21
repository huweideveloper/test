class report extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        require("./report.less");
        this.html = require("./tpl.html");
        this.name = "report"
        this.chooseData = {}
    }
    complete() {
        console.log(this.initDate)
        if (this.initDate.diagnosisIncome) {
            if (this.initDate.conclusion) {
                this.dom.find('.socrllr .con').eq(1).html('<p>' + this.initDate.conclusion + '</p>')
                this.newSorle(this.dom.find('.socrllr').eq(1))
            }
        } else {
            this.dom.find('.socrllr').eq(1).hide()
        }
        if (this.initDate.inspectSee) {
            if (this.initDate.finding) {
                this.dom.find('.socrllr .con').eq(0).html('<p>' + this.initDate.finding + '</p>')
                this.newSorle(this.dom.find('.socrllr').eq(0))
            }
        } else {
            this.dom.find('.socrllr').eq(0).hide()
        }
    }
    updataData(finding, conclusion) {
        if (this.initDate.diagnosisIncome) {
            if (conclusion) {
                this.dom.find('.socrllr .con').eq(1).html('<p>' + conclusion + '</p>')
                this.newSorle(this.dom.find('.socrllr').eq(1))
            }

        }
        if (this.initDate.inspectSee) {
            if (finding) {
                this.dom.find('.socrllr .con').eq(0).html('<p>' + finding + '</p>')
                this.newSorle(this.dom.find('.socrllr').eq(0))
            }

        }

    }
    newSorle(dom) {
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        dom.find('.con').attr('id', rid)
        this.myScrollgood = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
    }

}
module.exports = report;