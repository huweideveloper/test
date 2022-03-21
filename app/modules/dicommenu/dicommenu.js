require("./dicommenu.less");
/*
获取配置参数，根据不同页面可以调用不同的内容
入参格式：
{
  xxx: { t: 'm', c: false }
}
xxx代表工具名称，
t为工具跟其他工具是否关联，m为关联，s为单独
c代表当前是开还是关，false为关，true为开

event有如下几个
dicommenu.wlchange 窗宽窗位改变
dicommenu.choose 工具改变
dicommenu.done 为工具当中的按钮事件,单层删除，标位废片等
dicommenu.setData 为工具设置一些工具配置参数，如画笔大小，画笔范围等
返回值：{type:xxxx,value:123}
dicommenu.errorMSG 为工具出现的错误信息
返回值：{msg:xxx}

this.chooseData.wl获取窗宽窗位值
this.chooseData.click获取当前点击了那个按钮
this.chooseData.fun获取当前是那个工具被激活
*/
class dicommenu extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require("./tpl.html");
        this.name = "dicommenu"
        this.chooseData = {
            ctVal: 200
        }
        this.tool = {
            data: {}
        }
    }
    complete() {
      let that = this
        //下拉框
        require.ensure("../../moduleslibs/dropdown1/drop", function() {
          let dropdown = that.dropdown = require('../../moduleslibs/dropdown1/drop')
          setTimeout(() => {
            let woptions = []
            that.app.constmap.WINDOW && that.app.constmap.WINDOW.children.map((item) => {
                woptions.push({
                    optionname: item.name,
                    val: item.name,
                    idx: item.remark
                })
            })
            let guojihua = that.app.loadModule(dropdown, that.dom.find('.wl'), {
                className: "ctdrop",
                firstSelect: {
                    optionname: '选择窗位',
                    val: '选择窗位',
                    idx: ''
                },
                data: woptions
            })
            guojihua.event._addEvent('option.click', function(value) {
                let data = value.idx.split('*')
                that.chooseData.wl = {
                    w: data[1],
                    c: data[0]
                }
                that.event._dispatch('dicommenu.wlchange')
            })
            guojihua.event._addEvent('dropDown.clear', function(value) {
                //that.set_wl('', '')
                //that.dom.find('.wl_text input').val('')
                that.chooseData.wl = {
                    w: null,
                    c: null
                }
                that.event._dispatch('dicommenu.wlchange')
                    //console.log(value)
            })
          }, 100);

        })

        //范围选择
        this.initRange()
            //初始化菜单打开关闭
        for (var i in this.initDate) {
            if (!this.initDate[i].c) {
                let dom = this.dom.find('.dicommenu li[fun=' + i + ']')
                dom.attr('close', 'close')
                let name = dom.attr('title')
                dom.attr('title', name + ' 已禁用')
                    //console.log('=============')
                dom.css({
                        'cursor': 'auto',
                        'background': '#01111e',
                        'color': '#706F6F'
                    })
                    //console.log(dom.find('input').dom)datava
                let inputName = dom.find('input').attr('name')
                if (dom.find('input').dom && inputName != 'copdData' && inputName != 'datava') {
                    dom.find('input').attr('readonly', 'readonly')
                }
            }
        }
        this.btn_event()
    }

    //范围选择器初始化
    initRange() {
        let rangechoose = require('../../modules/rangetextchoose/rangetextchoose')
        let configArr = [{
            name: "半径",
            type: "bradius",
            value: 4,
            max: 30,
            min: 1
        }, {
            name: "粗细",
            type: "lineWidth",
            value: 2,
            max: 10,
            min: 1
        }, {
            name: "半径",
            type: "bradius",
            value: 4,
            max: 30,
            min: 1
        }, {
            name: "半径",
            type: "bradius",
            value: 3,
            max: 80,
            min: 1
        }]
        for (let i = 0, len = configArr.length; i < len; i++) {
            let temprangechoose = this.app.loadModule(rangechoose, this.dom.find('.chooseDate').eq(i), configArr[i])
            temprangechoose.event._addEvent('rangetextchoose.change', (value) => {
                //console.log(value)
                this.synchronization(configArr, value)
                this.event._dispatch('dicommenu.setData', value)
            })
            temprangechoose.event._addEvent('rangetextchoose.errorMSG', (value) => {
                this.event._dispatch('dicommenu.errorMSG', value)
            })
            configArr[i].classObject = temprangechoose
        }
        this.dom.find('.chooseDate1 .sure-btn').on('click', () => {
                let copdVal = this.dom.find('.chooseDate1 input[name="copdData"]').val()
                localStorage.setItem("copdVal", copdVal)
                let data = {
                    value: copdVal
                }
                this.event._dispatch('dicommenu.CTData', data)
            })
            /*let temprangeC = this.app.loadModule(rangechoose, this.dom.find('.chooseDate1'), {
                name: "阈值",
                type: "bradius",
                value: -920,
                max: 0,
                min: -1024
            })
            temprangeC.event._addEvent('rangetextchoose.change', (value) => {
                //console.log(value)
                //this.synchronization(configArr, value)
                this.event._dispatch('dicommenu.CTData', value)
            })
            temprangeC.event._addEvent('rangetextchoose.errorMSG', (value) => {
                this.event._dispatch('dicommenu.errorMSG', value)
            })*/
    }
    synchronization(allClass, value) {
        for (let i = 0, len = allClass.length; i < len; i++) {
            if (allClass[i].type == value.type) {
                allClass[i].classObject.setAllData(value.value)
                    //allClass[i].classObject.setDragPos(value.value)
            }
        }
    }

    //鼠标事件
    btn_event() {
        let that = this
        this.dom.find('.dicommenu .mask').on('click', function() {
            ES.selctorDoc(this).hide()
            that.dom.find('.chooseDate').hide()
            that.dom.find(".dicommenu .hover_vp").hide()
        })

        /*-----------------------华丽的分割线-----------------------------*/
        /*无范围选择的工具*/
        this.dom.find('.dicommenu .fun_btn').on('click', function() {
            //let dom = ES.selctorDoc(this).parent()
            let dom = ES.selctorDoc(this) //.parent()
            that.dom.find('.chooseDate').hide()
            that.dom.find(".dicommenu .hover_vp").hide()
            switch (dom.attr('fun')) {
                case "rest":
                    //重置按钮

                    that.event._dispatch('dicommenu.reset')
                    break
                case "mpr":
                    //mpr切换按钮

                    that.event._dispatch('dicommenu.mpr')
                    break
                default:
                    if (that.toBtn_choose(dom)) {
                        console.log(dom.attr('fun'), 'funfufnf')
                        that.chooseData.fun = dom.attr('fun')
                    } else {
                        that.chooseData = {}
                    }
                    that.event._dispatch('dicommenu.choose')
                    break
            }
        })

        /*-----------------------华丽的分割线-----------------------------*/
        /*有范围选择的工具*/
        this.dom.find('.dicommenu .fun_btn_spice').on('click', function(e) {
            //let dom = ES.selctorDoc(this).parent()
            let dom = ES.selctorDoc(this) //.parent()
            that.dom.find('.chooseDate').hide()
            that.dom.find(".dicommenu .hover_vp").hide()
                //console.log(dom.find('i').attr('enable'))
                //console.log('pppppppppppp')
            let st = that.toBtn_choose(dom)
            if (st || st == null) {
                dom.find('.chooseDate').show()
            }
            if (st) {
                //console.log('pppppppppppp')
                that.chooseData.fun = dom.attr('fun')
            }
            that.event._dispatch('dicommenu.choose')
        })



        /*this.dom.find('.ct_text input').on('blur', function() {
            that.chooseData.ctVal = that.dom.find('.ct_text input').val()
        })*/

        /*-----------------------华丽的分割线-----------------------------*/
        /*按钮类型，非icon样子的操作 ，标为废片，单层删除等*/
        this.dom.find('.btn-c').on('click', function() {
            let dom = ES.selctorDoc(this)
            that.toBtn_choose(dom)
            that.chooseData.click = dom.attr('fun')
            that.event._dispatch('dicommenu.done')
        })
        this.dom.find('.btn-yy').on('click', function() {
            let dom = ES.selctorDoc(this)
            if (that.toBtn_choose(dom)) {
                that.dom.find('.btn-yy .btn').removeClass('light')
                dom.find('.btn').addClass('light')
                that.event._dispatch('dicommenu.yinyang', {
                    data: dom.attr('data')
                })
            }
        })
        this.dom.find('.opende').on('click', function() {
            let dom = ES.selctorDoc(this).find('div')
            let st = true
            if (dom.html() == "隐藏标注") {
                st = false
                dom.html("显示标注")
            } else {
                st = true
                dom.html("隐藏标注")
            }
            that.event._dispatch('dicommenu.shc', {
                stauts: st
            })
        })

        /*-----------------------华丽的分割线-----------------------------*/
        /*多视窗*/
        this.dom.find('.dicommenu .screen').on('click', e => {
            if (this.dom.find('.dicommenu .screen').attr('close') == 'close') {
                return false
            }
            let screen = document.querySelector(".dicommenu .screen")
            this.dom.find('.chooseDate').hide()
            if (screen.children[1].style.display == 'block') {
                this.dom.find(".dicommenu .hover_vp").hide()
            } else {
                this.dom.find(".dicommenu .hover_vp").show()
            }
        })

        this.dom.find(".dicommenu .vp_item").on('click', function(e) {
            let dom = ES.selctorDoc(this)
            let screen = that.dom.find(".dicommenu .screen").firstchildren('i')
            screen.removeAttr('class')
            screen.attr('class', dom.find('i').attr('class'))
            that.event._dispatch('dicommenu.splitScreen', dom.attr('code') * 1)
        })

        /*-----------------------华丽的分割线-----------------------------*/

        /*基准线和十字瞄准线*/
        this.dom.find('.dicommenu .fun_btn_single').on('click', function() {
            if (that.dom.find('.dicommenu .fun_btn_single').attr('close') == 'close') {
                return false
            }
            that.dom.find('.dicommenu .fun_btn_single1').removeClass('choose')
            let dom = ES.selctorDoc(this)
            that.dom.find('.chooseDate').hide()
            that.dom.find(".dicommenu .hover_vp").hide()
            if (dom.hasClass('choose')) {
                dom.removeClass('choose')
                that.event._dispatch('dicommenu.baseLine', {
                    st: false
                })
            } else {
                dom.addClass('choose')
                that.event._dispatch('dicommenu.baseLine', {
                    st: true
                })
            }
        })
        this.dom.find('.dicommenu .fun_btn_single1').on('click', function() {
            if (that.dom.find('.dicommenu .fun_btn_single').attr('close') == 'close') {
                return false
            }
            that.dom.find('.dicommenu .fun_btn_single').removeClass('choose')
            let dom = ES.selctorDoc(this)
            that.dom.find('.chooseDate').hide()
            that.dom.find(".dicommenu .hover_vp").hide()
            dom.addClass('choose')
            that.event._dispatch('dicommenu.cross', {
                st: true
            })
        })


        /*-----------------------华丽的分割线-----------------------------*/
        /*copd*/
        this.dom.find('.dicommenu .chooseDate1').on('click', () => {
            console.log("我是点击了 希望能阻止")
            return
        })
        /*this.dom.find('.dicommenu .icon-bianji1').on('click', function() {
            let dom = that.dom.find(".dicommenu .fun_btn_copd")
            if (dom.hasClass('choose')) {
                dom.removeClass('choose')
                that.dom.find('.chooseDate1').hide()
            } else {
                dom.addClass('choose')
                that.dom.find('.chooseDate1').show()
                that.event._dispatch("dicommenu.setCopdVal")
            }
            that.dom.find(".dicommenu .hover_vp").hide()
        })
        this.dom.find('.dicommenu .icon-bianji2').on('click', function() {
            let dom = that.dom.find(".dicommenu .fun_btn_brain")
            if (dom.hasClass('choose')) {
                dom.removeClass('choose')
                    //that.dom.find('.chooseDate1').hide()
            } else {
                dom.addClass('choose')
                    //that.dom.find('.chooseDate1').show()
                that.event._dispatch("dicommenu.cal")
                    //that.event._dispatch("dicommenu.setCopdVal")
            }
            that.dom.find(".dicommenu .hover_vp").hide()
        })*/


        /*当前页面的情况*/
        if (this.app.parpam['type']) {
            if (this.app.parpam['type'].lastIndexOf('viewer') != -1) {
                this.dom.find('li[fun="remove_xu"]').remove()
            }
        }

    }
    openYY() {
        this.dom.find('.btn-yy').show()
    }
    closeYY() {
        this.dom.find('.btn-yy').attr('close', 'close')
    }
    addDoctorSocre(name, sorce) {
        console.log(sorce, name)
        if (sorce == '无') return

        this.dom.find('.yyshow').append('<p>' + name + ':' + (sorce == 1 ? '阴' : '阳') + '</p>')
    }
    setYY(value) {
        let yayAttributes = null
        for (var i in value) {
            yayAttributes = value[i].data.yayAttributes
        }
        if (yayAttributes == 1) {
            this.dom.find('.btn-yy .btn').eq(0).addClass('light')
        } else if (yayAttributes == 2) {
            this.dom.find('.btn-yy .btn').eq(1).addClass('light')
        }
    }
    defaultWWC(value) {
        //console.log(value, 'defaultWWCdefaultWWCdefaultWWCdefaultWWC')
        this.dom.find('.ctdrop input').val(value.name)
        this.dom.find('.ctdrop input').attr('data-idx', value.remark)
        this.chooseData.wl = {
            w: value.remark.split('*')[1] * 1,
            c: value.remark.split('*')[0] * 1
        }
    }

    //魔法棒初期设置最大和最小值
    makeValueRange(dom, value) {
        let data = value
        let setyz = require('../../modal/setyz/setyz')
        let setyzControl = this.app.loadModal(setyz, {
            adv: false,
            class: "sm",
            data: data.property
        })
        setyzControl.event._addEvent('modal.confirm', () => {
            let mm = JSON.parse(data.property)
                //console.log(mm, setyzControl.data)
            if (setyzControl.data.yzmin * 1 > setyzControl.data.yzmax * 1) {
                setyzControl.showError('最小值大于最大值')
                return
            }
            if (setyzControl.data.yzmin * 1 < mm.yzmin * 1 || setyzControl.data.yzmax * 1 > mm.yzmax * 1) {
                setyzControl.showError('填写的值不在预设值范围内')
                return
            }
            if (this.toBtn_choose(dom)) {
                this.chooseData.fun = dom.attr('fun')
                this.chooseData.data.userChoose = setyzControl.data
                setyzControl.close()
                this.event._dispatch('dicommenu.choose')
            }
        })
    }

    //工具栏的选择状态
    toBtn_choose(dom) {
        if (dom.attr('close') == 'close') {
            return false
        }
        this.dom.find('.dropNid').hide()
            //console.log(this.tool.data)
        let btnStauts = ""
        if (dom.find('i').attr('enable') == 'enable') {
            let hasClass = dom.hasClass('choose')
            this.dom.find('.dicommenu .fun_btn').removeClass('choose')
            this.dom.find('.dicommenu .fun_btn_spice').removeClass('choose')
            if (!hasClass) {
                dom.addClass('choose')
                btnStauts = "choose"
            } else {
                btnStauts = "cancel"
            }
            //this.dom.find('.dicommenu .fun_btn').removeClass('choose')
            //this.dom.find('.dicommenu .fun_btn_spice').removeClass('choose')

        }
        //console.log(this.tool.data)
        if (dom.find('.chooseDate').dom) {
            dom.find('.dropNid').css({
                'margin-top': 50
            })
        }
        if (dom.attr('fun') == "brush" || dom.attr('fun') == "earse") {
            if (btnStauts == "choose") {
                this.chooseData.data = this.tool.data[dom.attr('fun')][0]
            } else {
                this.chooseData = {}
                return false
            }
            return true
        }
        if (this.tool.data[dom.attr('fun')]) {
            if (this.tool.data[dom.attr('fun')].length > 1) {
                if (btnStauts == "choose") {
                    dom.find('.dropNid').show()
                    return null
                } else {
                    dom.find('.dropNid').hide()
                    return false
                }
            }
            if (btnStauts == "choose") {
                this.chooseData.data = this.tool.data[dom.attr('fun')][0]
            } else {
                this.chooseData = {}
                return false
            }
        }
        return true
    }
    resetAll() {
            this.dom.find('.dicommenu .fun_btn').removeClass('choose')
        }
        //设置窗宽窗位值
    set_wl(w, c) {
            //this.dom.find('.wl_text input').eq(0).val(w)
            //this.dom.find('.wl_text input').eq(1).val(c)
            this.chooseData.wl = {
                w: w ? w : null,
                c: c ? c : null
            }
        }
        //控制菜单开关，决定那个菜单打开
    openadd(data, value) {
        //console.log(data)
        let dom = this.dom.find('.dicommenu li[fun=' + value + ']')
        dom.removeAttr('close')
        dom.removeAttr('style')
        dom.attr('title', dom.attr('title').split(' ')[0])
            //console.log(data, 'dataaaaaaaaaaaaaaaa', value, this.tool.data[value], this.tool.data)
        if (this.tool.data[value]) {
            //this.tool.data[value]
        } else {
            this.tool.data[value] = data
            if (this.tool.data[value].length > 1 && value != 'brush' && value != 'earse' && value != 'screen' && value != 'mpr') {
                //console.log('aaaa')
                this.dom.find('li[fun="' + value + '"] .dropNid').remove()
                this.dom.find('li[fun="' + value + '"]').append('<div class="dropNid"></div>')
                let htmlS = ''
                let LESION = Tool.configxlkformat(this.app.constmap.LESION)
                for (let i = 0; i < this.tool.data[value].length; i++) {
                    let who = LESION.find((res) => {
                        return res.idx == this.tool.data[value][i].imageAnnotation
                    })
                    who.optionname = who.name
                    htmlS += '<li data="' + i + '" funName="' + value + '">' + who.val + '</li>'
                }
                this.dom.find('li[fun="' + value + '"] .dropNid').html(htmlS)
                let that = this
                this.dom.find('li[fun="' + value + '"] .dropNid li').on('click', function(e) {
                    e.stopPropagation()
                    let dom = ES.selctorDoc(this)
                    that.chooseData.fun = dom.attr('funName')
                    that.chooseData.data = that.tool.data[dom.attr('funName')][dom.attr('data')]
                    console.log('==============')
                    that.dom.find('.dropNid').hide()
                    that.event._dispatch('dicommenu.choose')
                })
            }
        }
        //console.log('aaaa,bb')
        /*if (dom.find('input').dom) {
            dom.find('input').removeAttr('readonly')
        }*/
    }
}
module.exports = dicommenu;
