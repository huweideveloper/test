require('./bztoolli.less')
// var html = require('./tpl.html')

class bztoolli extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "bztoolli"
    }
    complete() {
        let that = this;
        this.dropdown1 = require('../../moduleslibs/dropdown1/drop')
        this.bzlx = that.app.loadModule(that.dropdown1, that.dom.find('.bzxlk'), {
            className: 'xlk',
            firstSelect: {
                val: '病灶类型',
                idx: ''
            },
            data: Tool.configxlkformat(that.app.constmap.LESION),
            maxshownum: 5,
            input: true
        })
        that.bzlx.event._addEvent('option.click', function(value) {
            that.apidata.type = value.idx
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
            that.event._dispatch('li.specialchange')
        })
        that.bzlx.event._addEvent('dropDown.clear', function(value) {
            that.apidata.type = ''
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
            that.bzlx.renderHtml(Tool.configxlkformat(that.app.constmap.LESION))
        })
        that.bzlx.event._addEvent('drop.input', function(value) {
            let temp = Tool.configxlkformat(that.app.constmap.LESION).filter((val) => {
                console.log(val.val.indexOf(value), val, value)
                return val.val.indexOf(value.data) >= 0
            })
            that.bzlx.renderHtml(temp)
        })
        if (that.nowParam.protype == 'audit') {
            that.dom.find('.adddelli').remove()
            that.dom.find('.actionarea').remove()
            that.dom.find('.auditpercent').removeClass('hide')
        }
        this.apidata = {}
        this.apidata.toolList = this.nowParam.toolList ? this.nowParam.toolList : [{ id: null, action: 1 }]
        that.apidata.toolList.filter((value) => {
            if (value.id) {
                value.action = 2
            }
        })
        console.log('================', this.apidata, this.nowParam)
        this.apidata.data = this.nowParam.data
        this.dom.find('.toolarea').html('')
        //that.addtool(0)
        console.log('wwwwwwwwwwwwww')
        for (let i = 0; i < this.apidata.toolList.length; i++) {
          const tool = this.apidata.toolList[i]
          tool.action !== 3 && this.addtool(i); // 如果是删除3的状态，则不添加
        }
        console.log(this.apidata)
        if (that.nowParam.hascomp) {
            that.dom.find('.ytjdata').removeClass('hide')
        }
        if (that.apidata.data.type) {
            that.dom.find('.bzlx .option[data-idx="' + that.apidata.data.type + '"]').click();
        }
        if (that.nowParam.type) {
            that.bzlx.disable()
        }

        //删除整个元素
        that.dom.find('.bigdel').on('click', function() {
            that.event._dispatch('li.delete', { num: that.nowParam.num });
        })
        //打开添加标注组件
        that.dom.find('.icon-caozuo').on('click', function() {
            let dom = ES.selctorDoc(this).parent()
            dom.find('.actionul').removeClass('hide');
            dom.find('.mask').removeClass('hide');
        })
        //添加标注组件
        that.dom.find('.bzdata').on('click', function() {
            that.event._dispatch('li.adddata', { num: that.nowParam.num })
            ES.selctorDoc(this).parent().addClass('hide');
            ES.selctorDoc(this).parent().parent().find('.mask').addClass('hide');
        })
        //查看标注组件
        that.dom.find('.ytjdata').on('click', function() {
            that.event._dispatch('li.showdata', { num: that.nowParam.num })
            ES.selctorDoc(this).parent().addClass('hide');
            ES.selctorDoc(this).parent().parent().find('.mask').addClass('hide');
        })
        //关闭添加标注组件
        that.dom.find('.mask').on('click', function() {
            ES.selctorDoc(this).parent().find('.actionul').addClass('hide');
            ES.selctorDoc(this).addClass('hide');
        })
    }
    initli(val) {
        console.log(val, 'val')
        let valType = Tool.configxlkformat(this.app.constmap['TOOL_TYPE'])[val] ? Tool.configxlkformat(this.app.constmap['TOOL_TYPE'])[val].type : ""
        //console.log(valType, 'valTypevalType')
        let choose = Tool.configxlkformat(this.app.constmap['TOOL_TYPE']).filter((item) => {
            return item.idx == valType
        })[0]
        //console.log(choose)
        let firstSelect = {
            val: '工具',
            idx: ''
        }
        /*if(choose){
           firstSelect=choose
        }*/

        let that = this;
        let gongju = this.app.loadModule(that.dropdown1, that.dom.find('.toolitem' + val + ' .tool1'), {
            className: 'xlk',
            firstSelect: firstSelect,
            data: Tool.configxlkformat(that.app.constmap['TOOL_TYPE']),
            maxshownum: 5
        })

        let fztag = this.app.loadModule(that.dropdown1, that.dom.find('.toolitem' + val + ' .fztag'), {
            className: 'xlk',
            firstSelect: {
                val: '选择辅助Tag',
                idx: ''
            },
            data: [{
                val: '',
                idx: ''
            }]
        })
        //console.log(choose, 'valTypevalType')
        gongju.event._addEvent('option.click', function(value) {
            that.dom.find('.toolitem' + val + ' .notinit').addClass('hide')
            that.dom.find('.choose').removeClass('choose')
            //that.apidata.toolList[val]['property']=null
            that.apidata.toolList[val]['type'] = value.idx
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
            that.event._dispatch('li.specialchange')
        })
        gongju.event._addEvent('dropDown.clear', function(value) {
            that.dom.find('.toolitem' + val + ' .notinit').addClass('hide')
            that.apidata.toolList[val]['type'] = ''
            that.apidata.toolList[val]['property'] = null
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
        })
        that.dom.find('.toolitem' + val + ' .adddelli .icon-tianjia').on('click', function() {
            let data = { id: null, action: 1 }
            that.apidata.toolList.push(data)
            that.addtool(that.apidata.toolList.length - 1);
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
        })
        that.dom.find('.toolitem' + val + ' .adddelli .icon-shanchu').on('click', function() {
            that.apidata.toolList[val].action = 3 // undefined
            ES.selctorDoc(this).parent().parent().remove();
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
        })
        that.dom.find('.toolitem' + val + ' .yzsz .check-box').on('click', function() {
            if (ES.selctorDoc(this).hasClass('choose')) {
                ES.selctorDoc(this).removeClass('choose')
                //that.dom.find('.toolitem' + val + ' .yzsz')
                that.dom.find('.toolitem' + val + ' .yzarea').addClass('hide')
            } else {
                ES.selctorDoc(this).addClass('choose')
                that.dom.find('.toolitem' + val + ' .yzset').val('')
                //that.apidata.toolList[val]['property'] = JSON.stringify(tempobj);
                that.dom.find('.toolitem' + val + ' .yzarea').removeClass('hide')
            }
            console.log()
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
        })
        that.dom.find('.toolitem' + val + ' .canshu').on('change', function() {
            that.apidata.toolList[val]['property'] = ES.selctorDoc(this).val();
            that.event._dispatch('li.datachange', { num: that.nowParam.num, data: that.apidata })
        })
        //console.log(choose, 'valTypevalType', that.nowParam.type)
        if (that.nowParam.type) {
            //console.log(choose, 'valTypevalType', that.nowParam.type)
            gongju.disable()
            //console.log(choose,'valTypevalType',that.dom.find('.hbwidth'),that.dom.find('.yzset'))
            //that.dom.find('.hbwidth').attr('readonly', 'readonly')
            //that.dom.find('.yzset').attr('readonly', 'readonly')
            that.dom.find('.bzdata').addClass('hide')
            if (!that.nowParam.hascomp) {
                that.dom.find('.actionarea').remove()
            }
            that.dom.find('.icon-shanchu').addClass('hide')
            that.dom.find('.icon-tianjia').addClass('hide')
        }
        //console.log(this.apidata.toolList[val], val)
        that.setToolData(this.apidata.toolList[val], val)
        //console.log('++++++++++++++++++++++')
    }
    setToolData(value, idx) {
        let that = this;
        console.log(value, +'=========', idx)
        if (value.type) {
            that.dom.find('.toolitem' + (idx) + ' .option[data-idx="' + value.type + '"]').click();
            if (value.property) {
                that.dom.find('.canshu').val(value.property);
            }
        }
    }
    addtool(pos) {
      let that = this;
        let html = '<li class="' + (pos != 0 ? "mt10" : "") + ' toolitem toolitem' + pos + '">\n' +
            '                <div class="inputLine" redlabel="xlk">\n' +
            '                    <div class="tool1" check="empty"></div>\n' +
            '                </div>' +
            '                <div class="adddelli">\n' +
            '                    <i class="iconfont icon-tianjia" title="继续添加工具"></i>\n' +
            '                    <i class="iconfont icon-shanchu deltool" title="删除此工具"></i>\n' +
            '                </div>\n' +
            '                <div class="fztag  notinit hide"></div>' +
            '                <div class="auditpercent hide">' +
            '                    <span>一致性匹配系数：</span>' +
            '                    <div class="inputLine hide" redlabel="inputBox">\n' +
            '                        <input type="text" class="canshu inputBox" check="empty|int" reg="/^([1-9]\\d{0,1}|100)$/" error="请输入1-100之间的整数"/>\n' +
            '                    </div>' +
            '                    <span>%</span>' +
            '                </div>' +
            '            </li>';
        this.dom.find('.toolarea').append(html);
        if (that.nowParam.protype == 'audit') {
            that.dom.find('.auditpercent').removeClass('hide')
            that.dom.find('.auditpercent .inputLine').removeClass('hide')
            that.dom.find('.adddelli').remove()
        }
        this.dom.find('.deltool').eq(0).addClass('hide')
        this.initli(pos);

        //this.render(pos);
    }
    cleartype() {
        this.bzlx.reset()
    }
}

//原型链一定要有的
module.exports = bztoolli;
