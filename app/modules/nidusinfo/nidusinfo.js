class nidusinfo extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        require("./nidusinfo.less");
        this.html = require("./tpl.html");
        this.name = "nidusinfo"
        this.chooseData = {}
        this.doctorResult = {}
        this.reportControl = null
    }
    complete() {
        this.btnEvent()
        this.myScrollgood = null
        this.myScrollgood1 = null
        this.resize()
    }
    btnEvent() {
        let that = this
        this.dom.find('.btn-cancle').on('click', function() {
          that.hide()
          // 暴力方法，取消sequencelist的选中项
          $(".sequencelist .nodeInfo .choose").removeClass('choose')
        })
    }
    clearRemark(){
        this.dom.find('.nidusinfo .remark input').val('')
    }
    updataReport(finding,conclusion){
        if(this.reportControl){
           this.reportControl.updataData(finding,conclusion)
        }
    }
    setLayerMarkData(value) {
      if (!value) return
      const markWrapperEl = $(".nidusinfo .socrll > div:first")
      if (!markWrapperEl.find('.layer-mark-wrapper').length) {
        markWrapperEl.prepend(`
          <div class="layer-mark-title" style="margin-top:6px">图层标注 [<span class="layer-mark-layernumber">1</span>]</div>
          <div class="layer-mark-wrapper"></div>`)
      }
      // this.dom.find('.layer-mark-wrapper').html('')
      this.makeOption(value, 'layer-mark-wrapper', true)
    }
    setData(value, name, report, modalneed) {
        this.chooseData = {}
        this.showReport = report ? (report.inspectSee||report.diagnosisIncome) : null
        if (this.showReport) {
            let reporta = require('../report/report.js')
            this.reportControl = this.app.loadModule(reporta, this.dom.find('.nidusinfo .report'), report)
        } else {
            this.dom.find('.report').html('')
        }

        if (report && report.remark) {
            if (this.app.parpam['type'].lastIndexOf("viewer") != -1) {
                this.dom.find('.nidusinfo .remark input').attr('readonly', 'readonly')
            }
            this.dom.find('.nidusinfo .remark input').val(report.seriesRemark?report.seriesRemark:'')
            this.dom.find('.nidusinfo .remark input').blur(() => {
                this.remarkRes = this.dom.find('.nidusinfo .remark input').val()
                this.event._dispatch('nidusinfo.remarkFinish')
            })
        } else {
            this.dom.find('.nidusinfo .remark').html('')
        }
        let mark = window.location.hash.lastIndexOf('/doctorAudEdit/') == -1 && window.location.hash.lastIndexOf('/mark/') == -1 && window.location.hash.lastIndexOf('/markview/') == -1 && window.location.hash.lastIndexOf('/markpreview/') == -1 && window.location.hash.lastIndexOf('/markseriesview/') == -1
        let dragCanvase = window.location.hash.lastIndexOf('/drapCanvas/') == -1 && window.location.hash.lastIndexOf('/drapCanvasCheck/') == -1 && window.location.hash.lastIndexOf('/drapCanvasView/') == -1
        if (mark && dragCanvase) {
            if (modalneed || JSON.stringify(value.annotationItemResultList) != "{}") {
                let endData = {}
                if (modalneed) {
                    for (var i in modalneed) {
                        endData = this.dealnidus(modalneed[i], i, value, endData)
                    }
                }
                const doctorId = value.annotationItemResultList.doctorId
                if (doctorId) {
                    endData = this.dealnidus(value.annotationItemResultList.orginannotationItemResultList, doctorId, value, endData)
                }
                this.makeMarkScroe(endData, doctorId)
            }
        }
        this.dom.find('.config_content').html('')
        this.dom.find('.socrll .node-name').html(name)
        this.makeOption(value, 'config_content')
        this.resize()
    }

    //需要循环的数组，医生id，组件的基础信息，装换成为的对象
    dealnidus(arr, doctorId, value, endData) {
        arr.map((item) => {
            if (value[item.formComponentId]) {
                if (!endData[item.formComponentId]) {
                    endData[item.formComponentId] = {
                        name: '',
                        res: []
                    }
                    endData[item.formComponentId].name = value[item.formComponentId].componentName
                }
                let data = JSON.parse(JSON.stringify(value[item.formComponentId]))
                data.doctorId = doctorId
                data.result = []
                data.codeResult = item.result
                if (item.result.lastIndexOf(',') != -1) {
                    item.result.split(',').map((res) => {
                        data.result.push(data.data ? data.data[res] : res)
                    })
                } else {
                    data.result = [data.data ? data.data[item.result*1] : item.result]
                }
                endData[item.formComponentId].res.push(data)
            }
        })
        return endData
    }

    // 显示医生诊断的结果
    makeMarkScroe(value, doctorId = '') {
      this.doctorResult = value
      let str = '<div><ul class="mark_doctor_content">'

      // 没有配置标注信息的病灶要单独显示当前医生信息
      if (Object.keys(value).length === 0 && doctorId) {
        str += `<li><p class="niddle-z"><span>医生：${doctorId}</span></p></li>`
      }

      for (var i in value) {
          str += '<li>'
          str += '<p class="niddle-z"><span>' + value[i].name + '</span></p>'
          value[i].res.map((item) => {
              str += '<p><span>' + item.doctorId + '&nbsp;:&nbsp;</span>'
              item.result.map((info) => {
                  str += '<span>' + (info ? info : "未填") + '</span><br />'
              })
              str += '</p>'
          })
          str += '</li>'
      }
      str += '</ul></div>'
      this.dom.find('.config_content_all .socrll1').html(str)
      this.dom.find('.mark-score').removeClass('hide')
      this.myScrollgood1 = this.initScoll(this.dom.find('.mark-score .socrll1'))
    }

    clearAllLayerMarkChoosed() {
      this.dom.find('.nidusinfo .layer-mark-wrapper').find('.choose').removeClass('choose')
      for (let item in this.chooseData) {
        const tempObj = this.chooseData[item]
        tempObj.isImageTag && (tempObj.result = '')
      }
    }

    // 显示审核选项
    makeOption(value, chooseDom, isImageTag) {
        let paxu = {
            'c': {},
            'nc': {}
        }
        for (let key in value) {
            if (key !== 'annotationItemResultList') {
                const tempObj = value[key]
                isImageTag && (tempObj.isImageTag = true)
                let is = ['checkbox', 'radiobox'].includes(tempObj.type)
                paxu[`${is ? 'c' : 'nc' }`][tempObj.sequence] = tempObj
            }
        }
        let str = '<ul class="node_info">'
        let str1 = '<ul class="node_info">'
        const radioCheckBoxes = paxu['c']
        const isImageTagSetCompData = isImageTag && !!value.annotationItemResultList // 是否是imageTag类型给组件设置回显数据
        for (const key1 in radioCheckBoxes) {
          const item = radioCheckBoxes[key1]
          if (item) {
            item.isImageTagSetCompData = isImageTagSetCompData
            !isImageTagSetCompData && (str1 += this.returnHtmlDOM(item, item.id))
            this.makeBtn(item, item.id, value.annotationItemResultList ? value.annotationItemResultList[item.id] : null)
          }
        }
        const otherEls = paxu['nc']
        for (const key2 in otherEls) {
          const item = otherEls[key2]
          if (item) {
            item.isImageTagSetCompData = isImageTagSetCompData
            !isImageTagSetCompData && (str += this.returnHtmlDOM(item, item.id))
            this.makeBtn(item, item.id, value.annotationItemResultList ? value.annotationItemResultList[item.id] : null)
          }
        }
        str += '</ul>'
        str1 += '</ul>'
        !isImageTagSetCompData && this.dom.find('.' + chooseDom).append(`${str}${str1}<div style="clear:both"></div>`)
    }

    //对于生成好的组件绑定事件
    makeBtn(value, i, data) {
        setTimeout(() => {
            this.toDoneCompend(value, i, data)
        }, 0)
    }
    toDoneCompend(value, i, data) {
        const that = this
        const isImageTag = value.isImageTag // 判断当前是否是图层标记类型
        const isImageTagSetCompData = value.isImageTagSetCompData // 是否是imageTag类型给组件设置回显数据
        const componentVal = data ? data.result : ""

        switch (value.type) {
            case "select":
                require.ensure("../../moduleslibs/dropdown1/drop", function() {
                    let dropdown = require('../../moduleslibs/dropdown1/drop')
                    let woptions = [{
                      optionname: "请选择",
                      val: "请选择",
                      idx: ''
                    }]
                    let firstSelect = null
                    let componentData = JSON.parse(value.componentData)
                    componentData.map((item) => {
                        woptions.push({
                            optionname: item.text,
                            val: item.text,
                            idx: item.code
                        })
                        if (data) {
                            if (data.result*1 == item.code*1 && data.result != "") {
                                firstSelect = {
                                    optionname: item.text,
                                    val: item.text,
                                    idx: item.code
                                }
                            }
                            if (data.result == "") {
                                firstSelect = {
                                    optionname: "请选择",
                                    val: "请选择",
                                    idx: ''
                                }
                            }
                        } else {
                            firstSelect = {
                                optionname: "请选择",
                                val: "请选择",
                                idx: ''
                            }
                            if (value.componentParameter && JSON.parse(value.componentParameter)) {
                                if (JSON.parse(value.componentParameter).isdefault) {
                                    firstSelect = woptions[0]
                                }
                            }
                        }
                    })
                    let guojihua = that.app.loadModule(dropdown, that.dom.find('li[nodezd="' + i + '"]').firstchildren('.drop_down_content'), {
                        className: "node-select",
                        firstSelect: (firstSelect ? firstSelect : woptions[0]),
                        data: woptions
                    })
                    that.chooseData[guojihua.dom.parent().attr('select_id')] = {
                        formComponentId: value.componentId,
                        result: (firstSelect ? firstSelect.idx : woptions[0].idx),
                        isImageTag
                    }
                    if (JSON.parse(value.componentParameter).isdefault && !data) {
                        if (window.location.hash.lastIndexOf('#!/markaudit/') == -1 || window.location.hash.lastIndexOf('#!/drapCanvasAudEdit/') == -1) {
                            that.event._dispatch('nidusinfo.finish', isImageTag)
                        } else {
                            that.event._dispatch('nidusinfo.finish', true)
                        }
                    }
                    guojihua.event._addEvent('dropDown.clear', function() {
                        that.chooseData[guojihua.dom.parent().attr('select_id')].result = ''
                        const selectCurrentEl = that.dom.find('li[nodezd="' + i + '"]').firstchildren('.drop_down_content').find('.nowname')
                        selectCurrentEl.val('')
                        selectCurrentEl.attr('placeholder', '请选择')
                        selectCurrentEl.attr('data-idx', '')
                        that.event._dispatch('nidusinfo.finish', isImageTag)
                    })
                    guojihua.event._addEvent('option.click', function(res) {
                        const selectedIdx = res.idx || ''
                        if (guojihua.dom.parent().attr('select_id') == 'check_reslut' && res.idx * 1 == 0) {
                            that.syncResult()
                        }
                        that.chooseData[guojihua.dom.parent().attr('select_id')].result = selectedIdx.includes('props=') ? '' : selectedIdx // 下拉框当选择的是“请选择”选项，对应的value竟然是props=，需传空
                        that.event._dispatch('nidusinfo.finish', isImageTag)
                    })
                    if (that.app.parpam['type'].lastIndexOf("viewer") != -1) {
                        guojihua.disable()
                    }
                })
                break
            case "text":
              this.chooseData[value.id] = {
                result: componentVal,
                formComponentId: value.componentId,
                isImageTag
              }
              const inputTextEl = this.dom.find('li[nodezd="' + i + '"] input[name=input-text]')
              inputTextEl.blur(() => {
                this.chooseData[value.id].result = inputTextEl.val()
                this.event._dispatch('nidusinfo.finish', isImageTag)
              })
              inputTextEl.val(componentVal)
              if (this.app.parpam['type'].lastIndexOf("viewer") != -1) {
                inputTextEl.attr('readonly', 'readonly')
              } else {
                // 处理鼠标悬浮显示清除按钮
                const inputTextWrapperEl = inputTextEl.parent()
                const clearBtnEl = inputTextWrapperEl.find('.icon-shanchutishiicon')
                inputTextWrapperEl.on('mouseenter', () => {
                  inputTextEl.val() && clearBtnEl.show()
                })
                inputTextWrapperEl.on('mouseleave', () => {
                  clearBtnEl.hide()
                })
                // 点击清除输入框内容
                clearBtnEl.on('click', (e) => {
                  e.stopPropagation()
                  inputTextEl.val('')
                  this.chooseData[value.id].result = ''
                  this.event._dispatch('nidusinfo.finish', isImageTag)
                })
              }
              break
            case "radiobox":
                this.chooseData[value.id] = {
                    result: componentVal,
                    formComponentId: value.componentId,
                    isImageTag
                }
                let componentData = JSON.parse(value.componentData)
                if (JSON.parse(value.componentParameter).isdefault && !data) {

                }
                if (data) {
                    componentData.map((item) => {
                        const tempItem = this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + item.code + '"]')
                        if (data.result && data.result*1 == item.code) {
                          !tempItem.hasClass('choose') && tempItem.addClass('choose')
                        } else {
                          tempItem.hasClass('choose') && tempItem.removeClass('choose')
                        }
                    })
                } else {
                    if (value.componentParameter && JSON.parse(value.componentParameter)) {
                      // 设置默认值
                        if (JSON.parse(value.componentParameter).isdefault) {
                            this.chooseData[value.id].result = componentData[0].code
                            this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + componentData[0].code + '"]').addClass('choose')
                            this.event._dispatch('nidusinfo.finish', isImageTag)
                        }
                    } else {
                      // 数据清空
                      componentData.map((item) => {
                        const tempItem = this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + item.code + '"]')
                        tempItem.hasClass('choose') && tempItem.removeClass('choose')
                      })
                    }
                }
                // isImageTagSetCompData 表示是设置图层标注组件值，不需要添加事件
                if (this.app.parpam['type'].lastIndexOf("viewer") != -1 || isImageTagSetCompData) {
                    return
                }

                const radioboxDom = this.dom.find('li[nodezd="' + i + '"]').find('.radiobox')
                radioboxDom.off('click')
                radioboxDom.on('click', function() {
                    const dom = ES.selctorDoc(this)
                    const sid = dom.parent().parent().attr('select_id')
                    if (dom.hasClass('choose')) {
                      dom.removeClass('choose')
                      that.chooseData[sid].result = ''
                    } else {
                      that.dom.find('li[nodezd="' + i + '"]').find('.radiobox').removeClass('choose')
                      dom.addClass('choose')
                      that.chooseData[sid].result = dom.attr('code')
                    }
                    that.event._dispatch('nidusinfo.finish', isImageTag)
                })
                break
            default:
                this.chooseData[value.id] = {
                    result: (data ? (',' + data.result + ',') : ""),
                    formComponentId: value.componentId,
                    isImageTag
                }
                if (data) {
                    data.result.split(',').map((item) => {
                        this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + item + '"]').addClass("choose")
                    })
                }
                if (this.app.parpam['type'].lastIndexOf("viewer") != -1) {
                    return
                }
                this.dom.find('li[nodezd="' + i + '"]').find('.checkbox').on('click', function() {
                    let dom = ES.selctorDoc(this)
                    let type = dom.attr('type')
                    let sid = dom.parent().parent().attr('select_id')
                    if (dom.hasClass('choose')) {
                        dom.removeClass('choose')
                        that.chooseData[sid].result = that.chooseData[sid].result ? that.chooseData[sid].result.replace((',' + dom.attr('code') + ','), ',') : ""
                    } else {
                        if (type == "sp" && dom.attr('code') == -1) {
                            that.dom.find('li[nodezd="' + i + '"]').find('.checkbox').removeClass('choose')
                            that.chooseData[sid].result = (",-1,")
                        } else {
                            if (that.chooseData[sid].result == ",-1,") {
                                that.dom.find('li[nodezd="' + i + '"]').find('div[code="-1"]').removeClass('choose')
                                that.chooseData[sid].result = (',' + dom.attr('code') + ',')
                            } else {
                                that.chooseData[sid].result = that.chooseData[sid].result ? (that.chooseData[sid].result + dom.attr('code') + ',') : (',' + dom.attr('code') + ',')
                            }
                        }
                        dom.addClass('choose')
                    }
                    that.event._dispatch('nidusinfo.finish', isImageTag)
                })
                break
        }
    }
    //同步结果
    syncResult() {
        for (var i in this.doctorResult) {
            let orginComp = this.doctorResult[i]
            if (!this.chooseData[i]) {
                this.chooseData[i] = {
                    annotationItemId: i,
                    formComponentId: i,
                    id: i,
                    result: ""
                }
            }
            if (orginComp.res) {
                let ctype = this.dom.find('li[nodezd="' + i + '"]').attr('ctype')
                switch (ctype) {
                    case "select":
                        this.chooseData[i].result = orginComp.res[0].codeResult
                        this.dom.find('li[nodezd="' + i + '"]').firstchildren('.drop_down_content').find('.nowname').val(this.doctorResult[i].res[0].result[0])
                        break
                    case "text":
                        this.chooseData[i].result = orginComp.res[0].codeResult
                        this.dom.find('li[nodezd="' + i + '"] input[name=input-text]').val(orginComp.res[0].codeResult)
                        break
                    case "radiobox":
                        this.chooseData[i].result = orginComp.res[0].codeResult
                        this.dom.find('li[nodezd="' + i + '"] .radiobox').removeClass('choose')
                        this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + orginComp.res[0].codeResult+ '"]').addClass("choose")
                        break
                    default:
                        this.chooseData[i].result = ',' + orginComp.res[0].codeResult + ','
                        this.dom.find('li[nodezd="' + i + '"] .checkbox').removeClass("choose")
                        orginComp.res[0].codeResult.split(',').map((item) => {
                            if (item) {
                                this.dom.find('li[nodezd="' + i + '"]').find('div[code="' + item + '"]').addClass("choose")
                            }
                        })
                        break
                }
            }
        }
    }
    returnHtmlDOM(value, name) {
        let className = (value.type.lastIndexOf('checkbox') != -1 || value.type.lastIndexOf('radiobox') != -1) ? "select-content1" : 'select-content'
        let domstr = `<li ctype="` + value.type + `" select_id="` + value.id + `" class="` + className + `" nodezd="` + name + `"><p class="niddle-z" title="` + value.name + `">`
        if (value.optional) {
            domstr += `<span style="color:#f00">*</span><span>` + value.name + `</span></p>`
        } else {
            domstr += `<span>` + value.name + `</span></p>`
        }
        switch (value.type) {
            case "select":
                if (value.relation) {
                    domstr += '<div class="drop_down_content"></div>' //<p style="border:1px solid #ccc;padding: 0; width: 90px;height:20px;" class="showD"></p>'
                } else {
                    domstr += '<div class="drop_down_content"></div>' //'<p style="border:1px solid #ccc;padding: 0; width: 90px;height:20px;" class="showD"></p>'
                }
                break
            case "text":
                domstr += '<p><input class="input-t" value="" name="input-text"></input><i class="iconfont icon-shanchutishiicon" style="display: none"></i></p>'
                break
            case "textarea":
                domstr += '<textarea class="input-tex" value="" name="input-text"></textarea>'
                break
            case "text-s":
                domstr += '<input class="input-r" readonly="readonly" value=""></input>'
                break
            case "radiobox":
                for (var j in value.data) {
                    domstr += `<div class="check-choose"><div class="radiobox radio-box" code="` + j + `" data-ini="` + value.data[j] + `"></div><span title="${value.data[j]}">` + value.data[j] + `</span></div>`
                }
                //domstr += '<input value=""></input>'
                break
            case "checkbox":
                for (var j in value.data) {
                    domstr += `<div class="check-choose"><div class="checkbox check-box" code="` + j + `" data-ini="` + value.data[j] + `"></div><span title="${value.data[j]}">` + value.data[j] + `</span></div>`
                }
                //domstr += '<input value=""></input>'
                break
            case "checkbox-sp":
                for (var j in value.data) {
                    domstr += `<div class="check-choose"><div class="checkbox check-box" type="sp" code="` + j + `" data-ini="` + value.data[j] + `"></div><span title="${value.data[j]}">` + value.data[j] + `</span></div>`
                }
                //domstr += '<input value=""></input>'
                break
        }
        domstr += `</li>`
        return domstr
    }
    resize() {
        let ch = ES.selctorDoc(window).box().clientHeight - 60 - 64
        if (this.showReport) {
            ch = ch - 160
        }
        this.dom.find('.mark-score .socrll1').css({
            'height': ch - 55
        })
        this.dom.find('.nidusinfo').firstchildren('.socrll').css({
            'height': ch - 35
        })
        if (this.myScrollgood) {
            this.myScrollgood.refresh()
            return
        }
        if (this.myScrollgood1) {
            this.myScrollgood1.refresh()
            return
        }
        this.myScrollgood = this.initScoll(this.dom.find('.nidusinfo .socrll'))
        this.myScrollgood1 = this.initScoll(this.dom.find('.mark-score .socrll1'))
    }
    initScoll(dom) {
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        dom.attr('id', rid)
        let val = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
        return val
    }
    showClose() {
      this.dom.find('.btn_content').eq(0).removeClass('hide')
    }
    show() {
      this.dom.show()
    }
    isShow() { // 当前dom是否显示
      return this.dom.attr('style').lastIndexOf('none') === -1
    }
    hide() {
      this.dom.hide()
    }
}

module.exports = nidusinfo;
