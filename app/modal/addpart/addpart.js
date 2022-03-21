require("./addpart.less");
class addpart extends Interstellar.modalBase {

    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='addpart';
        this.apidata={}
    }
    complete() {
        let that=this;
        this.initView()
        if(that.api.title){
            that.dom.find('.modal-title').html(that.api.title)
        }
    }
    initView () {
        let that=this;
        that.dom.find('.inputBox').on('change',function () {
            that.apidata[ES.selctorDoc(this).attr('api')]=ES.selctorDoc(this).val()
            console.log(that.apidata,'that.apidata')
        })
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-cancel').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-confirm').on('click', function() {
            that.dom.find('.tips').css({color:'#666'})
            that.dom.find('.inputLine').dom.forEach(function(val, idx) {
                val.find('.'+val.attr('redlabel')).removeClass('redborder')
                val.find('.required').remove();
                if(Tool.checkForm(ES.selctorDoc(val).dom,'red')!==''){
                    val.find('.'+val.attr('redlabel')).addClass('redborder')
                    val.find('.'+val.attr('redlabel')).after('<span class="required">'+Tool.checkForm(ES.selctorDoc(val).dom,'red')+'</span>')
                }
            })
            if(that.dom.find('.redborder').dom){
                return false
            }else{
                console.log(that.apidata.number,that.api.total,'that.api.total')
                if(that.apidata.number>that.api.total){
                    that.dom.find('.tips').css({color:'red'})
                    return false;
                }
                that.event._dispatch('addpart.submit',that.apidata)
            }

        })
    }

}
//原型链一定要有的
module.exports = addpart;