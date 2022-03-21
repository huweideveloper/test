require('./selectcontrols.less')
// var html = require('./tpl.html')

class selectcontrols extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "selectcontrols"
    }
    complete() {
        this.bindxlkli();
        this.addevent()
        this.hasinput = {}
        let that = this;
        this.dom.find('.inputBox').on('change', function() {
            that.hasinput[ES.selctorDoc(this).attr('class')] = ES.selctorDoc(this).val()
        })
      console.log(that.nowParam)
      switch (that.nowParam.controlType) {
        case 'radiobox':
          that.dom.find('.wspan').html('单选框标题')
          that.dom.find('.selectcontrols').addClass('radioboxarea')
          break;
        case 'select':
          that.dom.find('.selectcontrols').addClass('selectarea')
          break;
      }
    }
    addevent() {
        let that = this;
        that.dom.find('.labelsinput').on('keydown', function(e) {
            let keyCode = e.keyCode
            if (event.keyCode === 13) {
                if (ES.selctorDoc(this).val() != '') {
                    that.createlabel(ES.selctorDoc(this).val())
                }
            }
        })
        that.dom.find('.labelsarea').on('blur', function() {
            if (ES.selctorDoc(this).val() != '') {
                that.createlabel(ES.selctorDoc(this).val())
            }
        })
        that.dom.find('.labelsarea').on('click', function() {
            // that.dom.find('.labelsinput').focus();
            $('.labelsinput').focus();
        })
        that.dom.find('.labelsinput').on('input', function() {
            that.dom.find('.labelitem .icon-guanbi').off('click');
            that.event._dispatch('controls.inputlabel', { val: ES.selctorDoc(this).val() });
        })
        that.dom.find('.check-box').on('click', function() {
            if (ES.selctorDoc(this).hasClass('choose')) {
                ES.selctorDoc(this).removeClass('choose')
            } else {
                ES.selctorDoc(this).addClass('choose')
            }
        })
    }
    bindlabeldelete() {
        let that = this;
        that.dom.find('.labelitem .icon-guanbi').on('click', function() {
            ES.selctorDoc(this).parent().parent().remove();
        })
    }
    bindxlkli() {
        let that = this;
        that.dom.find('.icon-tianjia').on('click', function() {
            that.dom.find('.itemarea').append('<li class="item">\n' +
                '<p class="inputLine" redlabel="inputBox">'+
                '<label class="redstar">*</label>' +
                '                    <span class="num">选项<label>' + (that.dom.find('.selectmain .item').dom.length + 1) + '</label></span>\n' +
                '                    <input type="text" class="item' + (that.dom.find('.selectmain .item').dom.length + 1) + 'value inputBox " check="empty" api="value"/>\n' +
                '</p>'+
                '<p class="inputLine" redlabel="inputBox">'+
                '<label class="redstar">*</label>\n' +
                '                <span>默认值</span>\n' +
                '                <input type="text" class="item' + (that.dom.find('.selectmain .item').dom.length + 1) + 'code inputBox " check="empty|num" api="code" reg ="/^[0-9]*$/" error="请输入大于等于0的整数"/>' +
                '                    <i class="iconfont icon-shanchu"></i>\n' +
                '</p>'+
                '                </li>');
            that.dom.find('.icon-tianjia').off('click');
            if (that.dom.find('.item').dom.length > 1&&that.nowParam.type!=='correct') {
                that.dom.find('.icon-shanchu').removeClass('hide')
            }
            console.log('aaaaa')
            that.bindxlkli();
            that.event._dispatch('controls.heightchange');
        })
        that.dom.find('.icon-shanchu').on('click', function() {
            ES.selctorDoc(this).parent().parent().remove();
            if (that.dom.find('.item').dom.length < 2) {
                that.dom.find('.icon-shanchu').addClass('hide')
            }
            that.dom.find('.item').dom.forEach(function(val, idx) {
                console.log(ES.selctorDoc(val).dom, 'number');
                ES.selctorDoc(val).dom.find('.num label').html(idx + 1 + '');
            })
            that.event._dispatch('controls.heightchange');
        })
    }
    checkrequired() {
        let that = this;
        that.dom.find('.inputLine').dom.forEach(function(val, idx) {
            val.find('.' + val.attr('redlabel')).removeClass('redborder')
            val.find('.required').remove();
            if (Tool.checkForm(ES.selctorDoc(val).dom, 'red') !== '') {
                console.log(val.attr('redlabel'))
                val.find('.' + val.attr('redlabel')).addClass('redborder')
                val.find('.' + val.attr('redlabel')).after('<span class="required">' + Tool.checkForm(ES.selctorDoc(val).dom, 'red') + '</span>')
            }
        })
        if (that.dom.find('.redborder').dom) {
            return false
        } else {
            let result=that.returndata()
            if (result) {
                return result
            }else{
                return false;
            }
        }
    }
    returndata() {
        let that = this;
        let obj = {}
        obj.type = that.nowParam.controlType;
        obj.name = that.dom.find('.xialaname').val();
        obj.parameter = {}
        obj.parameter.isdefault = that.dom.find('.isdefault').hasClass('choose');
        obj.parameter = JSON.stringify(obj.parameter)
        let arr = []
        if (that.dom.find('.labelsarea .labelitem').dom) {
            that.dom.find('.labelsarea .labelitem').dom.forEach(function(val, idx) {
                if (val.attr('dataid')) {
                    arr.push(parseInt(val.attr('dataid')))
                }
            })
        }
        obj.tagIdList = arr;
        obj.data = [];
        let tempStr = ','
        let tempStr1 = ','
        let flag = true;
        that.dom.find('.itemarea li').dom.forEach(function(val, idx) {
            console.log(val,'val')
            if (tempStr.lastIndexOf(','+val.find('input[api=code]').val()+',') != -1) {
                val.find('input[api=code]').addClass('redborder');
                val.find('input[api=code]').val('')
                val.find('input[api=code]').after('<span class="required">重复</span>')
                flag = false;
                return;
            }
            if (tempStr1.lastIndexOf(','+val.find('input[api=value]').val()+',') != -1) {
                val.find('input[api=value]').addClass('redborder');
                val.find('input[api=value]').val('')
                val.find('input[api=value]').after('<span class="required">重复</span>')
                flag = false;
                return;
            }
            tempStr += val.find('input[api=code]').val() + ','
            tempStr1 += val.find('input[api=value]').val() + ','
            let obj1 = {}
            console.log(val,val.find('input[api=value]').val(),val.find('input[api=code]').val())
            obj1.text = val.find('input[api=value]').val();
            obj1.code = val.find('input[api=code]').val();
            obj.data.push(obj1)
        })
        obj.data = JSON.stringify(obj.data)
        if (flag) {
            return obj;
        } else {
            return false;
        }
    }
    render(value) {
        console.log(value)
        let that = this;
        that.dom.find('.xialaname').val(value.name)
        if (JSON.parse(value.parameter).isdefault) {
            that.dom.find('.isdefault').click();
        }
        JSON.parse(value.data).forEach(function(val, idx) {
            if (idx != JSON.parse(value.data).length - 1) {
                that.dom.find('.icon-tianjia').click();
            }
            that.dom.find('.item' + (idx*1 + 1) + 'value').val(val.text);
            that.dom.find('.item' + (idx*1 + 1) + 'code').val(val.code);
        })
        value.tagList.forEach(function(val, idx) {
            let label = '<span class="labelitem" dataid="' + val.id + '">\n' +
                '                            <label>' + val.text + '</label>\n' +
                '                            <span><i class="iconfont icon-guanbi"></i></span>\n' +
                '                        </span>';
            that.dom.find('.labelsinput').before(label)
        })
        that.bindlabeldelete();
    }
    labelul(value) {
        let that = this;
        let html = ''
        if (value) {
            value.forEach(function(val, idx) {
                html += '<li class="labelli" dataid="' + val.id + '">' + val.text + '</li>'
            })
            that.dom.find('.labelul').html(html)
            that.dom.find('.labelli').on('click', function() {
                ES.selctorDoc(this).parent().html('')
                that.createlabel(ES.selctorDoc(this).html(), ES.selctorDoc(this).attr('dataid'))
            })
        } else {
            that.dom.find('.labelul').html('')
        }

    }
    createlabel(value, value2) {
        let that = this;
        that.hasinput.tagList = ''
        if (that.dom.find('.mask').dom) that.dom.find('.mask').addClass('hide')
        that.dom.find('.labelul').html('')
        that.dom.find('.tips').css({ 'color': '#666' })
        if (that.dom.find('.labelitem').dom && that.dom.find('.labelitem').dom.length >= 10) {
            that.dom.find('.tips').css({ 'color': 'red' })
            that.dom.find('.labelsinput').val('');
        } else {
            let label = '<span class="labelitem" dataid="' + value2 + '">\n' +
                '                            <label>' + value + '</label>\n' +
                '                            <span><i class="iconfont icon-guanbi"></i></span>\n' +
                '                        </span>';
            that.dom.find('.labelsinput').before(label)
            if (!value2) {
                that.event._dispatch('controls.createlabel', { val: that.dom.find('.labelsinput').val() });
            }
            that.dom.find('.labelitem .icon-guanbi').off('click');
            that.bindlabeldelete();
            that.dom.find('.labelsinput').val('')
            that.event._dispatch('controls.heightchange');
            that.hasinput.tagList = 'yes'
        }

    }
    setid(value1, value2) {
        let that = this;
        that.dom.find('.labelitem').dom.forEach(function(val, idx) {
            if (val.find('label').html() == value2) {
                val.attr('dataid', value1)
            }
        })
    }
    getisinput() {
        return this.hasinput
    }
}

//原型链一定要有的
module.exports = selectcontrols;
