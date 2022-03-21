require("./formsubmit.less");
class formsubmit extends Interstellar.modalBase {

  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name='formsubmit';
    this.apidata = {}
    this.allobj={}
  }
  complete() {
    let that=this;
    this.render()
    this.initView()
  }
  render(){
    let that=this;
    console.log(that.api.config)
    that.api.config.forEach(function (val,idx) {
      let html=''
      switch (val.type) {
        case 'input':
          let inputtype=val.inputtype?val.inputtype:'text'
          html+='<div class="inputLine" redlabel="inputBox">\n' +
            '                <span class="names">'+val.title+'</span>\n' +
            '                <input type='+inputtype+' class="inputBox '+val.name+'" check="'+val.check+'" api="'+val.name+'"/>' +
            '                <p class="remark">'+val.remark+'</p>'+
            '            </div>';
          that.dom.find('.modal-body').append(html);
          if(val.value){
            that.dom.find('.'+val.name).val(val.value)
            that.apidata[val.name]=val.value
          }
          break;
        case 'dropdown':
          html+='<div class="inputLine" redlabel="xlk">\n' +
            '                <span class="names">'+val.title+'</span>\n' +
            '                <div class="'+val.name+'" check="'+val.check+'"></div>' +
            '                <p class="remark">'+val.remark+'</p>'+
            '            </div>';
          that.dom.find('.modal-body').append(html);
          require.ensure("../../moduleslibs/dropdown1/drop.js", function () {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            let temp=that.app.loadModule(dropdown,that.dom.find('.'+val.name),{
              className:'xlk',
              firstSelect: {val:'',idx:''},
              data:val.data,
              datatype:val.datatype
            })
            temp.event._addEvent('option.click',function (value) {
              console.log(that.apidata,'that.apidata',value,val.name)
              that.apidata[val.name]=value.idx;
            })
            temp.event._addEvent('dropDown.clear',function (value) {
              that.apidata[val.name]='';
            })
            that.allobj[val.name]=temp
            if(val.value){
              that.dom.find('.'+val.name+' .option[data-idx="'+val.value+'"]').click()
            }
          })
          break;
        case 'radio':
          let temp = ''
          val.data.forEach((item)=>{
            temp+='<div class="item" data-id="'+item.idx+'">\n' +
              '                <i class="radio-box"></i>\n' +
              '                <span>'+item.val+'</span>\n' +
              '            </div>'
          })
          html+='<div class="inputLine radioArea" redlabel="names" check="empty" title="">\n' +
            '                <span class="names">'+val.title+'</span>\n' +
            temp+
            '                <p class="remark">'+val.remark+'</p>'+
            '            </div>';
          that.dom.find('.modal-body').append(html);
          that.dom.find('.radioArea .radio-box').on('click',function(){
            ES.selctorDoc(this).parents('radioArea').find('.choose').removeClass('choose')
            ES.selctorDoc(this).addClass('choose')
            that.apidata[val.name]=ES.selctorDoc(this).parent().attr('data-id');
          })
          break;
      }
    })
    that.dom.find('.modal-title').html(that.api.title)
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
      that.dom.find('.tips').remove()
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
        that.event._dispatch('formsubmit.submit',that.apidata)
      }
    })
  }
  showerror(value){
    let that=this;
    Object.keys(value).forEach(function (val) {
      that.dom.find('.'+val).after('<span class="tips">'+value[val]+'</span>')
    })
  }
}
//原型链一定要有的
module.exports = formsubmit;
