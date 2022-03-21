require("./list.less");
class list extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.name = "list";
    this.html = require('./tpl.html')
  }
  complete() {
    var that = this
    this.choose = true
    this.data = []
    this.jg = []
    this.icon = []
    this.type = ''
    this.choose = this.nowParam.chose
    this.choosew = this.nowParam.chosew
    this.tablewidth = this.nowParam.tablewidth
    this.minwidth = this.nowParam.minwidth
    this.onofftype = this.nowParam.onofftype
    this.jg = this.nowParam.jg;
    this.icon = this.nowParam.icon;
    this.type = this.nowParam.type;
    this.iconArr = this.nowParam.iconArr;
    this.mainId = this.nowParam.mainId || null
    this.selectarr = []
    this.finalwidth = this.tablewidth > this.minwidth ? this.tablewidth : this.minwidth
    this.drop = require("../../moduleslibs/dropdown1/drop");
    let dataLH = this.dom.find('.list1').box().clientHeight - this.dom.find('.list-header').box().clientHeight * 2
    this.dom.find('.dataNone').css({ 'line-height': dataLH })
    if (this.type === 'center') {
      that.initView(this.icon)
    }
  }
  initView(value) {
    let that = this;
    var iconH = ''
    for (var i in value) {
      if (value[i].w) {
        if (value[i].first) {
          if (typeof (value[i].w) != 'string') {
            iconH +=
              '<li style="width:' +
              value[i].w +
              "px;left:" +
              (value[i].left || 0) +
              'px;"><span data-i18n=' +
              value[i].code +
              ' style="margin-left:2px">' +
              value[i].name +
              "</li>"
          } else {
            iconH += '<li style="width:' + parseFloat(value[i].w) * that.finalwidth / 100 + 'px;margin-left:' + value[i].n + 'px;left:' + (value[i].left || 0) + 'px;"><span data-i18n=' + value[i].code + ' style="margin-left:2px">' + value[i].name + '</li>'
          }
        } else {
          if (typeof (value[i].w) != 'string') {
            iconH += '<li style="width:' + value[i].w + 'px;padding-left:' + value[i].n + 'px;left:' + (value[i].left || 0) + 'px;">' + value[i].name + '</li>'
          } else {
            iconH += '<li style="width:' + parseFloat(value[i].w) * that.finalwidth / 100 + 'px;padding-left:' + value[i].n + 'px;left:' + (value[i].left || 0) + 'px;">' + value[i].name + '</li>'
          }
        }
      } else {
        iconH += '<li>' + value[i].name + '</li>'
      }
    }
    this.dom.find('.list-header ul').html(iconH)
    this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, this.name)
    var sort = '';
    var order = '';
    if (this.iconArr) {
      that.iconArr.forEach(function (idx, val) {
        that.dom.find('.list-header ul li').eq(val).on('mouseover', function () {
          that.resetIcon(ES.selctorDoc(this).find('i'), 'mouseover')
        });
        that.dom.find('.list-header ul li').eq(val).on('mouseout', function () {
          that.resetIcon(ES.selctorDoc(this).find('i'), 'mouseout')
        });
      });
      that.dom.find('.list-header li').on('click', function () {
        if (ES.selctorDoc(this).find('i').dom.length > 0) {
          that.dom.find('.list-header li i').removeClass('select')
          ES.selctorDoc(this).find('i').addClass('select')
          let nowid = ES.selctorDoc(this).find('i').attr('nowid')
          //that.dom.find('.list-header i').css({"background-image":"url(/images/order/no.png)"});
          that.dom.find('.list-header i').attr('nowid', '0')
          that.dom.find('.list-header i').parent('span').removeClass('arrow_reverse')
          ES.selctorDoc(this).find('i').attr('nowid', nowid)
          sort = ES.selctorDoc(this).find('i').attr('name');
          if (ES.selctorDoc(this).find('i').attr('nowid') === "0") {
            ES.selctorDoc(this).find('i').attr('nowid', "1");
            ES.selctorDoc(this).find('i').parent('span').addClass('arrow_reverse')
            //ES.selctorDoc(this).find('i').css({"background-image": "url(/images/order/up.png)"});
            //DESC  ASC
            order = 1
          } else if (ES.selctorDoc(this).find('i').attr('nowid') == '1') {
            ES.selctorDoc(this).find('i').attr('nowid', '0')
            // ES.selctorDoc(this).find('i').css({"background-image":"url(/images/order/down.png)"});
            ES.selctorDoc(this).find('i').parent('span').removeClass('arrow_reverse')
            order = 0
          }
          that.event._dispatch('list.paixu', { sort: sort, order: order })
        }
      });
    }
    if (this.choose == 'all') {
      that.dom.find('.list-header ul').prepend('<li style="width:' + this.choosew.w + ';"><p><span class="check-box" style="margin-left: ' + this.choosew.ml + '"></span></p></li>')
      that.dom.find('.list-header .check-box').on('click', function () {
        let idlist = [];
        that.data.forEach((v) => {
          if (v.formComponentId) {
            idlist.push(v.formComponentId)
          } else {
            idlist.push(v.id)
          }
        })
        that.dom.find('.list-content .check-box').removeClass('choose')
        if (ES.selctorDoc(this).hasClass('choose')) {
          that.event._dispatch('list.allcheck', { id: idlist, data: that.data, type: 'del' })
          ES.selctorDoc(this).removeClass('choose')
        } else {
          that.event._dispatch('list.allcheck', { id: idlist, data: that.data, type: 'add' })
          ES.selctorDoc(this).addClass('choose')
          that.dom.find('.list-content .check-box').addClass('choose')
        }
      })
    }
  };
  setData(value) {
    if (!this.dom.find('.dataNone').hasClass('hide')) {
      this.dom.find('.dataNone').addClass('hide')
      this.dom.find('.list-content').removeClass('hide')
    }
    this.dom.find('.load').addClass('hide');
    this.headerfirstPadding = true;
    this.data = value;
    this.refreshList()
  };
  noData(value) {
    this.dom.find('.dataNone').removeClass('hide')
    this.dom.find('.list-content').addClass('hide')
    if (value) {
      this.dom.find('.dataNone').html(value)
    }
  }
  resetIcon(dom, type) {
    if (type == 'mouseover') {
      switch (dom.attr('nowid')) {
        case '0':
          dom.css("background-image", "url(/images/order/noHover.png)");
          break;
        case '1':
          dom.css("background-image", "url(/images/order/upHover.png)");
          break;
        case '2':
          dom.css("background-image", "url(/images/order/downHover.png)");
          break;
      }
    } else {
      switch (dom.attr('nowid')) {
        case '0':
          dom.css("background-image", "url(/images/order/no.png)");
          break;
        case '1':
          dom.css("background-image", "url(/images/order/up.png)");
          break;
        case '2':
          dom.css("background-image", "url(/images/order/down.png)");
          break;
      }
    }
  };
  loadList() {
    let that = this;
    var con = '';
    var id = '';
    if (this.data === undefined) {
      return;
    }
    for (var i = 0; i < this.data.length; i++) {
      let dataId = that.mainId ? that.data[i][that.mainId] : that.data[i].id
      con += "<div><ul positionId='" + i + "' nowId='" + dataId + "' class='ul'>"
      //最前面的checkbox
      if (that.choose == 'all') {
        if (that.data[i].choosed) {
          con += "<li style='width:" + that.choosew.w + ";text-overflow: ellipsis;overflow: hidden;' nowId='" + dataId + "'><p><span class='check-box choose' style='margin-left: " + that.choosew.ml + "'></span></p></li>"
        } else {
          con += "<li style='width:" + that.choosew.w + ";text-overflow: ellipsis;overflow: hidden;' nowId='" + dataId + "'><p><span class='check-box' style='margin-left: " + that.choosew.ml + "'></span></p></li>"
        }
      }
      //that.data[i] 每个字段前面的名称如 'id';
      //that.icon 放数据的数组，里面是obj
      for (var j in that.icon) {
        var width = '';
        var width1 = '';
        if (that.icon[j].style) {
          width = that.icon[j].style
        } else {
          if (typeof (that.icon[j].ww) != 'string') {
            width = 'style="width:' + that.icon[j].ww + 'px;padding-left:' + that.icon[j].n + 'px"';
            width1 = 'style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width:' + (that.icon[j].w - 20) + 'px;"'
          } else {
            width = 'style="width:' + parseFloat(that.icon[j].ww) * that.finalwidth / 100 + 'px;padding-left:' + that.icon[j].n + 'px"';
          }
        }
        switch (that.icon[j].type) {
          case 'text':
            if (that.data[i][j] != '' || that.data[i][j] == 0) {
              con += "<li  class='list0'" + width + " ><p class='overhide' title='" + that.data[i][j] + "' width1='" + parseFloat(that.icon[j].ww) * that.finalwidth / 100 + "'px>" + that.data[i][j] + "</p>"
            } else {
              con += "<li  " + width + ">" + '  ' + "</li>"
            }
            break
          case 'link':
            if (that.data[i][j] != '' || that.data[i][j] == 0) {
              con += "<li  class='listlink'" + width + " ><p class='overhide' title='" + that.data[i][j] + "' width1='" + parseFloat(that.icon[j].ww) * that.finalwidth / 100 + "'px>" + that.data[i][j] + "</p>"
            } else {
              con += "<li  " + width + ">" + '  ' + "</li>"
            }
            break
          case 'select':
            con += "<li  " + width + "><p class='lbxlk hide no" + dataId + "' nowid='" + dataId + "' data='" + that.data[i][j] + "'></p></li>"
            break
          case 'onoff':
            if (that.data[i][j] == true) {
              con += "<li class='switch on'" + width + "><span style='width:" + (that.icon[j].w - 30) + "px;margin-left:10px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>&nbsp;" + that.onofftype[1] + "<i></i></span></li>"
            } else {
              con += "<li class='switch off'" + width + "><span style='width:" + (that.icon[j].w - 30) + "px;margin-left:10px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>" + that.onofftype[0] + "&nbsp;<i></i></span></li>"
            }
            break
          case 'onoff1':
            var styr = that.data[i][j] === 'open' ? 'check' : ''
            if (that.type != undefined) {
              con += "<li class='click-enable choose_onoff' " + width + " nowId='" + dataId + "'><span style='position: absolute;top: 35px;'><label class='tgl-btn " + styr + "' for='cb1-1-0'></label></span></li>"
            } else {
              con += "<li class='click-enable choose_onoff' " + width + " nowId='" + dataId + "'><span style='position: absolute;top: 25px;'><label class='tgl-btn " + styr + "' for='cb1-1-0'></label></span></li>"
            }
            break
          case 'action':
            var tempH = '<li class="tableList" ' + width + 'nowId="' + dataId + '">'
            for (var w in that.data[i][j]) {
              var title1 = w;
              if (w == 'config') {
                tempH += '<a class="iconfont icon-caozuo config"  title="" ></a><ul class="actionul hide">'
                that.data[i][j][w].content.forEach(function (val, idx) {
                  tempH += '<li class="' + val.key + '">' + val.text + '</li>'
                })
                tempH += '</ul>'
              } else {
                var titles;
                if (that.data[i][j][w].titleText) {
                  titles = that.data[i][j][w].titleText
                } else {
                  titles = title1
                }
                if (that.data[i][j][w].content) {
                  tempH += '<div class="content ' + w + '" style="display:' + that.data[i][j][w].dis + '" title="' + that.data[i][j][w].content + '"link="' + that.data[i][j][w].link + '" classname="' + w + '">' + that.data[i][j][w].content + '</div>'
                } else {
                  tempH += '<a class="icon iconfont icon-' + w + '" style="display:' + that.data[i][j][w].dis + '" title="' + titles + '"link="' + that.data[i][j][w].link + '"classname="' + w + '"></a>'
                }
              }
            }
            tempH += '</li>'
            con += tempH;
            break
        }
      }
      con += '</ul></div>'
    }
    return con;

  }
  refreshList() {
    let that = this;
    if (this.type === 'center') {
      that.dom.find('.list-content').html(that.loadList())
      that.addButton()
      that.resize();
    }
  }
  addButton() {
    let that = this;
    if (that.dom.find('.lbxlk').dom) {
      that.dom.find('.lbxlk').dom.forEach(function (val, idx) {
        that.selectarr[idx] = that.app.loadModule(that.drop, val, {
          className: 'listxlk',
          firstSelect: {
            val: '',
            idx: ''
          },
          maxshownum: 3,
          datatype: 'arr',
          data: val.attr('data').split(',')
        })
      })
    }
    this.dom.find('.list-content .switch span').on('click', function (e) {
      e.stopPropagation();
      that.app.model.set('listId', ES.selctorDoc(this).parent().attr('nowId'));
      if (ES.selctorDoc(this).parent().hasClass('on')) {
        ES.selctorDoc(this).parent().removeClass('on');
        ES.selctorDoc(this).parent().addClass('off');
        ES.selctorDoc(this).html(that.onofftype[0] + '&nbsp;<i></i>');
        ES.selctorDoc(this).parent().attr('onoff', '');
        that.event._dispatch('list.onoff', { id: ES.selctorDoc(this).parent().parent().attr('nowId'), dom: ES.selctorDoc(this).parent(), action: 'off' })
      } else {
        ES.selctorDoc(this).parent().addClass('on');
        ES.selctorDoc(this).parent().removeClass('off');
        ES.selctorDoc(this).html('&nbsp;' + that.onofftype[1] + '<i></i>');
        ES.selctorDoc(this).parent().attr('onoff', '');
        that.event._dispatch('list.onoff', { id: ES.selctorDoc(this).parent().parent().attr('nowId'), dom: ES.selctorDoc(this).parent(), action: 'on' })
      }
    })
    this.dom.find('.list-content .listlink').on('click', function () {
      that.event._dispatch('list.listlink', { id: ES.selctorDoc(this).parent().attr('nowId') })
    })
    this.dom.find('.list-content .ul').on('dblclick', function () {
      if (ES.selctorDoc(this).find('.list2').dom) {
        return
      }
      that.event._dispatch('list.ul', ES.selctorDoc(this).attr('nowId'))
    })
    this.dom.find('.list-content .tableList div').on('click', function (e) {
      e.stopPropagation();
      that.app.model.set('listId', ES.selctorDoc(this).parent().attr('nowId')); //positionid
      that.event._dispatch('list.action', { id: ES.selctorDoc(this).parent().attr('nowId'), position: ES.selctorDoc(this).parent().parent().attr('positionid'), dom: ES.selctorDoc(this).parent().parent(), classname: ES.selctorDoc(this).attr('classname') })
      if (ES.selctorDoc(this).attr('link') !== 'noLink') {
        that.app.changePage(ES.selctorDoc(this).attr('link') + "/" + ES.selctorDoc(this).parent().attr('nowId'))
      } else {

      }
    })
    this.dom.find('.list-content .tableList .config').on('click', function (e) {
      e.stopPropagation();
      if (ES.selctorDoc(this).parent().find('.actionul').hasClass('hide')) {
        ES.selctorDoc(this).parent().find('.actionul').removeClass('hide')
        that.dom.find('.mask').removeClass('hide')
      } else {
        ES.selctorDoc(this).parent().find('.actionul').addClass('hide')
        that.dom.find('.mask').addClass('hide')
      }
    })
    this.dom.find('.actionul li').on('click', function (e) {
      e.stopPropagation();
      let eventname = 'list.' + ES.selctorDoc(this).attr('class');
      //that.event._dispatch(eventname, {id: ES.selctorDoc(this).parent().parent().attr('nowId'), dom: ES.selctorDoc(this).parent().parent()})
      that.event._dispatch('list.action', { id: ES.selctorDoc(this).parent().parent().attr('nowId'), dom: ES.selctorDoc(this).parent().parent(), classname: ES.selctorDoc(this).attr('class') })
      ES.selctorDoc(this).parent().addClass('hide');
      that.dom.find('.mask').addClass('hide');
    })
    this.dom.find('.list-content .tableList .icon').on('click', function (e) {
      e.stopPropagation();
      that.event._dispatch('list.action', { id: ES.selctorDoc(this).parent().parent().attr('nowId'), dom: ES.selctorDoc(this).parent().parent(), classname: ES.selctorDoc(this).attr('classname') })
    })
    that.dom.find('.mask').on('click', function () {
      that.dom.find('.actionul').addClass('hide');
      that.dom.find('.mask').addClass('hide');
    })
    that.dom.find('.list-content .check-box').on('click', function () {
      if (ES.selctorDoc(this).hasClass('choose')) {
        that.event._dispatch('list.check', { id: ES.selctorDoc(this).parent().parent().attr('nowid'), type: 'del', data: that.data[ES.selctorDoc(this).parent().parent().parent().attr('positionId')] })
        ES.selctorDoc(this).removeClass('choose')
      } else {
        that.event._dispatch('list.check', { id: ES.selctorDoc(this).parent().parent().attr('nowid'), type: 'add', data: that.data[ES.selctorDoc(this).parent().parent().parent().attr('positionId')] })
        ES.selctorDoc(this).addClass('choose')
      }
    })
  }
  refreshHeader(value) {
    let that = this;
    var iconH = ''
    for (var i in value) {
      if (value[i].w) {
        if (value[i].first) {
          if (typeof (value[i].w) != 'string') {
            iconH += '<li style="width:' + (value[i].w) + 'px;text-align:center"><span style="margin-left:10px">' + value[i].name + '</li>'
          } else {
            iconH += '<li style="width:' + (value[i].w * that.finalwidth) + ';text-align:center"><span style="margin-left:10px">' + value[i].name + '</li>'
          }
        } else {
          if (typeof (value[i].w) != 'string') {
            iconH += '<li style="width:' + value[i].w + 'px;text-align:center">' + value[i].name + '</li>'
          } else {
            iconH += '<li style="width:' + value[i].w * that.finalwidth + ';text-align:center">' + value[i].name + '</li>'
          }
        }
      } else {
        iconH += '<li>' + value[i].name + '</li>'
      }
    }
    that.dom.find('.list-header ul').html(iconH)
  }
  insertLine(value) {
    let that = this;
    that.dom.find('.list-content').append(that.insert(that.nowParam, value));
    if (that.type === 'center') {
      that.addButton();
    }
  }
  insert(value, action) {
    let that = this;
    var con = '<div><ul class="ul">';
    var id = '';
    for (var j in value.icon) {
      var width = '';
      var width1 = '';
      var width2 = '';
      var delIcon = 'style="background-image:url(/images/sassIcon.png);width:23px;height:23px;display:inline-block;cursor:pointer;background-position:-665px -55px;"';
      var editIcon = 'style = "background-image:url(/images/sassIcon.png);width:23px;height:23px;display:inline-block;cursor:pointer;background-position:-631px -55px;margin-right:15px"';
      if (value.icon[j].style) {
        width = value.icon[j].style
      } else {
        if (typeof (value.icon[j].w) != 'string') {
          let wid = value.icon[j].p;
          let margin = value.icon[j].a;
          width = 'style="width:' + wid + 'px;margin-left:' + margin + 'px;text-align:center;left:' + (that.icon[j].n || 0) + 'px"';
          var status = 'style="width:' + wid + 'px;border-radius: 6px;margin-left:' + margin + 'px;text-align:center;left:' + (that.icon[j].n || 0) + 'px"';
          width1 = 'style="text-align:center;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width:' + (value.icon[j].w - 20) + 'px;"'
        } else {
          let wid = value.icon[j].w;
          width = 'style="width:' + parseFloat(that.icon[j].ww) * that.finalwidth / 100 + 'px;padding-left:' + that.icon[j].n + 'px"';
          width1 = 'style="text-align:center"';
        }
      }
      switch (value.icon[j].type) {
        case 'text':
          if (value.icon[j].new != false) {
            con += "<li  class='list0'" + width + " ><input class='newinput' type='text'/></li>"
          } else {
            con += "<li  class='list0'" + width + " ><p class='overhide' title='' width1=" + parseFloat(that.icon[j].ww) * that.finalwidth / 100 + "px></p></li>"
          }
          break;
        case 'link':
          con += "<li  class='listlink'" + width + " ><p class='overhide' title='' width1=\"+parseFloat(that.icon[j].ww)*that.finalwidth/100+\"px></p></li>"
          break;
        case 'updown':
          if (that.data[i][j] == null || that.data[i][j] == 0) {
            con += "<li " + width + ">--</li>"
          } else if ((that.data[i][j] * 1) > 0) {
            con += "<li " + width + "><span><i class='updown23'></i>" + that.data[i][j] + "%</span></li>"
          } else if ((that.data[i][j] * 1) < 0) {
            con += "<li " + width + "><span><i class='updown1'></i>" + that.data[i][j].replace('-', '') + "%</span></li>"
          }
          break;
        case 'onoff':
          var styr = that.data[i][j] == 1 ? 'check' : ''
          if (that.type != undefined) {
            con += "<li class='click-enable choose_onoff' " + width + " nowId='" + that.data[i].id + "'><span style='position: absolute;top: 35px;'><label class='tgl-btn " + styr + "' for='cb1-1-0'></label></span></li>"
          } else {
            con += "<li class='click-enable choose_onoff' " + width + " nowId='" + that.data[i].id + "'><span style='position: absolute;top: 25px;'><label class='tgl-btn " + styr + "' for='cb1-1-0'></label></span></li>"
          }
          break
        case 'choose':
          var width2 = 'style="text-overflow: ellipsis;overflow: hidden;white-space:nowrap;margin-left:5px;width:' + that.icon[j].w + 'px;"';
          if (that.choose == 'one') {
            con += "<li class='click-enable choose_id' " + width2 + " title = '" + that.data[i][j] + "' nowId='" + that.data[i].id + "'>" + that.data[i][j] + "</li>"
          } else {
            con += "<li class='click-enable choose_id' " + width2 + " title = '" + that.data[i][j] + "' nowId='" + that.data[i].id + "'>" + that.data[i][j] + "</li>"
          }
          break
        case 'img':
          con += "<li " + width + "><img src='" + that.data[i][j] + "' style='width: 40px;height: 40px;margin-top: 15px;'></li>"
          break
        case 'action':
          var tempH = '<li class="tableList" ' + width + 'nowId="">'
          for (var w in action) {
            var title1 = w;
            if (w == "config") {
              tempH += '<a class="iconfont icon-caozuo" style="display:' + action[w].dis + '" title="" link="' + action[w].link + '">' + title1 + '</a>'
            } else {
              var titles;
              if (action[w].content) {
                titles = action[w].content
              } else {
                titles = title1
              }
              tempH += '<div class="content ' + w + '" style="display:' + action[w].dis + '" title="' + titles + '"link="' + action[w].link + '">' + titles + '</div>'
            }
          }
          tempH += '</li>'
          con += tempH;
          break
      }
    }
    con += '</ul></div>'
    return con;
  }
  showloading(value) {
    let that = this;
    that.dom.find('.load').removeClass('hide');
  }
  resize(value) {
    let that = this;
    if (that.dom.find('.overhide').dom) {
      that.dom.find('.overhide').dom.forEach(function (val, idx) {
        let bili = ES.selctorDoc(val).dom.attr('width1');
        ES.selctorDoc(val).dom.css({ 'max-width': bili + 'px' })
      })
    }
  }
}

//原型链一定要有的
module.exports = list;
