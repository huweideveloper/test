require("./addsupplier.less");
class addsupplier extends Interstellar.modalBase {

    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='addsupplier';
        this.apidata = {}
    }

    //var endData = []
    complete() {
        let that=this;
        if(that.api.type=='edit'){
            that.dom.find('.modal-title').html('编辑供应商')
            that.dom.find('.tips').html('供应商邀请码')
            that.dom.find('.tips').after('<span style="margin-left: 40px" class="code"></span>')
            that.dom.find('.btn-confirm').html('确定')
            that.setData(that.api.data)
        }
        this.initView()
    }
    setData(value){
        let that=this;
        that.dom.find('.inputBox').val(value.name)
        that.dom.find('.code').html(value.inviteCode)
        that.apidata.name=value.name
    }
    initView () {
        let that=this;
        that.dom.find('.inputBox').on('change',function () {
            that.apidata[ES.selctorDoc(this).attr('api')]=ES.selctorDoc(this).val()
        })
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-cancel').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-confirm').on('click', function() {
            that.dom.find('.required').remove()
            if(that.dom.find('.name').val()==''){
                that.dom.find('.inputBox').after('<span class="required">必填</span>')
            }else{
                that.event._dispatch('addsupplier.submit',that.apidata)
            }
        })
    }

}
//原型链一定要有的
module.exports = addsupplier;