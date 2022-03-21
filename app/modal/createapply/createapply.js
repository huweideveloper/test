require("./createapply.less");
class createapply extends Interstellar.modalBase {

    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='createapply';
        this.apidata={}
    }
    complete() {
        let that=this;
        this.initView()
        if(that.api.title){
            that.dom.find('.modal-title').html(that.api.title)
        }
        let config=[
            {
                type: 'checkbox',
                name: 'bodyPart',
                showname: '请选择部位',
                datatype: 'obj',
                data:Tool.configxlkformat(that.app.constmap['BODY_PART'])
            }
        ]
        that.singleobj={}
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            config.forEach(function (val, idx) {
                that.singleobj[val.name] = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
                    className: 'xlk',
                    firstSelect: {val: val.showname, idx: ''},
                    data: val.data
                })
                that.singleobj[val.name].event._addEvent('option.click', function (value) {
                    that.apidata[val.name] = value.idx
                })
                that.singleobj[val.name].event._addEvent('dropDown.clear', function (value) {
                    that.apidata[val.name] = ''
                })
            })
            if(that.api.data){
                that.setData(that.api.data)
            }
            if(that.api.type=='view'){
                that.dom.find('.btn-confirm').addClass('hide')
                that.dom.find('.inputBox').attr('readonly','readonly');
                that.singleobj['bodyPart'].disable()
            }else if(that.api.type=='edit'){
                if(that.api.num>0){
                    that.dom.find('.inputBox[api="projectName"]').attr('readonly','readonly');
                    that.dom.find('.inputBox[api="projectName"]').css({'background':'#e8e8e8'});
                    that.singleobj['bodyPart'].disable()
                }
            }
        })
    }
    setData(value){
        let that=this;
        for(let i in value){
            if(that.dom.find('.inputBox[api="'+i+'"]').dom){
                that.dom.find('.inputBox[api="'+i+'"]').val(value[i])
            }
        }
        that.apidata=value
        that.dom.find('.bodyPart .option[data-idx="'+value.bodyPart+'"]').click()
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
                console.log(that.apidata,'that.apidata')
                that.event._dispatch('createapply.submit',that.apidata)
            }
        })
    }

}
//原型链一定要有的
module.exports = createapply;