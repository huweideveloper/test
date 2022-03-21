require('./bztoollist.less')
// var html = require('./tpl.html')

class bztoollist extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "bztoollist"
        this.data = []
    }
    complete() {
        this.multiliModule = require("../bztoolli/bztoolli.js")
    }
    clearData() {
      this.data = []
      this.nowParam.toolList = null
    }
    setData(value,type) {
        if (value.length != 0) {
            for (var i = 0; i < value.length; i++) {
                this.addli(value[i],type)
            }
        }
    }
    getData() {
        let that=this;
        let temp = []
        let tempstr=','
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].action == 3 && !this.data[i].id) {

            } else {
                if(tempstr.lastIndexOf(','+that.data[i].type+',')!==(-1) && that.data[i].type && this.nowParam.protype!=='audit'){
                    that.app.alert.show({
                        title: ' ',
                        msg: '该影像标注已存在',
                        close: true
                    })
                    that.data[i].type=='';
                    that.ulitem[i].cleartype()
                    return;
                }else{
                    tempstr+=that.data[i].type+','
                }
                let tempD = {id:that.data[i].id?that.data[i].id:null,action:that.data[i].id?that.data[i].action:1,type:this.data[i].type, annotationItemList: this.data[i].annotationItemList, toolList: [] }
                this.data[i].toolList.map((res) => {
                    if ((res.action == 3 && !res.id)) {} else {
                        tempD.toolList.push(res)
                    }
                })
                temp.push(tempD)
            }
        }
        return temp //this.data
    }
    addli(value, type) {
        this.dom.append('<li class="multili multili' + this.data.length + '"></li>')
        let temp = value ? value : {id:null,action:1, annotationItemList: [], toolList: [{ id: null, action: 1 }] }
        temp.action = 1
        let hascomp=false;
        if (value) {
            if (value.id) {
                temp.action = 2
            }
            if(value.annotationItemList.length>0){
                hascomp=true
            }
        }
        this.data.push(temp)
        this.ulitem = {}
        this.ulitem[this.data.length - 1] = this.app.loadModule(this.multiliModule, this.dom.find('.multili' + (this.data.length - 1)), {
            num: (this.data.length - 1),
            toolList: temp.toolList,
            data:temp,
            type:type,
            hascomp:hascomp,
            protype:this.nowParam.protype
        })
        this.ulitem[this.data.length - 1].event._addEvent('li.delete', (value) => {
            //console.log('heredelete')
            this.dom.find('.multili' + value.num).remove();
            this.data[value.num].action = 3
            this.event._dispatch('bztoollist.toolListchange')
        })
        this.ulitem[this.data.length - 1].event._addEvent('li.datachange', (value) => {
            console.log(value,'li.datachange')
            this.data[value.num]['type'] = value.data.type;
            let newarr = value.data.toolList.filter((val) => {
                return val != undefined
            })
            this.data[value.num]['toolList'] = newarr
            this.event._dispatch('bztoollist.toolListchange')
        })
        this.ulitem[this.data.length - 1].event._addEvent('li.specialchange', (value) => {
            this.event._dispatch('bztoollist.specialchange')
        })
        this.ulitem[this.data.length - 1].event._addEvent('li.adddata', (v1) => {
            this.event._dispatch('bztoollist.add', v1)
        })
        this.ulitem[this.data.length - 1].event._addEvent('li.showdata', (v1) => {
            this.event._dispatch('bztoollist.show', v1)
        })
        this.event._dispatch('bztoollist.toolListchange')
    }
    disable(){
        //console.log(ES.selctorDoc('.icon-shanchu'))
        ES.selctorDoc('.icon-shanchu').addClass('hide');
        ES.selctorDoc('.icon-tianjia').addClass('hide');
        ES.selctorDoc('.actionul .bzdata').addClass('hide');
    }
}

//原型链一定要有的
module.exports = bztoollist;
