import Big from 'big.js'
import XLSX from 'xlsx'

var tool = {
  //千分位
  numFormat: function(num) {
    var num = (num || 0).toString(),
      result = ''
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
    }
    if (num) {
      result = num + result
    }
    return result
  },
  //数组求和
  sumArray: function(value) {
    return eval(value.join('+'))
  },
  //深度克隆
  objetClone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : null
  },
  //添加对象
  addObject: function(value, who) {
    for (var k in value) {
      if (value[k]) {
        who[k] = value[k]
      }
    }
  },
  calAngel(line1, line2) {
    let k1 = (line1.start.y - line1.end.y) / (line1.start.x - line1.end.x)
    let k2 = (line2.start.y - line2.end.y) / (line2.start.x - line2.end.x)
    return ((180 * Math.atan(Math.abs((k1 - k2) / (1 + k1 * k2)))) / Math.PI).toFixed(2)
  },
  calDis(pa) {
    let k1 = (pa[0].start.y - pa[1].start.y) / (pa[0].start.x - pa[1].start.x)
    let b1 = pa[0].start.y - k1 * pa[0].start.x
    let dis = (k1 * pa[2].start.x - pa[2].start.y + b1) / Math.pow(k1 * k1 + 1, 0.5)
    return Math.abs(dis).toFixed(2)
  },
  //url处理转换成文件名
  changeToName: function(value, type) {
    type = type ? type : 'jpg'
    let rex = new RegExp('(\\/0*\\d{1,}.\\w{3,}$)', 'g')
    let url = value ? value.split('?')[0].match(rex)[0] : ''
    let pointNUm = url.split('.')[0].replace('/', '') * 1
    //let pointNUm = posArr[posArr.length - 1].indexOf('.')
    return pointNUm //posArr[posArr.length - 1].replace('.' + type, '') * 1
  },
  //url正则
  checkUrl: function(urlString) {
    if (urlString != '') {
      var reg = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      if (!reg.test(urlString)) {
        return false
        //alert("不是正确的网址吧，请注意检查一下");
      } else {
        return true
      }
    } else {
      return false
    }
  },
  //长数组对比
  comparison: function(oldA, newA) {
    if (!oldA) {
      if (newA) {
        return { noldA: newA, newA: newA, changeOld: [] }
      } else {
        return null
      }
    }
    var str = JSON.stringify(oldA).replace(/]$/, ',]')
    var newOld = []
    for (var i = 0; i < newA.length; i++) {
      var idstr = '"id":' + '"' + newA[i].id + '",'
      var indexIX = str.lastIndexOf(idstr)
      var temp = ''
      if (indexIX != -1) {
        temp = str.substr(indexIX)
        var newT = '{' + temp.substr(0, temp.indexOf('},{"id"')) + '}'
        if (newT != JSON.stringify(newA[i])) {
          newOld.push(newA[i].id)
          str = str.replace(newT, JSON.stringify(newA[i]))
        }
      }
    }
    return {
      oldA: JSON.parse(str.replace(/,]$/, ']')),
      changeOld: newOld,
      newA: newA
    }
  },

  stripscript: function(s) {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    if (regEn.test(s) || regCn.test(s)) {
      //alert("名称不能包含特殊字符.");
      return false
    }
    return true
  },
  //时间转换
  time: function(data, fromat) {
    var datavalue = data
    if (typeof datavalue == 'number') {
      datavalue = new Date(data)
    }
    if (fromat && fromat.length != 0) {
      fromat = fromat.replace(/yyyy/g, datavalue.getFullYear())
      fromat = fromat.replace(/mm/g, ('0' + (datavalue.getMonth() * 1 + 1)).slice(-2))
      fromat = fromat.replace(/dd/g, ('0' + datavalue.getDate() * 1).slice(-2))
      fromat = fromat.replace(/HH/g, ('0' + datavalue.getHours() * 1).slice(-2))
      fromat = fromat.replace(/MM/g, ('0' + datavalue.getMinutes() * 1).slice(-2))
      fromat = fromat.replace(/ss/g, ('0' + datavalue.getSeconds() * 1).slice(-2))
    } else {
      data.getFullYear() + '-' + ('0' + (data.getMonth() * 1 + 1)).slice(-2) + '-' + ('0' + data.getDate()).slice(-2)
    }
    return fromat
  },
  timestr(data, value) {
    value = value || [
      { num: 4, zf: '-' },
      { num: 2, zf: '-' },
      { num: 2, zf: ' ' },
      { num: 2, zf: ':' },
      { num: 2, zf: ':' },
      { num: 2, zf: '' }
    ]
    let str = ''
    let st = 0
    for (let i = 0; i < value.length; i++) {
      str += data.substr(st, value[i].num) + value[i].zf
      st += value[i].num
    }
    return str
  },

  //设置文本框的光标
  set_text_value_position: function(objId, spos) {
    var tobj = document.getElementById(objId)
    if (spos < 0) spos = tobj.value.length
    if (tobj.setSelectionRange) {
      //兼容火狐,谷歌
      setTimeout(function() {
        tobj.setSelectionRange(spos, spos)
        tobj.focus()
      }, 0)
    } else if (tobj.createTextRange) {
      //兼容IE
      var rng = tobj.createTextRange()
      rng.move('character', spos)
      rng.select()
    }
  },
  //获取文本框的光标
  get_txt_value_position: function(objId) {
    var oTxt1 = document.getElementById(objId)
    var cursurPosition = -1
    if (oTxt1.selectionStart) {
      //非IE浏览器
      cursurPosition = oTxt1.selectionStart
    } else {
      //IE
      var range = document.selection.createRange()
      range.moveStart('character', -oTxt1.value.length)
      cursurPosition = range.text.length
    }
    return cursurPosition
    //alert(cursurPosition);
  },
  //数字装换
  changeNumtoChina: function(value) {
    var numC = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三']
    return numC[value - 1]
  },
  //y轴单位转化
  getUnit: function(value, num) {
    if (value * 1 < 10000 && value >= 0) {
      if (value * 1 == 0) {
        return (0.0).toFixed(num ? num : 2)
      }
      return value.toFixed(num ? num : 2)
    } else if (value * 1 >= 10000 && value * 1 < 100000000) {
      return ((value * 1) / 10000).toFixed(num ? num : 2) + '万'
    } else if (value * 1 >= 100000000) {
      return ((value * 1) / 100000000).toFixed(num ? num : 2) + '亿'
    }
    if (value < 0 && value * 1 > -10000) {
      return value.toFixed(num ? num : 0)
    } else if (value * 1 <= -10000 && value * 1 > -100000000) {
      return ((value * 1) / 10000).toFixed(num ? num : 2) + '万'
    } else if (value * 1 <= -100000000) {
      return ((value * 1) / 10000).toFixed(num ? num : 2) + '亿'
    }
  },
  //单位的另外转换模式

  getUnitNew: function(value, max, min) {
    var objeC = {}
    if (min == 0) {
      objeC = Tool.getChuUnit(max)
    } else if (min > 0) {
      objeC = Tool.getChuUnit(min * 10)
    } else if (min < 0) {
      if (max > 0) {
        if (value > 0) {
          objeC = Tool.getChuUnit(max)
        } else {
          objeC = Tool.getChuUnit(Math.abs(min))
        }
      } else if (max <= 0) {
        objeC = Tool.getChuUnit(Math.abs(min))
      }
    }
    return value / objeC.chushu + objeC.danwei
  },

  getChuUnit: function(value) {
    var chushu = 0
    var danwei = ''
    if (value >= 100000000) {
      chushu = 100000000
      danwei = '亿'
    } else if ((value < 100000000) & (value >= 10000)) {
      chushu = 10000
      danwei = '万'
    } else {
      chushu = 1
    }
    return {
      chushu: chushu,
      danwei: danwei
    }
  },

  //对象克隆
  clone: function(value) {
    var temp = {}
    for (var k in value) {
      if (value[k] != undefined || value[k] != null) {
        temp[k] = value[k]
      }
    }
    return temp
  },
  //纯数值转换 format
  //[显示模式，小数位，千分位，单位]
  //所有的值都可以为空
  //显示模式分为： ‘显示数值’ ‘显示百分数’  这两种
  //顺序是先单位，随后小数位，随后千分位
  //单位代表以什么单位聚合，有4种情况  默认，无，万，千
  //小数位为保留几位小数
  //千分位为在数值上面增加，
  changeNumberByFromat: function(value, format) {
    if (!value && value != 0) {
      return '--'
    }
    value = value * 1
    var endNum
    if (format[0] == '显示百分数') {
      endNum = (value * 100).toFixed(format[1] ? format[1] : 0) + '%'
    } else {
      switch (format[3]) {
        case '无':
          endNum = value.toFixed(format[1] ? format[1] : 0)
          break
        case '万':
          endNum = (value / 10000).toFixed(format[1] ? format[1] : 0) + '万'
          break
        case '亿':
          endNum = (value / 100000000).toFixed(format[1] ? format[1] : 0) + '亿'
          break
        default:
          endNum = Tool.getUnit(value, format[1] ? format[1] : 0)
          break
      }
      if (format[2] == 1) {
        var num
        if (format[1] && format[1] != 0) {
          num = endNum.split('.')[0] * 1
        } else {
          num = endNum.match(/[0-9]{1,}/g)[0]
        }
        endNum = endNum.replace(num, Tool.numFormat(num))
      }
    }
    return endNum
  },

  GetDateStr: function(AddDayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + AddDayCount) //获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() //获取当前几号，不足10补0
    return y + '-' + m + '-' + d
  },
  //表单验证
  verify: function(form) {
    var wrapper, item, checking, hint, reg, length, temp, i
    var scrollTopList = []
    var minTop
    var data = {}
    var flag
    var datatype = 'str'
    if (form.find('.verify-hint.calc-hint').length) {
    }
    form
      .find('.verify-hint')
      .not('.calc-hint')
      .remove()
    form.find('.input-group').map(function() {
      wrapper = ES.selctorDoc(this)
      item = wrapper.find('input').not('[type="file"]')
      datatype = wrapper.attr('datatype') ? wrapper.attr('datatype') : 'str'
      hint = ''
      flag = true
      switch (datatype) {
        case 'num':
          value = 0
          value = Number(item.val())
          if (isNaN(value)) {
            hint = '该项仅可输入数字'
          }
          break
        case 'str':
          value = ''
          value = item.val()
          break
        case 's':
          value = 0
          value = new Date(item.val()).getTime() / 1000
          break
        case 'obj':
          value = {}
          item.map(function() {
            value[ES.selctorDoc(this).attr('name')] = $(this).val()
          })
          break
        case 'arr':
          value = []
          item.map(function() {
            if (ES.selctorDoc(this).val()) {
              value.push(ES.selctorDoc(this).val())
            }
          })
          break
        case 'arr-obj':
          value = []
          wrapper.find('.upload-section').map(function() {
            temp = {}
            $(this)
              .find('input')
              .not('[type="file"]')
              .map(function() {
                if (ES.selctorDoc(this).val()) {
                  temp[ES.selctorDoc(this).attr('name')] = $(this).val()
                }
              })
            if (Tool.justifyLength(temp)) {
              value.push(temp)
            }
          })
          break
        case 'checkbox':
          value = []
          item.map(function() {
            if (ES.selctorDoc(this).prop('checked')) {
              value.push(Number(ES.selctorDoc(this).val()))
            }
          })
          break
        // radio结果需要另外转为Number
        case 'radio':
          value = wrapper.find('input:checked').val() || ''
          break
      }
      if (wrapper.hasClass('required')) {
        checking = wrapper.attr('check') ? wrapper.attr('check').split('|') : []
        for (i in checking) {
          reg = null
          if (!hint) {
            switch (checking[i]) {
              case 'empty':
                hint = Tool.justifyLength(value) > 0 ? '' : '必填'
                break
              case 'length':
                length = wrapper.attr('length') || ''
                if (length) {
                  reg = /^[\u4e00-\u9fa5]+$/
                  var nwole = 0
                  for (var i = 0; i < value.length; i++) {
                    if (reg.test(value.substr(i, 1))) {
                      nwole += 2
                    } else {
                      nwole += 1
                    }
                  }
                  if (Number(length) && nwole > length) {
                    hint = '请输入' + length + '个字符或者' + Math.floor(length / 2) + '个中文字符'
                  }
                }
                break
              case 'email':
                reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                if (value) {
                  hint = reg.test(value) ? '' : '请输入正确的邮箱地址'
                }
                break
              case 'tel':
                reg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/
                if (value) {
                  hint = reg.test(value) ? '' : '请输入11位正确的手机格式号码'
                }
                break
              case 'qq':
                reg = /^[1-9]\d{1,}/
                if (value) {
                  hint = reg.test(value) ? '' : '该项仅可输入数字'
                }
                break
              case 'contactMan':
                reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if (value) {
                  hint = reg.test(value) ? '' : '该项仅可输入中文或字母'
                }
                break
              case 'url':
                reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
                if (value) {
                  hint = reg.test(value) ? '' : '请输入正确的url地址'
                }
                break
              default:
                if (reg) {
                  try {
                    reg = eval(checking[i])
                  } catch (e) {
                    reg = ''
                  }
                  if (reg) {
                    hint = reg.test(value) ? '' : '请正确填入该项'
                  }
                }
                break
            }
          }
          if (hint) {
            if (wrapper.find('.calc-hint').length == 0) {
              wrapper.append('<span class="verify-hint">' + hint + '</span>')
            }
            scrollTopList.push(wrapper.offset().top)
            flag = false
            break
          }
        }
      }
      if (flag) {
        if (wrapper.attr('name')) {
          data[wrapper.attr('name')] = value
        }
      }
    })
    if (scrollTopList.length) {
      minTop = Math.min.apply(null, scrollTopList)
      minTop = minTop > 100 ? minTop - 100 : 0
      ES.selctorDoc('body').animate(
        {
          scrollTop: minTop
        },
        100
      )
      return null
    } else {
      if (wrapper.find('.calc-hint').length != 0) {
        return null
      }
      return data
    }
  },
  //验证长度
  justifyLength: function(obj) {
    var count = 0
    if (obj.length || obj.length == 0) {
      count = obj.length
    } else if (typeof obj === 'number') {
      count = obj
    } else {
      for (var i in obj) {
        count++
      }
    }
    return count
  },
  getNowPos: function(pos, hs, screen) {
    let nowPos = {}
    if (hs) {
      nowPos.x = pos.x
      nowPos.y = pos.y - 100
    } else {
      nowPos.x = pos.x - 170
      nowPos.y = pos.y - 60
    }
    for (let i = 0; i < screen.length; i++) {
      let info = screen[i]
      if (nowPos.x > info.x && nowPos.x < info.x + info.w && nowPos.y > info.y && nowPos.y < info.y + info.h) {
        return i
      }
    }
    return null
  },
  removeArrayElement: function(arr, el) {
    if (arr && arr.length != 0) {
      var str = ',' + arr.toString() + ','
      str = str.replace(',' + el + ',', ',')
      return str.pslit(',')
    } else {
      return []
    }
  },

  changeImageToBase64: function(imgs) {
    var canvas = document.createElement('canvas')
    canvas.width = imgs.width
    canvas.height = imgs.width
    var ctx = canvas.getContext('2d')
    ctx.drawImage(imgs, 0, 0)
    return canvas.toDataURL('image/png') //.replace('data:image/png;base64,','');
  },

  //获得data
  dataToObject: function(value, data, key) {
    for (var i = 0; i < value.length; i++) {
      if (!data[key]) {
        data[key] = []
      }
      data[key].push(value[i].key)
      if (typeof value[i].value != 'number' && typeof value[i].value != 'string') {
        //data[value[i].key] = []
        Tool.dataToObject(value[i].value, data, value[i].key)
      } else {
        data[value[i].key] = value[i].value
      }
    }
  },
  checkForm: function(dom, type) {
    var hint = ''
    if (dom.find('.inputBox').dom) {
      var check = dom.find('.inputBox').attr('check')
      var title = dom.find('.inputBox').attr('title') ? dom.find('.inputBox').attr('title') : ''
      var error = dom.find('.inputBox').attr('error')
      var length = parseInt(dom.find('.inputBox').attr('length'))
      var checkArr = check ? check.split('|') : []
      var check_reg = dom.find('input').attr('reg')
      var text = dom.find('.inputBox').val()
      if (checkArr.length > 0) {
        $.each(checkArr, function(idx, val) {
          switch (val) {
            case 'empty':
              if (text.length > 0) {
                if (text.trim() == '') {
                  if (title) {
                    hint = title + '必填'
                  } else {
                    hint = '必填'
                  }
                  return
                } else {
                  hint = ''
                  dom.find('.verify-hint').remove()
                }
              } else {
                if (title) {
                  hint = title + '必填'
                } else {
                  hint = '必填'
                }
                return
              }
              break
            case 'length':
              var reg = /^[\u4e00-\u9fa5]+$/
              var nwole = 0
              for (var i = 0; i < text.length; i++) {
                if (reg.test(text.substr(i, 1))) {
                  nwole += 2
                } else {
                  nwole += 1
                }
              }
              if (nwole > length || nwole <= 0) {
                if (error) {
                  hint = error
                } else {
                  hint = '请输入1到' + length + '位字符'
                }
                return
              } else {
                hint = ''
                dom.find('.verify-hint').remove()
              }
              break
            case 'phone':
              var reg = /^1[3456789]\d{9}$/
              if (text != '') {
                if (!reg.test(text)) {
                  hint = '请输入正确的11位手机号码'
                  return
                } else {
                  hint = ''
                  dom.find('.verify-hint').remove()
                }
              } else {
                hint = '请输入正确的11位手机号码'
                return
              }
              break
            case 'num':
              var reg = check_reg ? check_reg : /^\d*\.?\d+$/
              if (text != '') {
                if (!eval(reg).test(text)) {
                  if (error) {
                    hint = error
                    return
                  } else {
                    hint = '请输入数字'
                  }
                } else {
                  hint = ''
                  dom.find('.verify-hint').remove()
                }
              } else {
                hint = error ? error : '请输入数字'
                dom.find('.verify-hint').remove()
                return
              }
              break
            case 'int':
              //正整数
              var reg = check_reg ? check_reg : /^[1-9]\d*$/
              if (text != '') {
                if (!eval(reg).test(text)) {
                  if (error) {
                    hint = error
                  } else {
                    hint = '请输入大于等于1的整数'
                  }
                } else {
                  hint = ''
                  dom.find('.verify-hint').remove()
                }
              } else {
                return
              }
              break
          }
        })
      }
    } else if (dom.find('.drop-down').dom) {
      var check1 = dom
        .find('.drop-down')
        .parent()
        .attr('check')
      if (check1) {
        var title1 = dom
          .find('.drop-down')
          .parent()
          .attr('title')
          ? dom
            .find('.drop-down')
            .parent()
            .attr('title')
          : ''
        if (dom.find('.selected1 .nowname').attr('data-idx') == '' || dom.find('.selected1 .nowname').attr('data-idx') == undefined) {
          dom.find('.verify-hint').remove()
          hint = '请选择' + title1
        } else {
          dom.find('.verify-hint').remove()
        }
      }
    } else if (dom.find('.chooseData').dom) {
      var check1 = dom
        .find('.chooseData')
        .parent()
        .attr('check')
      if (check1) {
        var title1 = dom
          .find('.chooseData')
          .parent()
          .attr('title')
        if (dom.find('.Timers').html() == title1) {
          dom.find('.verify-hint').remove()
          hint = '请选择' + title1
        } else {
          dom.find('.verify-hint').remove()
        }
      }
    } else if (dom.find('.radio-box').dom) {
      var check1 = dom.attr('check')
      if (check1) {
        var title1 = dom.attr('title')
        if (dom.find('.choose').dom) {
          dom.find('.verify-hint').remove()
        } else {
          dom.find('.verify-hint').remove()
          hint = '请选择' + title1
        }
      }
    } else if (dom.find('.duoxuanxlk').dom) {
      var check1 = dom
        .find('.duoxuanxlk')
        .parent()
        .attr('check')
      if (check1) {
        var title1 = dom
          .find('.duoxuanxlk')
          .parent()
          .attr('title')
          ? dom
            .find('.duoxuanxlk')
            .parent()
            .attr('title')
          : '请选择'
        if (dom.find('.showname').val() == '' || dom.find('.showname').val() == title1) {
          dom.find('.verify-hint').remove()
          hint = title1 ? title1 : '请选择'
        } else {
          dom.find('.verify-hint').remove()
        }
      }
    }
    if (type != '') {
      if (hint != '') {
        return hint
      } else {
        return ''
      }
    } else {
      if (hint != '') {
        dom.find('.verify-hint').remove()
        dom.append('<span class="verify-hint">' + hint + '</span>')
      } else {
        return true
      }
    }
  },
  getSigleId() {
    let stum = Math.floor(Math.random() * new Date().getTime())
    let pos = Math.floor(Math.random() * 3) + 1
    if (stum % 2 == 0) {
      return 'bcd' + String(stum).substr(0, pos) + 'ab' + String(stum).substr(pos + 1)
    } else {
      return 'wty' + String(stum).substr(0, pos) + 'xy' + String(stum).substr(pos + 1)
    }
  },
  guid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  //[{val:'',idx:''}格式
  configxlkformat: function(value={}) {
    const { children } = value;
    if( !Array.isArray(children) ) return [];
    let arr = []
    children.forEach(function(val, idx) {
      let obj = {
        idx: val.value,
        val: val.name
      }
      arr.push(obj)
    })
    return arr
  },
  //{value:remark}格式
  configobjformatremark: function(value={}) {
    const { children } = value;
    if( !Array.isArray(children) ) return {};
    let obj = {}
    children.forEach(function(val, idx) {
      obj[val.value] = val.remark
    })
    return obj
  },
  //{name:value}格式
  configobjformat: function(value) {
    const { children } = value;
    if( !Array.isArray(children) ) return {};
    let obj = {}
    children.forEach(function(val, idx) {
      obj[val.value] = val.name
    })
    return obj
  },
  // 返回remark对象: {version: 'V1'}
  configRemarkFormat: function(value) {
    if (!value || !value.children || value.children.length === 0 || !value.children[0].remark) return null
    const remark = value.children[0].remark
    return JSON.parse(remark)
  },
  downfile(url, app) {
    app.loading.show()
    setTimeout(function() {
      app.loading.hide()
    }, 1000)
    var a = document.createElement('a')
    var url = url + '&accessToken=' + window.localStorage.accessToken
    a.href = url
    a.click()
  },
  // 下载文件
  downloadLocalFile(url, fileName, app) {
    app.loading.show()
    setTimeout(() => {
      app.loading.hide()
    }, 1000)
    var a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
  },
  getFileType(filePath) {
    var startIndex = filePath.lastIndexOf('.')
    if (startIndex != -1) return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
    else return ''
  },
  errorshow(msg, app) {
    app.alert.show({
      title: ' ',
      msg: msg,
      close: false
    })
  },
  // 加法，eg：0.1 + 0.2 = 0.30000000000000004
  plus(x, y) {
    if (!isNumber(x) || !isNumber(y)) return
    return +new Big(x).plus(y)
  },
  // 减法，eg：0.3 - 0.1 = 0.19999999999999998
  minus(x, y) {
    if (!isNumber(x) || !isNumber(y)) return
    return +new Big(x).minus(y)
  },
  // 乘法，eg：67.4 * 100 = 6740.000000000001
  multiply(x, y) {
    if (!isNumber(x) || !isNumber(y)) return
    return +new Big(x).mul(y)
  },
  // 除法，eg：355 / 5
  divide(x, y) {
    if (!isNumber(x) || !isNumber(y)) return
    return +new Big(x).div(y)
  },

  // 跳转到C端
  goToC(app, { seriesImgFileType, type, taskId, userId, ...rest }) {
    taskId = taskId ? Number(taskId) : Number(app.parpam['taskId'])
    app.querySysInfo(taskId).then(res => {
      const params = res && res.data ? res.data.c_clientParams : ""
      // seriesImgFileType的值与mode的对应关系
      const relations = {
        17: 13, // 肋骨分割
        16: 12, // 冠脉分岔点
        15: 11, // C端病理大图
        14: 10, // 肺气道
        13: 9, // 脑动脉瘤项目
        12: 8, // 脑中线
        11: 7, // 冠脉斑块分割
        10: 6, // 脑血管分割
        9: 5, // 随访配准
        8: 4, // 冠脉命名模式
        7: 3, // CPR模式
        6: 2 // 单点追踪/冠脉分割审核模式
      }
      let json = {
        env: process.env.APP_ENV, // env: jys:技研所 zj:智健
        taskId,
        userId: userId || JSON.parse(app.local.get('all')).userId,
        accessToken: app.local.get('accessToken'),
        serviceHost: window.location.origin,
        params,
        clientType: seriesImgFileType,
        mode: relations[seriesImgFileType] || 1,
        /**
          标注模式：1-进行标注 2-查看 3-管理员查看(所有) 4-编辑 5-修改(已废弃);
          审核任务中的方体审核(冠脉狭窄)：6-进行审核 7-编辑 8-查看 9-管理员查看(所有);
          (单审)审核任务中的MASK审核/冠脉分割审核(或者叫单点追踪审核,属于mask审核的一种)：10-进行审核 11-编辑 12-查看 13-管理员查看(所有);
          (双审)审核任务中的MASK审核/冠脉分割双审审核：14-进行审核 15-编辑 16-查看 17-管理员查看(所有);
        */
        type,
        ...rest
      }
      window.open(([3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].includes(seriesImgFileType) ? 'annotation://' : 'Aneurysm://') + Base64.encoder(JSON.stringify(json)))
    })
  },

  // Date类型日期转成字符串（YYYY-MM-DD）
  getCurrentDateStr(date = new Date()) {
    return date.toLocaleDateString('zh-Hans-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-') // 获取的月日当个位数时前面会加0
  },
  // 导出csv文件方法
  exportCSVFile(content, filename) {
    this.exportFile(content, filename, 'text/csv')
  },
  // 导出excel文件方法
  exportExcelFile(content, filename) {
    this.exportFile(content, filename, 'application/vnd.ms-excel')
  },
  // type: 'text/csv', 'application/vnd.ms-excel'
  exportFile(content, filename, type = 'text/csv') {
    const eleLink = document.createElement('a')
    if (!('download' in eleLink)) {
      alert('该浏览器下载不支持')
      return
    }
    const blob = new Blob([content], { type }) // application/vnd.ms-excel
    // 此时blob中的数据中文已经乱码，需要修改二进制的部分内容，给内容前加上'\uFEFF'
    const newBlob = blob.slice(0)
    const reader = new FileReader()
    reader.readAsText(newBlob, 'utf-8')
    reader.onload = function(e) {
      // 字符内容转变成blob地址
      const url = URL.createObjectURL(new Blob(['\uFEFF' + e.target.result], { type: 'text/csv;charset=utf-8' }))
      eleLink.download = filename
      eleLink.style.display = 'none'
      eleLink.href = url
      document.body.appendChild(eleLink)
      // 触发点击
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }
  },
  // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
  sheet2blob(sheets) {
    var workbook = {
      SheetNames: Object.keys(sheets),
      Sheets: sheets
    }
    // 生成excel的配置项
    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    }
    var wbout = XLSX.write(workbook, wopts)
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    // 字符串转ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }
    return blob
  },

  /**
    * 通用的打开下载对话框方法，没有测试过具体兼容性
    * @param url 下载地址，也可以是一个blob对象，必选
    * @param saveName 保存文件名，可选
    */
  openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url) // 创建blob地址
    }
    const aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event
    if (window.MouseEvent) {
      event = new MouseEvent('click')
    } else {
      event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event)
  },
  // 用于CSV，根据列名返回当前的列索引。headerText 可以是字符串或者数组，如果是数组，则找到匹配的一列就返回
  findColIndex(headerText, hederList, isNotAlert = false) {
    if (typeof headerText === 'string') headerText = [headerText]
    const index = hederList.findIndex(v => headerText.includes(v))
    if (index === -1 && !isNotAlert) alert(`${headerText}列不存在！`)
    return index
  }

}


const isNumber = num => {
  return num === 0 || (!!num && !isNaN(Number(num)))
}

window.Tool = window.Tool || tool
module.exports = window.tool
