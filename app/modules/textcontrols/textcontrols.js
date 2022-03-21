require('./textcontrols.less')
// var html = require('./tpl.html')

class textcontrols extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "textcontrols"
    }
    complete() {
        this.render();
        this.addevent();
        this.hasinput={}
        let that=this;
        this.dom.find('.textname').on('change',function (res) {
            that.hasinput['textname']=ES.selctorDoc(this).val()
        })
    }
    render(value){
        let that=this;
        let dropdown = require("../../moduleslibs/dropdown1/drop.js")
        that.drop=that.app.loadModule(dropdown, that.dom.find('.texttype'),{
            className:'xlk',
            firstSelect: {
                val: '请选择',
                idx: ''
            },
            data: [{
                val: '文本型',
                idx: 'text'
            }, {
                val: '数字型',
                idx: 'num'
            }]
        })
        that.drop.event._addEvent('option.click',function (res) {
            that.hasinput.texttype=res.idx
        })
        if(value){
            that.setData(value)
        }
    }
    addevent(){
        let that=this;
        that.dom.find('.labelsinput').on('keydown', function(e){
            let keyCode = e.keyCode
            if (event.keyCode === 13) {
                if(ES.selctorDoc(this).val()!=''){
                    that.createlabel(ES.selctorDoc(this).val())
                }
            }
        })
        that.dom.find('.labelsarea').on('blur', function(){
            if(ES.selctorDoc(this).val()!=''){
                that.createlabel(ES.selctorDoc(this).val())
            }
        })
        that.dom.find('.labelsarea').on('click', function(){
            // that.dom.find('.labelsinput').focus();
            $('.labelsinput').focus();
        })
        that.dom.find('.labelsinput').on('input', function(){
            that.dom.find('.labelitem .icon-guanbi').off('click');
            that.event._dispatch('controls.inputlabel',{val:ES.selctorDoc(this).val()});
        })
    }
    bindlabeldelete(){
        let that=this;
        that.dom.find('.labelitem .icon-guanbi').on('click',function () {
            ES.selctorDoc(this).parent().parent().remove();
            that.event._dispatch('controls.heightchange');
        })
    }
    checkrequired(){
        let that=this;
        that.dom.find('.inputLine').dom.forEach(function(val, idx) {
            val.find('.'+val.attr('redlabel')).removeClass('redborder')
            val.find('.required').remove();
            if(Tool.checkForm(ES.selctorDoc(val).dom,'red')!==''){
                console.log(val.attr('redlabel'))
                val.find('.'+val.attr('redlabel')).addClass('redborder')
                val.find('.'+val.attr('redlabel')).after('<span class="required">'+Tool.checkForm(ES.selctorDoc(val).dom,'red')+'</span>')
            }
        })
        if(that.dom.find('.redborder').dom){
            return false
        }else{
            return that.returndata()
        }
    }
    returndata(){
        let that=this;
        let obj={}
        obj.type='text';
        obj.name=that.dom.find('.textname').val();
        obj.parameter={}
        obj.parameter.texttype=that.dom.find('.texttype .nowname').attr('data-idx')
        //obj.parameter.isrequired=that.dom.find('.isrequired').hasClass('choose')
        obj.parameter=JSON.stringify(obj.parameter)
        let arr=[]
        if(that.dom.find('.labelsarea .labelitem').dom){
            that.dom.find('.labelsarea .labelitem').dom.forEach(function (val,idx) {
                if(val.attr('dataid')){
                    arr.push(parseInt(val.attr('dataid')))
                }
            })
        }
        obj.tagIdList=arr;
        return obj;
    }
    setData(value){
        let that=this;
        that.dom.find('.textname').val(value.name)
        console.log(that.dom.find('.texttype .nowname'))
        that.dom.find('.texttype .nowname').click();
        that.dom.find('.texttype .option[data-idx="'+JSON.parse(value.parameter).texttype+'"]').click();
        value.tagList.forEach(function (val,idx) {
            let label='<span class="labelitem" dataid="'+val.id+'">\n' +
                '                            <label>'+val.text+'</label>\n' +
                '                            <span><i class="iconfont icon-guanbi"></i></span>\n' +
                '                        </span>';
            that.dom.find('.labelsinput').before(label)
        })
        that.bindlabeldelete();
    }
    labelul(value){
        let that=this;
        let html=''
        if(value){
            value.forEach(function (val,idx) {
                html+='<li class="labelli" dataid="'+val.id+'">'+val.text+'</li>'
            })
            that.dom.find('.labelul').html(html)
            that.dom.find('.labelli').on('click',function () {
                ES.selctorDoc(this).parent().html('')
                that.createlabel(ES.selctorDoc(this).html(),ES.selctorDoc(this).attr('dataid'))
            })
        }else{
            that.dom.find('.labelul').html('')
        }
    }
    createlabel(value,value2){
        let that=this;
        that.hasinput.tagList=''
        if(that.dom.find('.mask').dom)  that.dom.find('.mask').addClass('hide')
        that.dom.find('.labelul').html('')
        that.dom.find('.tips').css({'color':'#666'})
        if(that.dom.find('.labelitem').dom&&that.dom.find('.labelitem').dom.length>=10){
            that.dom.find('.tips').css({'color':'red'})
            that.dom.find('.labelsinput').val('');
        }else{
            let label='<span class="labelitem" dataid="'+value2+'">\n' +
                '                            <label>'+value+'</label>\n' +
                '                            <span><i class="iconfont icon-guanbi"></i></span>\n' +
                '                        </span>';
            that.dom.find('.labelsinput').before(label)
            if(!value2){
                that.event._dispatch('controls.createlabel',{val: that.dom.find('.labelsinput').val()});
            }
            that.dom.find('.labelitem .icon-guanbi').off('click');
            that.bindlabeldelete();
            that.dom.find('.labelsinput').val('')
            that.event._dispatch('controls.heightchange');
            that.hasinput.tagList='yes'
        }

    }
    setid(value1,value2){
        let that=this;
        console.log(value1,value2)
        that.dom.find('.labelitem').dom.forEach(function (val,idx) {
            if(val.find('label').html()==value2){
                val.attr('dataid',value1)
            }
        })
    }
    getisinput(){
        console.log(this.hasinput,'this,hasinput')
        return this.hasinput
    }
}

//原型链一定要有的
module.exports = textcontrols;
