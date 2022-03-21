require('./projectGroupSet.less')

// var html = require('./tpl.html')

class projectGroupSet extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "projectGroupSet"
        this.data = []
        this.DayToMillisecond = 86400000
    }

    complete() {
        this.index = 0
        this.liArr = [{ type: 'NON_TIME' }]
        this.objArr = []
        this.initConditionHtml = this.dom.find('.condition').html()
        this.condition = this.nowParam.conditions
        this.dropdown = require("../../moduleslibs/dropdown1/drop.js")
        this.render()
    }

    render() {
        this.dom.find('.groupSet').on('click', (e) => {
            if (this.dom.find('.projectGroupSet .item').dom.length < 3) {
                this.addHtml(true)
                this.addli(this.index)
            } else {
                this.dom.find('.projectGroupSet .icon-tianjia').after('<span class="required">最多可选择三个聚合条件</span>')
            }
        })
        this.dom.find('.condition').on('click', (e) => {
            if (e.target.nodeName == 'I') {
                ES.selctorDoc(e.target).parent().remove()
                this.liArr[ES.selctorDoc(e.target).parent().attr('data-id')].delete = 2
            }
        })
        this.dom.find('.condition').on('change', (e) => {
            if (e.target.nodeName == 'INPUT') {
                ES.selctorDoc(e.target).removeClass('redborder')
                this.liArr[ES.selctorDoc(e.target).parent().parent().attr('data-id')].limitTime = (ES.selctorDoc(e.target).val() == "" ? ES.selctorDoc(e.target).val() : ES.selctorDoc(e.target).val() * this.DayToMillisecond)
            }
        })
        this.addli(this.index)
    }
    errorShow(msg) {
      this.dom.find('.projectGroupSet .icon-tianjia').after('<span class="required">'+msg+'</span>')
    }
    addHtml(reset) {
        this.index++;
        let html = '<li class="item item' + this.index + '" data-id="' + this.index + '">\n' +
            '            <div class="inputLine" redlabel="xlk">\n' +
            '                <div class="conditions" title="聚合条件" check="empty"></div>\n' +
            '            </div>' +
            '            <i class="icon-shanchu iconfont"></i>' +
            '        </li>'
        this.dom.find('.condition').append(html)
        if (reset) {
            this.liArr[this.index] = { type: 'NON_TIME' }
        }
    }

    addli(idx) {
        let itemobj = {}
        itemobj.conditions = this.app.loadModule(this.dropdown, this.dom.find('.item' + idx + ' .conditions'), {
            className: 'xlk',
            firstSelect: { val: '', idx: '' },
            data: this.condition
        })
        itemobj.conditions.event._addEvent('option.click', (value) => {
            this.liArr[idx] = this.liArr[idx] ? this.liArr[idx] : {}
            this.liArr[idx].field = value.idx.split(',')[0]
            this.liArr[idx].dataType = value.props
            if (value.props == 'Date') {
                this.dom.find('.item' + idx + ' .timeType').remove()
                this.dom.find('.item' + idx).append('<div class="inputLine" redlabel="xlk"><div class="timeType" title="时间类型" check="empty"></div></div>')
                itemobj.timeType = this.app.loadModule(this.dropdown, this.dom.find('.item' + idx + ' .timeType'), {
                    className: 'xlk',
                    firstSelect: { val: '', idx: '' },
                    data: [{ val: '自然时间', idx: 'NATURE_TIME' }, { val: '逻辑时间', idx: 'LOGICAL_TIME' }, { val: '非时间字段', idx: 'NON_TIME' }]
                })
                itemobj.timeType.event._addEvent('option.click', (timeType) => {
                  if(this.dom.find('.item' + idx + ' .dimensionxlk').dom){
                    this.dom.find('.item' + idx + ' .dimensionxlk').parent().remove()
                  }
                    if(this.dom.find('.item' + idx + ' .dimensioninput').dom){
                      this.dom.find('.item' + idx + ' .dimensioninput').parent().remove()
                    }
                    this.liArr[idx].type = timeType.idx
                    if (timeType.idx == 'NATURE_TIME') {
                        this.dom.find('.item' + idx).append('<div class="inputLine" redlabel="xlk"><div class="dimensionxlk" title="维度" check="empty"></div></div>')
                        this.liArr[idx].limitTime = null
                        itemobj.dimensionxlk = this.app.loadModule(this.dropdown, this.dom.find('.item' + idx + ' .dimensionxlk'), {
                            className: 'xlk',
                            firstSelect: { val: '', idx: '' },
                            data: [{ val: '按年', idx: 'YEAR' }, { val: '按季度', idx: 'QUARTER' }, { val: '按月', idx: 'MONTH' }, {
                                val: '按周',
                                idx: 'WEEK'
                            }, { val: '按日', idx: 'DAY' }, { val: '按小时', idx: 'HOUR' }]
                        })
                        itemobj.dimensionxlk.event._addEvent('option.click', (dimensionxlk) => {
                            this.liArr[idx].unit = dimensionxlk.idx
                        })
                    } else if (timeType.idx == 'LOGICAL_TIME') {
                        this.liArr[idx].unit = null
                        this.dom.find('.item' + idx).append('<div class="inputLine" redlabel="inputBox"><input class="dimensioninput inputBox" type="text" check="empty|int"/><label class="dayunit">天</label></div>')
                    }
                })
            } else {
                this.liArr[idx].type = 'NON_TIME'
                if(this.dom.find('.item' + idx + ' .timeType').dom) {
                  this.dom.find('.item' + idx + ' .timeType').parent().remove()
                }
                if(this.dom.find('.item' + idx + ' .dimensionxlk').dom){
                  this.dom.find('.item' + idx + ' .dimensionxlk').parent().remove()
                }
                if(this.dom.find('.item' + idx + ' .dimensioninput').dom){
                  this.dom.find('.item' + idx + ' .dimensioninput').parent().remove()
                }
            }
        })
        this.objArr.push(itemobj)

    }

    setData(value, type) {
        this.liArr = value
        value.forEach((val, idx) => {
            if (idx !== value.length && idx !== 0 && val !== null) {
                this.addHtml()
                //this.addli(this.index)
                this.addli(idx)
            } else if (val == null) {
                return;
            }
            this.dom.find('.item' + idx + ' .conditions .option[data-idx="' + val.field + '"]').click()
            if (val.dataType == 'Date') {
                this.dom.find('.item' + idx + ' .timeType .option[data-idx="' + val.type + '"]').click()
                if (val.unit && val.type == 'NATURE_TIME') {
                    this.dom.find('.item' + idx + ' .dimensionxlk .option[data-idx="' + val.unit + '"]').click()
                } else if (val.limitTime && val.type == 'LOGICAL_TIME') {
                    this.dom.find('.item' + idx + ' .dimensioninput').val(val.limitTime / this.DayToMillisecond)
                    if (type == 'view') {
                        this.dom.find('.item' + idx + ' .dimensioninput').attr('readonly', 'readonly')
                        this.dom.find('.item' + idx + ' .dimensioninput').css({ "background": "#e8e8e8" })
                    }
                }
            }
        })
        if (type == 'view' && this.objArr) {
            this.objArr.map((item) => {
                if (item.conditions) {
                    item.conditions.disable()
                }
                if (item.timeType) {
                    item.timeType.disable()
                }
                if (item.dimensionxlk) {
                    item.dimensionxlk.disable()
                }
            })
        }
    }

    reset() {
      this.dom.find('.condition').html(this.initConditionHtml)
      this.index = 0
      this.liArr = [{ type: 'NON_TIME' }]
      this.objArr = []
      this.condition = this.nowParam.conditions
      this.addli(this.index)
      const required = this.dom.find('.required')
      if (required.dom) required.remove()
    }

    resetAndDisable(beforeFn) {
      this.reset()
      this.disable()
      beforeFn && beforeFn()
    }

    disableAll() {
      ES.selctorDoc('.icon-shanchu').addClass('hide');
      ES.selctorDoc('.icon-tianjia').addClass('hide');
    }

    able() {
      this.dom.find('.conditions .icon-shanchu').removeClass('hide');
      this.dom.find('.conditions .icon-tianjia').removeClass('hide');
      this.dom.find('.conditions .nowname').removeClass('drop_disabled');
      this.dom.find('.conditions .drop-down').removeClass('drop_disabled');
    }

    disable() {
      this.dom.find('.conditions .icon-shanchu').addClass('hide');
      this.dom.find('.conditions .icon-tianjia').addClass('hide');
      this.dom.find('.conditions .nowname').addClass('drop_disabled');
      this.dom.find('.conditions .drop-down').addClass('drop_disabled');
    }

}

//原型链一定要有的
module.exports = projectGroupSet;
