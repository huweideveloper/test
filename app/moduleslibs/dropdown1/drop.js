require('./drop.less')
// var html = require('./tpl.html')

class index extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = "dropDown"
  }
  complete() {
    this.dom.find('.drop-down').addClass(this.nowParam.className)
    let cw = ES.selctorDoc(window).box().clientWidth
    let ch = ES.selctorDoc(window).box().clientHeight
    this.dom.find('.mask').css({ 'width': cw, 'height': ch, 'left': 0, 'top': 0 })
    this.datatype = this.nowParam.datatype ? this.nowParam.datatype : 'obj';
    this.input = this.nowParam.input == undefined ? false : this.nowParam.input;
    this.maxshownum = this.nowParam.maxshownum == undefined ? 10 : this.nowParam.maxshownum
    this.render()
  }
  render(value) {
    if (!value) {
      value = this.nowParam
    }
    let that = this
    that.firstSelect = value.firstSelect ? value.firstSelect : value.data[0]
    this.dom.find('.selected1 input').attr('data-idx', that.firstSelect.idx)
    this.dom.find('.selected1 input').attr('placeholder', that.firstSelect.val)
    that.renderHtml(value.data);
    that.bindEvent();
    that.event._dispatch('dropDown.done')
  }
  renderHtml(value) {
    // console.log('==========value',value,this.datatype)
    let that = this;
    that.data = value;
    let strHtml = ''
    if (this.datatype == 'obj') {
      for (let i = 0; i < value.length; i++) {
        if (that.firstSelect == value[i]) {
          strHtml += '<li class="option select" title="' + value[i].val + '" data-idx=' + value[i].idx + ''+' props='+(value[i].props?value[i].props:"")+'>' + value[i].val + '</li>'
        } else {
          strHtml += '<li class="option" title="' + value[i].val + '" data-idx=' + value[i].idx +''+ ' props='+(value[i].props?value[i].props:"")+'>' + value[i].val + '</li>'
        }
      }
    } else {
      for (let i = 0; i < value.length; i++) {
        if (that.firstSelect == value[i]) {
          strHtml += '<li class="option select" title="' + value[i] + '" data-idx=' + value[i] + '>' + value[i] + '</li>'
        } else {
          strHtml += '<li class="option" title="' + value[i] + '" data-idx=' + value[i] + '>' + value[i] + '</li>'
        }
      }
    }
    this.dom.find('._dropdown1 .selectbox').html(strHtml)
    this.dom.find('.option').on('click', function () {
      that.dom.find('.option').removeClass('select')
      ES.selctorDoc(this).addClass('select')
      that.dom.find('.selected1 input').val(ES.selctorDoc(this).html())
      that.dom.find('.selected1 input').attr('data-idx', ES.selctorDoc(this).attr('data-idx'))
      that.dom.find('.selected1 input').attr('props', ES.selctorDoc(this).attr('props'))
      that.dom.find('._dropdown1').hide()
      that.dom.find('.icon').removeClass('drop')
      that.event._dispatch('option.click', {
        val: that.dom.find('.selected1 input').val(),
        idx: that.dom.find('.selected1 input').attr('data-idx'),
        props: that.dom.find('.selected1 input').attr('props')
      })
    })
    that.initscrollmenu()
  }
  bindEvent() {
    let that = this;
    this.dom.find('.selected1').on('click', function (e) {
      e.stopPropagation();
      // disabled 不能选择
      const isDisabled = that.dom.find('.selected1 .drop_disabled').dom
      if (isDisabled) return false

      let dom = ES.selctorDoc(this)
      dom.find('.icon').addClass('drop')
      dom.parent().find('._dropdown1').show()
      const tempDoms = that.dom.find('.option').dom
      if (tempDoms && tempDoms.length > that.maxshownum) {
        that.dom.find('.scroll').css({ height: that.dom.find('.drop-down').box().clientHeight * that.maxshownum })
        that.dom.find('.scroll').css({ overflow: 'hidden' })
        that.initscrollmenu();
      }
      that.dom.find('.mask').show()
    })
    this.dom.find('.selected1').on('mouseover', function () {
      let dom = ES.selctorDoc(this)
      let data = dom.find('input').attr('data-idx')
      if (data) {
        ES.selctorDoc(this).find('.icon-shanchutishiicon').show()
        ES.selctorDoc(this).find('.icon').hide()
      }
    })
    this.dom.find('.selected1').on('mouseout', function () {
      ES.selctorDoc(this).find('.icon-shanchutishiicon').hide()
      ES.selctorDoc(this).find('.icon').show()
    })
    this.dom.find('.selected1 .icon-shanchutishiicon').on('click', function (e) {
      e.stopPropagation();
      ES.selctorDoc(this).parent().find('.nowname').attr('placeholder', that.firstSelect.val)
      ES.selctorDoc(this).parent().find('.nowname').val('')
      ES.selctorDoc(this).parent().find('.nowname').attr('data-idx', that.firstSelect.idx)
      that.dom.find('.select').removeClass('select')
      that.event._dispatch('dropDown.clear')
    })
    this.dom.find('._dropdown1 .mask').on('click', function () {
      ES.selctorDoc(this).parent().hide()
      that.dom.find('.icon').removeClass('drop')
      that.dom.find('.loading_xlk').addClass('drop')
    })
    if (!that.input) {
      that.dom.find('.nowname').attr('readonly', 'readonly')
    } else {
      this.dom.find('.nowname').on('input', function () {
        that.event._dispatch('drop.input', { data: ES.selctorDoc(this).val(), classname: ES.selctorDoc(this).parent().parent().parent().attr('class') })
      })
      this.dom.find('.nowname').on('focus', function () {
        that.dom.find('.nowname').attr('placeholder', '');
      })
      this.dom.find('.nowname').on('blur', function () {
        that.dom.find('.nowname').attr('placeholder', that.nowParam.firstSelect.val)
      })
    }
  }
  reset(value) {
    this.dom.find('.selected1 input').attr('placeholder', this.nowParam.firstSelect.val)
    this.dom.find('.selected1 input').val('')
    this.dom.find('.selected1 input').attr('data-idx', this.nowParam.firstSelect.idx)
    this.dom.find('.select').removeClass('select')
    this.dom.find('._dropdown1 .selectbox .option').eq(0).addClass('select')
    if (!value) {
      this.event._dispatch('option.click', {
        val: this.dom.find('.selected1 input').val(),
        idx: this.dom.find('.selected1 input').attr('data-idx')
      })
    }

  }
  setChoose(value) {
    let that = this;
    that.data.forEach(function (val, idx) {
      if (val.idx == value) {
        this.dom.find('.selected1 input').attr('data-idx', val.idx)
        this.dom.find('.selected1 input').attr('placeholder', val.val)
      }
    })
  }
  disable() {
    let that = this;
    // that.dom.find('.selected1').off('click');
    that.dom.find('.selected1').off('mouseover')
    that.dom.find('.nowname').addClass('drop_disabled');
    that.dom.find('.nowname').attr('readonly', 'readonly');
    that.dom.find('.drop-down').addClass('drop_disabled');
  }
  able() {
    let that = this;
    that.dom.find('.nowname').removeClass('drop_disabled');
    that.dom.find('.drop-down').removeClass('drop_disabled');
    // that.dom.find('.selected1').on('click', function (e) {
    //   e.stopPropagation();
    //   // disabled 不能选择
    //   const isDisabled = that.dom.find('.selected1 .drop_disabled').dom
    //   if (isDisabled) return false

    //   let dom = ES.selctorDoc(this).parent()
    //   dom.find('.icon').addClass('drop')
    //   dom.parent().find('._dropdown1').show()
    //   if (that.dom.find('.option').dom.length > that.maxshownum) {
    //     that.dom.find('.scroll').css({ height: that.dom.find('.drop-down').box().clientHeight * that.maxshownum })
    //     that.dom.find('.scroll').css({ overflow: 'hidden' })
    //     that.initscrollmenu();
    //   }
    //   that.dom.find('.mask').show()
    // })
  }
  loading(bool) {
    if (bool) {
      this.dom.find('.selectbox').html('')
      this.dom.find('.loading_xlk').removeClass('hide')
    } else {
      this.dom.find('.loading_xlk').addClass('hide')
    }
  }
  initscrollmenu() {
    if (this.myScroll1) {
      this.myScroll1.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    this.dom.find('.scroll').attr('id', rid)
    this.myScroll1 = new IScroll('#' + rid, {
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
  }
}

//原型链一定要有的
module.exports = index;
