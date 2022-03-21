require("./pagination_black.less");


class pagination_black extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.name = 'pagination_black'
        this.html = require('./pagination.html')
    }
    complete() {
        this.total = 1;
        this.pageId = 1;
        this.initView()
        this.addButton()
    }
    resetAll() {
        this.pageId = 1;
        this.initView()
    };
    getTotal(val, a) {
        this.total = val * 1;
        this.pageId = 1;
        this.jiexian = a * 1;
        this.halfl = Math.floor((a - 1) / 2)
        this.halfr = a - 1 - this.halfl
        this.initView()
    };
    initView() {
        this.dom.find('.jumpselect').removeClass('jumpselect');
        this.dom.find('.jumpfirst').removeClass('jumpdisabled')
        this.dom.find('.jumplast').removeClass('jumpdisabled')
        this.dom.find('.ellipsis').css({ 'display': 'inline-block' })
        this.dom.find('.lastpage').css({ 'display': 'inline-block' })
        this.dom.find('.firstpage').addClass('jumpselect')
        this.dom.find('.jumpfirst').addClass('jumpdisabled')
        if (this.total < 3 || (this.jiexian >= this.total - 2)) {
            // this.dom.find('.jumpfirst').addClass('jumpdisabled')
            // this.dom.find('.jumplast').addClass('jumpdisabled')
            this.dom.find('.ellipsis').hide()
            if (this.total == 1) {
                this.dom.find('.lastpage').hide()
                this.dom.find('.jumplast').addClass('jumpdisabled')
            }
        }
        
        let str = ""
        let that = this
        let len = (this.jiexian + 2 < this.total) ? this.jiexian : (this.total - 2)
        //console.log(len)
        this.dom.find('.jumppage').remove()
        for (var i = 0; i < len; i++) {
            str += '<span class="jump jumppage">' + (2 + i) + '</span>'
        }
        this.dom.find('.jumpright').before(str)
        this.dom.find('.lastpage').html(this.total * 1)
        this.middle()
        this.dom.find('.jumppage').on('click', function(value) {
            that.dom.find('.jumpselect').removeClass('jumpselect');
            that.dom.find('.jumpfirst').removeClass('jumpdisabled')
            that.dom.find('.jumplast').removeClass('jumpdisabled')
            that.pageId = ES.selctorDoc(this).html() * 1
            if (that.jiexian >= that.total - 2) {
                ES.selctorDoc(this).addClass('jumpselect')
            }
            that.middle()
            that.event._dispatch('pagination.changePage', that.pageId)
        })
    }
    addButton() {
        let that = this;
        this.dom.find('.jumpfirst').on('click', function() {
            if (that.total !== 1) that.dom.find('.jumplast').removeClass('jumpdisabled')
            if (!ES.selctorDoc(this).hasClass('jumpdisabled')) {
                that.pageId = ((that.pageId - 1) > 0) ? that.pageId - 1 : 1;
                that.dom.find('.jumpselect').removeClass('jumpselect');
                if (that.pageId == 1) {
                    that.dom.find('.firstpage').addClass('jumpselect')
                    ES.selctorDoc(this).addClass('jumpdisabled')
                }
                if (that.jiexian >= that.total - 2) {                   
                    that.dom.find('.jump').eq(that.pageId + 1).addClass('jumpselect')
                }
                that.middle();
                that.event._dispatch('pagination.changePage', that.pageId)
            }
        })
        this.dom.find('.jumplast').on('click', function() {
            if (that.total !== 1) that.dom.find('.jumpfirst').removeClass('jumpdisabled')
            if (!ES.selctorDoc(this).hasClass('jumpdisabled')) {
                that.pageId = ((parseInt(that.pageId) + 1) < that.total) ? (parseInt(that.pageId) + 1) : that.total;
                that.dom.find('.jumpselect').removeClass('jumpselect');
                if (that.pageId == that.total) {
                    that.dom.find('.lastpage').addClass('jumpselect')
                    that.dom.find('.jumplast').addClass('jumpdisabled')
                }
                if (that.jiexian >= that.total - 2) {
                    that.dom.find('.jump').eq(that.pageId + 1).addClass('jumpselect')
                }
                that.middle();
                that.event._dispatch('pagination.changePage', that.pageId)
            }
        })
        this.dom.find('.firstpage').on('click', function() {
            that.dom.find('.jumpselect').removeClass('jumpselect');
            if (that.total !== 1) {
                that.dom.find('.jumplast').removeClass('jumpdisabled')
                that.dom.find('.jumpfirst').addClass('jumpdisabled')
            }
            ES.selctorDoc(this).addClass('jumpselect')
            that.pageId = ES.selctorDoc(this).html() * 1
            that.middle();
            that.event._dispatch('pagination.changePage', that.pageId)
        })
        this.dom.find('.lastpage').on('click', function() {
            that.dom.find('.jumpselect').removeClass('jumpselect');
            that.dom.find('.jumplast').addClass('jumpdisabled')
            that.dom.find('.jumpfirst').removeClass('jumpdisabled')
            ES.selctorDoc(this).addClass('jumpselect')
            that.pageId = ES.selctorDoc(this).html() * 1
            that.middle();
            that.event._dispatch('pagination.changePage', that.pageId)
        })
    }
    middle() {
        if (this.jiexian < this.total - 2) {
            this.dom.find('.ellipsis').css({ 'display': 'inline-block' })
            if (this.pageId * 1 + this.halfr >= this.total - 1) {
                this.dom.find('.jumpright').hide()
                for (var i = 0; i < this.jiexian; i++) {
                    this.dom.find('.jumppage').eq(i).html(this.total - this.jiexian + i)
                    if (this.pageId == (this.total - this.jiexian + i)) {
                        this.dom.find('.jumppage').eq(i).addClass('jumpselect')
                    }
                }
                return
            }
            if (this.pageId - this.halfl <= 2) {
                this.dom.find('.jumpleft').hide()
                for (var j = 0; j < this.jiexian; j++) {
                    this.dom.find('.jumppage').eq(j).html(2 + j)
                    if (this.pageId == 2 + j) {
                        this.dom.find('.jumppage').eq(j).addClass('jumpselect')
                    }
                }
                return
            }
            for (var k = 0; k < this.halfl; k++) {
                this.dom.find('.jumppage').eq(k).html(this.pageId - this.halfl + k)
            }
            for (var l = this.halfl; l < this.jiexian; l++) {
                this.dom.find('.jumppage').eq(l).html(this.pageId * 1 + l - this.halfl)
                if (l == this.halfl) {
                    this.dom.find('.jumppage').eq(l).addClass('jumpselect')
                }
            }
        }
    }
}
module.exports = pagination_black