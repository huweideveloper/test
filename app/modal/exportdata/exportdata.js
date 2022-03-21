require('./exportdata.less')

class exportdata extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = 'exportdata'
    this.flag = true;
    this.code = ''
    this.data = value;
    this.apiData = {transferNii:false}
  }

  complete() {
    let that = this
    this.dom.find('.icon-guanbi').on('click', function () {
      that.close();
    })
    this.dom.find('.cancel').on('click', function () {
      that.close();
    })
    this.dom.find('.filechoose').on('click', function () {
      that.dom.find('.file').click()
    })
    that.dom.find('.file').on('change', function () {
      let filePath = ES.selctorDoc("#file1").val();
      that.dom.find('.filename').val(filePath)
    })
    this.dom.find('.upload').on('click', () => {
      that.dom.find('.inputLine').dom.forEach(function (val, idx) {
        val.find('.' + val.attr('redlabel')).removeClass('redborder')
        val.find('.required').remove();
        if (Tool.checkForm(ES.selctorDoc(val).dom, 'red') !== '') {
          val.find('.' + val.attr('redlabel')).addClass('redborder')
          val.find('.' + val.attr('redlabel')).after('<span class="required">' + Tool.checkForm(ES.selctorDoc(val).dom, 'red') + '</span>')
        }
      })
      if (that.dom.find('.redborder').dom && that.dom.find('.redborder').dom.some((item) => { return item.box().clientHeight !== 0 })) {
        return false
      } else {
        that.event._dispatch('uploadalgdata.upload', {data: that.apiData})
      }
    })
    this.render()
  }

  render(value) {

  }
}

//原型链一定要有的
module.exports = exportdata;
