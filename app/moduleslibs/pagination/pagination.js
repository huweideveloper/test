require("./pagination.less");
var html = require("./tpl.html");

class pagination extends Interstellar.moduleBase {
    // var pagination = {}
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
    }
   complete () {
        var that = this
    this.total = 0
    this.pageId = 1
    this.both = true
    this.page = true
    this.dom1 = null
    this.html=html

        //this.dom.append(html)
        //this.dom.find('.btn').css('display', 'table_group-cell')
        this.total = this.nowParam.total
        this.initView()
       this.addButton();
        //this.addButton()
    }
    resetAll  (value) {
        //console.log(value)
        this.pageId = 1
        this.total = value
        this.initView()
    }
    getTotal (val) {
        this.total = val;
        this.initView()
    };
    addButton() {
        var that = this
        this.dom.find('.pager-btn-navigate a').on('click', function() {
            var className = String( ES.selctorDoc(this).attr('class'))
            if (className.lastIndexOf('disable') != -1) {
                return
            }
            switch ( ES.selctorDoc(this).attr('class')) {
                case "pager-first":
                    that.pageId = 1
                    break
                case "pager-last":
                    that.pageId = that.total
                    break
                case "pager-prev":
                    that.pageId = ((that.pageId - 1) > 0) ? that.pageId - 1 : 1
                    break
                case "pager-next":
                    that.pageId = ((that.pageId + 1) < that.total) ? that.pageId + 1 : that.total
                    break
            }
            that.initView()
            that.event._dispatch('pagination.changePage', that.pageId)
        })
        // that.dom.find('.pager-btn-jump input').keyup(function(e) {
        //     if (String(e.which) == '13') {
        //         if ( ES.selctorDoc(this).val()) {
        //             if (Number(( ES.selctorDoc(this).val()).trim()) < that.total) {
        //                 that.pageId = ( ES.selctorDoc(this).val()).trim()
        //                 that.event._dispatch('pagination.changePage', that.pageId)
        //                 initView()
        //                 return
        //             }
        //         }
        //         ES.selctorDoc(this).blur()
        //         initView()
        //     }
        // })
        this.dom.find('.pager-btn-jump input').focus(function() {
            var that = this
            that.dom.find('.pager-btn-jump input').val(that.pageId)
        })
        this.dom.find('.pager-btn-jump input').blur(function() {
            var that = this
            that.initView()
        })
    }
    initView() {
        var that = this
        this.dom.find('.pager-btn-jump .pager-num1').val(that.pageId + '/' + that.total)
        //console.log(that.total)
        this.openBtn()
    }

    openBtn() {
        var that = this
        if (this.total == 1) {
            //that.dom.find('.pager-btn-navigate a').removeClass('disable')
            //that.dom.find('.pager-btn-navigate a').addClass('disable')
            return
        }
        this.dom.find('.pager-btn-navigate a').removeClass('disable')
        if (this.pageId == that.total) {
            //that.dom.find('.pager-btn-navigate .pager-last').addClass('disable')
            that.dom.find('.pager-btn-navigate .pager-next').addClass('disable')
            return
        }
        if (this.pageId == 1) {
            //that.dom.find('.pager-btn-navigate .pager-first').addClass('disable')
            //that.dom.find('.pager-btn-navigate .pager-prev').addClass('disable')
            return
        }
    }
     // initView() {
     //     pagination.dom.find('.num_content').html('')
     //     var contentH = ''
     //     var newA = getArr()
     //     pagination.dom.find('.num_content').css('width',newA.length*30)
     //     for (var i = 0; i < newA.length; i++) {
     //         var className = ''
     //         if (newA[i] == pagination.pageId) {
     //             className = 'choose'
     //         }
     //         contentH += '<p class="' + className + '">' + newA[i] + '</p>'
     //     }
     //     pagination.dom.find('.num_content').html(contentH)
     //     pagination.dom.find('.num_content p').on('click', function() {
     //         pagination.pageId=$.trim($(this).html())*1
     //         initView()
     //         wEvent._dispatch('pagination.changePage',pagination.pageId)
     //     })
     // }
   getArr() {
         var returnA = []
         if (pagination.total < 5) {
             for (var i = 0; i < pagination.total; i++) {
                 returnA.push((i + 1))
             }
         } else {
             var pianyi = 0
             for (var j = 0; j < 5; j++) {
                 var num = pagination.pageId + j - 2
                 if (j == 0) {
                     if (num < 0) {
                         pianyi = Math.abs(pagination.pageId + j - 2) + 1
                     }
                     if(num>pagination.total-5){
                         pianyi=-(num+5-pagination.total-1)
                     }
                 }
                 num += pianyi
                 returnA.push(num)
             }
         }
         return returnA
     }

}
//原型链一定要有的
module.exports = pagination;
