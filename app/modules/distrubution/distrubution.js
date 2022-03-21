require('./distrubution.less')
// var html = require('./tpl.html')

class distrubution extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "distrubution"
        this.data=value
        this.companys={}
        this.apidata={venderAssignList:[],costVisible:false}
    }
    complete() {
        let that=this
        this.loadModule();
        that.companyli=require("../../modules/companyli/companyli")
        that.dom.find('.icon-tianjia').on('click',function () {
            that.companyarr.push({venderId:"",cost:"",costVisible:false})
            that.apidata.venderAssignList=that.companyarr.filter((item)=>{return item.delete!==true})
            that.event._dispatch('distrubution.datachange',that.apidata)
            that.addcompanyli();
        })
        that.dom.find('.kfsarea .check-box').on('click',function () {
            if(that.type!='view'){
                if(ES.selctorDoc(this).hasClass('choose')){
                    ES.selctorDoc(this).removeClass('choose')
                    that.apidata.costVisible=false
                }else{
                    ES.selctorDoc(this).addClass('choose')
                    that.apidata.costVisible=true
                }
                that.event._dispatch('distrubution.datachange',that.apidata)
            }
        })
        that.dom.find('.kfsarea .cost').on('change',function () {
            if(that.type!='view'){
                that.apidata.cost=ES.selctorDoc(this).val()
                that.event._dispatch('distrubution.datachange',that.apidata)
            }
        })
    }
    loadModule(){
        let that=this;
        that.dropobj={}
        let dropconfig = [{
            className:'kxlk',
            name: 'method',
            firstSelect: {val: '请选择任务方式', idx: ''},
            data: [{val: '承包式', idx: 1},{val: '开放式', idx: 2}]
        }, {
            className:'xlk',
            name: 'assignMethod',
            firstSelect: {val: '请选择任务分配方式', idx: ''},
            data: [{val: '抢单式', idx: 2}]
        }]
        require.ensure("../../moduleslibs/dropdown1/drop.js", function () {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            dropconfig.forEach(function (val,idx) {
                let drop= that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
                    className:val.className,
                    firstSelect: val.firstSelect,
                    data: val.data,
                    input:val.input
                })
                drop.event._addEvent('option.click',function (value) {
                    that.apidata[val.name]=parseInt(value.idx);
                    that.event._dispatch('distrubution.datachange',that.apidata)
                })
                drop.event._addEvent('dropDown.clear',function (value) {
                    that.apidata[val.name]='';
                    that.event._dispatch('distrubution.datachange',that.apidata)
                })
                that.dropobj[val.name]=drop;
            })
            that.dropobj['method'].event._addEvent('option.click',function (value) {
                that.dom.find('.rwfsarea').addClass('hide');
                that.apidata.method=parseInt(value.idx);
                that.companyarr=[]
                if(value.idx=="1"){
                    that.dom.find('.cbsarea').removeClass('hide')
                    if(that.companyarr.length==0){
                        that.companyarr.push({venderId:"",cost:"",costVisible:""})
                        that.dom.find('.companys').remove()
                        that.addcompanyli();
                    }
                }else if(value.idx=="2"){
                    that.dom.find('.kfsarea').removeClass('hide')
                }
                that.apidata.venderAssignList=that.companyarr.filter((item)=>{return item.delete!==true})
                that.event._dispatch('distrubution.datachange',that.apidata)
            })
        })
    }
    setTotalNum(value){
        this.dom.find('.kfsarea .people').html(value)
    }
    renderPeople(value,index){
      this.companys[index].renderPeople(value)
    }
    setxlkvalue(value){
        this.allcompany=value
        for(let i in this.companys){
          this.companys[i].setxlkvalue(value)
        }
    }
    showloading(bool){
      for(let i in this.companys){
        this.companys[i].loading(bool)
      }
    }
    validateCompanyli() {
      if (this.apidata.method == 1) { // 承包式
        // 校验表单数据
        const { companys = {}, companyarr = [] } = this
        const isAllValid = Object.values(companys).every((company, i) => {
          if (companyarr[i].delete) return true // 删除的不验证
          return company.validate()
        })
        if (!isAllValid) return false
      }
      return true
    }
    addcompanyli(val){
        let that=this;
        that.dom.find('.cbsarea').append('<li id="company' + this.companyarr.length + '" class="companys company'+this.companyarr.length+'" previous="' + !!val + '"></li>')// 添加previous属性是为了区别之前已经添加的和本次新添加的
        let company=that.app.loadModule(that.companyli,that.dom.find('.company'+this.companyarr.length),{num:this.companyarr.length,type:'audit', previous: !!val })
        company.setxlkvalue(this.allcompany)
        company.event._addEvent("companyli.getCompanyarr", target => {
          target.companyarr = this.companyarr || []
        })
        company.event._addEvent("companyli.addcompany", value => {
            that.companyarr.push({venderId:"",cost:"",costVisible:false})
            that.apidata.venderAssignList=that.companyarr.filter((item)=>{return item.delete!==true})
            that.event._dispatch('distrubution.datachange',that.apidata)
            that.addcompanyli();
        })
        company.event._addEvent('companyli.choosed',function (value) {
            that.event._dispatch('distrubution.queryPeople',value)
            that.apidata.venderAssignList.forEach(function (val,idx) {
                if(val.venderId==parseInt(value.data.idx)&&idx!==value.num-1){
                    company.cleardata();
                }
            })
        })
        company.event._addEvent('companyli.datachange',function (value) {
            that.companyarr[value.num-1]=value.data
            that.apidata.venderAssignList=that.companyarr.filter((item)=>{return item.delete!==true})
            that.event._dispatch('distrubution.datachange',that.apidata)
        })
        company.event._addEvent('companyli.delete',function (value) {
            if (that.dom.find(".companys").dom.length === 1) {
              that.app.alert.show({
                title: " ",
                msg: '只剩一行不能再删了',
                close: false
              })
              return
            }
            that.companyarr[value.num-1].delete=true
            that.apidata.venderAssignList=that.companyarr.filter((item)=>{return item.delete!==true})
            that.event._dispatch('distrubution.datachange',that.apidata)
            that.dom.find('.company' + value.num).remove()
            // 通知子组件总数更新
            Object.values(that.companys).forEach(company => company.onCompanyarrChange(that.companyarr))
        })
        company.event._addEvent('companyli.cominput',function (value) {
            that.event._dispatch('distrubution.cominput',{data:value,dom:company})
            // company.setxlkvalue(that.allcompany)
        })
        that.companys[that.companyarr.length]=company
        that.event._dispatch('distrubution.datachange',that.apidata)
        if(val){
          company.setdata(val)
        }
        // 通知子组件总数更新
        Object.values(that.companys).forEach(company => company.onCompanyarrChange(that.companyarr))
    }
    setData(res){
        let that=this;
        that.dom.find('.apidata[api=cost]').val(res.data.cost);
        that.apidata.cost=res.data.cost
        if(res.data.costVisible){
            that.dom.find('.kfsarea .check-box').addClass('choose');
        }
        that.dom.find('.method .option[data-idx="'+res.data.method+'"]').click();
        that.dom.find('.assignMethod .option[data-idx="'+res.data.assignMethod+'"]').click();
        if(res.data.venderAssignList){
            that.companyarr=[]
            that.dom.find('.companys').remove()
            res.data.venderAssignList.forEach(function (val,idx) {
                that.companyarr.push(val)
                that.addcompanyli(val,idx);
            })
            that.apidata.venderAssignList=that.companyarr
        }
    }
    disable(){
        let that=this;
        that.dom.find('.kfsarea .check-box').off('click')
        for(let i in that.dropobj){
            that.dropobj[i].disable()
        }
        // for(let i in that.companys){
        //     that.companys[i].disabled()
        // }
    }
}

//原型链一定要有的
module.exports = distrubution;
