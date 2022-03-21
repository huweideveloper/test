class imagedatagl1 extends DataBase {
  complete() {
    let that = this;
    // let config_fun = require("../../config/config_data.js")
    // this.condition = new config_fun(this.app.constmap)
    this.addli()
    this.loadlist('group', this.model.tableconfig[this.app.parpam['type']])
    this.model.tableconfig[this.app.parpam['type']].tablewidth = ES.selctorDoc('.imagedatagl1').box().clientWidth - 140
    this.dom.find('.exportlink').on('click', function () {
      if (that.nodata) {
        that.app.alert.show({
          title: ' ',
          msg: '未查询到对应数据，不支持导出！',
          close: true
        })
      } else {
         delete that.model.apiData.pageSize;
        delete that.model.apiData.page;
        let sting1 = encodeURI(JSON.stringify(that.model.apiData))
        that.api.HttpRequest.downLoadFile(`${that.app.domain}v1/series/export?data=${sting1}`)
      }
    })
    this.dom.find('.searchbtn').on('click', function () {
      that.model.condition[that.app.parpam['type']].forEach(function (val, idx) {
        if (val[0].name == 'inspectTime') {
          that.model.apiData.studyDateBegin = that.getfiltercondition()[val[0].name][0].startTime
          that.model.apiData.studyDateEnd = that.getfiltercondition()[val[0].name][0].endTime
        } else if (val[0].name == 'uploadTime') {
          that.model.apiData.importDateBegin = that.getfiltercondition()[val[0].name][0].startTime
          that.model.apiData.importDateEnd = that.getfiltercondition()[val[0].name][0].endTime
        } else if (val[0].type == 'dTexts') {
          that.model.apiData[val[0].name] = JSON.stringify(that.getfiltercondition()[val[0].name][0]) == '{}' ? null : that.getfiltercondition()[val[0].name]
        } else if (val[0].name == 'patientAgeType') {
          that.model.apiData[val[0].name] = that.getfiltercondition()[val[0].name][0]
          that.model.apiData.patientAgeLower = parseInt(that.getfiltercondition()[val[0].name][1].lower)
          that.model.apiData.patientAgeUpper = parseInt(that.getfiltercondition()[val[0].name][1].upper)
        } else if (val[0].name == 'check' || val[0].name == 'inspect') {
          that.model.apiData[val[0].name] = that.getfiltercondition()[val[0].name]
        } else {
          that.model.apiData[val[0].name] = that.getfiltercondition()[val[0].name].toString() == '' ? null : that.getfiltercondition()[val[0].name].toString()
        }
      })
      if (that.model.apiData.kernalfilter) {
        that.model.apiData.kernelLower = that.model.apiData.kernalfilter[0].lower;
        that.model.apiData.kernelUpper = that.model.apiData.kernalfilter[0].upper;
      }
      if (that.model.apiData.dyfilter) {
        that.model.apiData.kvpLower = that.model.apiData.dyfilter[0].lower;
        that.model.apiData.kvpUpper = that.model.apiData.dyfilter[0].upper;
      }
      if (that.model.apiData.csfilter) {
        that.model.apiData.layerCountLower = that.model.apiData.csfilter[0].lower;
        that.model.apiData.layerCountUpper = that.model.apiData.csfilter[0].upper;
      }
      if (that.model.apiData.chfilter) {
        that.model.apiData.sliceThicknessLower = that.model.apiData.chfilter[0].lower;
        that.model.apiData.sliceThicknessUpper = that.model.apiData.chfilter[0].upper;
      }
      if (that.model.apiData.windowWidth) {
        that.model.apiData.windowWidthLower = that.model.apiData.windowWidth[0].lower;
        that.model.apiData.windowWidthUpper = that.model.apiData.windowWidth[0].upper;
      }
      if (that.model.apiData.windowCenter) {
        that.model.apiData.windowCenterLower = that.model.apiData.windowCenter[0].lower;
        that.model.apiData.windowCenterUpper = that.model.apiData.windowCenter[0].upper;
      }
      that.model.apiData.conditions = []
      if (that.model.apiData.inspect) {
        let temp = []
        temp.push({ join: '', key: 'finding', value: that.model.apiData.inspect[1], operator: that.model.apiData.inspect[0] })
        temp.push({ join: that.model.apiData.inspect[2], key: 'finding', value: that.model.apiData.inspect[4], operator: that.model.apiData.inspect[3] })
        temp.push({ join: that.model.apiData.inspect[5], key: 'finding', value: that.model.apiData.inspect[7], operator: that.model.apiData.inspect[6] })
        that.model.apiData.conditions.push({ join: '', items: temp })
      }
      if (that.model.apiData.check) {
        let temp = []
        temp.push({ join: '', key: 'conclusion', value: that.model.apiData.check[1], operator: that.model.apiData.check[0] })
        temp.push({ join: that.model.apiData.check[2], key: 'conclusion', value: that.model.apiData.check[4], operator: that.model.apiData.check[3] })
        temp.push({ join: that.model.apiData.check[5], key: 'conclusion', value: that.model.apiData.check[7], operator: that.model.apiData.check[6] })
        that.model.apiData.conditions.push({ join: that.model.apiData.inspect[8], items: temp })
      }
      if (that.model.apiData.valid) {
        that.model.apiData.valid = Boolean(1 * that.model.apiData.valid)
      }
      if (that.model.apiData.jpgValid) {
        that.model.apiData.jpgValid = Boolean(1 * that.model.apiData.jpgValid)
      }
      delete that.model.apiData.check
      delete that.model.apiData.inspect
      delete that.model.apiData.chfilter
      delete that.model.apiData.kernalfilter
      delete that.model.apiData.csfilter
      delete that.model.apiData.dyfilter
      that.model.apiData.page = 1;
      that.search(true)
    })
  }
  async search(bool) {
    let that = this;
    let data2 = []
    that.tablecont.showloading()
    let res = await that.api.queryseries(that.model.apiData)
      if (res.code == 0) {
        if (res.data.list.length > 0) {
          that.nodata = false;
          res.data.list.forEach(function (val, idx) {
            for (let i in val) {
              val[i] = val[i] == null ? '' : val[i]
            }
            val.finding = val.finding == null ? '' : val.finding;
            val.conclusion = val.conclusion == null ? '' : val.conclusion;
            val.valid = val.valid ? '是' : '否';
            switch (val.patientSex) {
              case 'M':
                val.patientSex = '男';
                break;
              case 'F':
                val.patientSex = '女'
                break;
              default:
                val.patientSex = ''
            }
            Tool.configxlkformat(that.app.constmap['BODY_PART']).forEach(function (a, b) {
              if (a.idx == val.bodyPart) {
                val.bodyPart = a.val;
              }
            })
            Tool.configxlkformat(that.app.constmap['MODALITY']).forEach(function (a, b) {
              if (a.idx == val.modality) {
                val.modality = a.val;
              }
            })
            let temparr = [{ name: 'stainingMethod', NAME: 'STAINING_METHODS' }, { name: 'sampleClassification', NAME: 'SAMPLE_CLASSIFICATION' }, { name: 'sampleLocation', NAME: 'SAMPLE_LOCATION' }, { name: 'sampleMethod', NAME: 'SAMPLING_METHODS' }]
            temparr.forEach(function (val1, idx) {
              val[val1.name] = '';
              Tool.configxlkformat(that.app.constmap[val1.NAME]).forEach(function (a, b) {
                if (a.idx == val.attribute[val1.NAME]) {
                  val[val1.name] = a.val;
                }
              })
            })
            let obj = {}
            obj.id = val.seriesInstanceUID;
            obj.operation = that.model.listicon.action
            data2.push(obj)
          })
          that.tablecont.setData(res.data.list, data2);
        } else {
          that.tablecont.noData();
        }
      }
      if (bool) {
        that.tablecont.getTotal(res.data.pages, 2, res.data.total)
      }
      that.initscroll();
  }

  toggletab(value) {
    this.app.changePage('imagedatagl1', { type: value.id })
  }

  listaction(value) {
    let that = this;
    switch (value.classname) {
      case 'view':
        let url1 = window.location.href;
        let url = url1.split('#')[0] + '#!/seriesdetail/' + value.id;
        let link = document.createElement('a');
        link.target = "_blank";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
    }

  }
  //设置下拉框默认选项
  conditionconfig() {
    this.dom.find('.icon-bianji').on('click',async () => {
      let json={
        page:1,
        pageSize:10
      }
      this.app.loading.show()
      let res = await this.api.getpaishu(json)
        this.app.loading.hide()
        if(res.data.list.length==0||res.data.list==null){
          this.app.alert.show({
            title: ' ',
            msg: '无机器型号需要补充排数！',
            close: true
          })
        }else{
          let psbc=require("../modal/paishuxuanze/paishuxuanze")
          this.pslist=this.app.loadModal(psbc,{adv:true},res.data)
          this.pslist.event._addEvent('paishuxuanze.save',async (val) => {
            let json1={
              model:val.id,
              row:val.val
            }
            this.app.loading.show()
            let res = await this.api.updatepaishu(json1)
            this.app.loading.hide()
              if(res.code==0){
                this.getpaishu({
                  page:1,
                  pageSize:10
                },true)
              }else{
                alert('补充失败')
              }
            })
          this.pslist.event._addEvent('paishuxuanze.pagenumber', (val) => {
            this.getpaishu({
              page:val.page,
              pageSize:10
            },false)
          })
          this.pslist.event._addEvent('paishuxuanze.pagesize', (val) => {
            this.getpaishu({
              page:1,
              pageSize:val.pagesize
            },true)
          })
        }
    })
    if (this.app.parpam['type'] == 'fs') {
      this.dom.find('.inspect .drop-down .selectbox').dom.forEach(function (val, idx) {
        val.find('li').eq(0).click()
      })
      this.dom.find('.check .drop-down .selectbox').dom.forEach(function (val, idx) {
        val.find('li').eq(0).click()
      })
      this.dom.find('.valid .drop-down .selectbox li[data-idx="1"]').click()
    }
  }

  async getpaishu(value,value2){
    let that=this;
    that.app.loading.show()
    let res = await that.api.getpaishu(value)
    that.app.loading.hide()
    if(res.code==0){
      that.pslist.setMain(value2,res.data);
    }else{
    }
  }

  getapidata(value) {
    if (value) {
      switch (value.name) {
        case 'hospitalCode':
          this.chooseData.moduleobj.hospitalCode.loading(true)
          this.hospitalCode(value.data.data ? value.data.data.trim() : "");
          break;
      }
    } else {
      this.chooseData.moduleobj.hospitalCode.loading(true)
      this.hospitalCode('');
    }
  }

  async hospitalCode(code) {
    let {data} = await this.api.hospitalCode({code})
    this.chooseData.moduleobj.hospitalCode.loading(false)
      let temparr = data.list.map((item) => {
        return {
          idx:item.code,
          val:item.code
        }
      })
    this.chooseData.renderHtml(temparr, 'hospitalCode')
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.imagedatagl1').attr('id', rid)
    this.myScroll = new IScroll('#' + rid, {
      scrollbars: true,
      mouseWheel: true,
      probeType: 2,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    });
  }

  inittable() {
    if (this.myScroll1) {
      this.myScroll1.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.maintable').attr('id', rid)
    this.myScroll1 = new IScroll('#' + rid, {
      scrollbars: true,
      mouseWheel: true,
      scrollX: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    });
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    ES.selctorDoc('.imagedatagl1').css({'height': ch - 100, 'width': cw});
  }
}

module.exports = imagedatagl1;
