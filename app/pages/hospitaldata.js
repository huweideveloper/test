class hospitaldata extends Interstellar.pagesBase {
  complete() {
    let that = this;
    this.adddepart1 = require("../modal/editdataconfig/editdataconfig")
    this.render();
    this.setTitle();
    this.action = {
      bianji: {dis: 'inline', link: 'noLink', titleText: '编辑'}
    }
    this.apidata = {
      name: '',
      page: 1,
      pageSize: 10
    }
    //新增用户
    this.dom.find('.create').on('click', () => {
      this.openmodal('create')
    })
    this.dom.find('.search').on('click', () => {
      this.apidata.page = 1;
      this.setMain(true)
    })
    this.dom.find('.filterarea input').on('change', function() {
      that.apidata[ES.selctorDoc(this).attr('api')] = ES.selctorDoc(this).val();
    })
  }

  render() {
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      this.type1 = this.app.loadModule(dropdown, this.dom.find('.type'), {
        className: 'xlk',
        firstSelect: {val: '机构类型', idx: ''},
        data: [{idx: 'HOSPITAL', val: '医院'}, {idx: 'ENTERPRISE', val: '企业'}]
      })
      this.type1.event._addEvent('option.click', (value) => {
        this.apidata['type'] = value.idx;
      })
      this.type1.event._addEvent('dropDown.clear', (value) => {
        this.apidata['type'] = '';
      })
    })
  }

  setTitle() {
    let obj = {};
    let obj1 = {};
    obj['icon'] = {
      "code": {name: '<span data-i18n="pname">机构编码</span>', type: 'text', w: '30%', ww: '30%', n: '40'},
      "name": {name: '<span data-i18n="zj">机构名称</span>', type: 'text', w: '25%', ww: '25%'},
      "type1": {name: '<span data-i18n="gh">机构类型</span>', type: 'text', w: '25%', ww: '25%'},
      "operation": {name: '<span data-i18n="yymc">操作</span>', type: 'action', w: '20%', ww: '20%'},
    };
    obj['tablewidth'] = ES.selctorDoc('.hospitaltable').box().clientWidth - 40;
    obj['type'] = 'center';
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table");
      this.table = this.app.loadModule(cont_table, this.dom.find('.hospitaltable'), {
        id: 'accountlist',
        header: obj
      });
      this.table.event._addEvent('table.pagenumber', (value) => {
        this.apidata.page = parseInt(value);
        this.table.changenum(this.apidata.page);
        this.setMain();
      });
      this.table.event._addEvent('table.pagesize',  (value) =>{
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.setMain(true);
      });
      this.table.event._addEvent('table.action',  (value) => {
        switch (value.classname) {
          case 'bianji':
            this.openmodal('edit', this.listdata[value.id])
            break;
        }
      });
      this.resize();
      this.setMain(true);
      this.initscroll();
    })
  }

  openmodal(type, data) {
    this.adddepart = this.app.loadModal(this.adddepart1, {
      adv: false,
      class: 'xs',
      title: type == 'edit' ? '编辑机构' : '创建新机构',
      type: "drop",
      data: data
    })
    this.adddepart.event._addEvent('modal.confirm', async () => {
      let checkSorce = this.checkAll(this.adddepart)
      if (!checkSorce) {
        return
      }
      switch (type) {
        case 'create':
          this.app.loading.show()
          let res = await this.api.hospital_create(this.adddepart.data)
          this.app.loading.hide()
            if (res.code == 0) {
              this.adddepart.close()
              this.apidata.page = 1;
              this.setMain(true)
            } else {
              this.adddepart.showerror([{
                name: (res.msg.lastIndexOf('名称') != -1 ? 'name_e' : 'code_e'),
                msg: res.msg
              }])
            }
          break;
        case 'edit':
          this.app.loading.show()
          let updateRes = await this.api.hospital_update(this.adddepart.data)
            this.app.loading.hide()
            if (updateRes.code == 0) {
              this.adddepart.close()
              this.apidata.page = 1;
              this.setMain(true)
            } else {
              this.adddepart.showerror([{
                name: (updateRes.msg.lastIndexOf('名称') != -1 ? 'name_e' : 'code_e'),
                msg: updateRes.msg
              }])
            }
          break;
      }
    })
  }

  checkAll(editdataconfig) {
    ES.selctorDoc('.errorlist').addClass('hide')
    if (JSON.stringify(editdataconfig.data) == '{}') {
      editdataconfig.showerror([{name: 'name_e', msg: "名称不能为空"}, {name: 'code_e', msg: "编码不能为空"}, {
        name: 'type_e',
        msg: "请选择机构类型"
      }])
      return false
    }
    let flag = true
    if (!editdataconfig.data.name) {
      editdataconfig.showerror([{name: 'name_e', msg: "名称不能为空"}])
      flag = false
    }
    if (!editdataconfig.data.type) {
      editdataconfig.showerror([{name: 'type_e', msg: "请选择机构类型"}])
      flag = false
    }
    if (!editdataconfig.data.code) {
      editdataconfig.showerror([{name: 'code_e', msg: "编码不能为空"}])
      flag = false
    }
    if (!flag) {
      return false
    }
    // if (editdataconfig.data.type == 'HOSPITAL') {
    //   if (editdataconfig.data.code * 1 < 1000 || editdataconfig.data.code * 1 > 7000) {
    //     editdataconfig.showerror([{name: 'code_e', msg: "编码需大于1000"}])
    //     return false
    //   }
    // } else {
    //   if (editdataconfig.data.code * 1 < 7000) {
    //     editdataconfig.showerror([{name: 'code_e', msg: "编码需大于7000"}])
    //     return false
    //   }
    // }
    return true
  }

  async setMain(bool) {
    this.table.showloading()
    let res =await this.api.hospital_search(this.apidata)
      if (res.code == 0) {
        if (res.data.list.length > 0) {
          this.listdata = res.data.list;
          res.data.list.forEach((val,idx) => {
            for (let i in val) {
              val[i] = val[i] == null ? '' : val[i]
            }
            val.operation = this.action
            val.id = idx
            this.listdata[idx] = val
            val.type1 = val.type == 'HOSPITAL' ? '医院' : '企业'
          })
          this.table.setData(res.data.list)
        } else {
          this.table.noData();
        }
      }
      if (bool) {
        this.table.getTotal(res.data.pages, 2, res.data.total)
      }
    this.initscroll();
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh()
      return
    }
    var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
    ES.selctorDoc('.maintable').attr('id', rid)
    this.myScroll = new IScroll('#' + rid, {
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
    let cw = ES.selctorDoc(window).box().clientWidth - 240
    let ch = ES.selctorDoc(window).box().clientHeight - 100
    ES.selctorDoc('.hospitaldata').css({'height': ch, 'width': cw})
    ES.selctorDoc('.hospitaltable').css({'width': cw})
    ES.selctorDoc('.maintable').css({'height': ch - 170});
  }

}

module.exports = hospitaldata;
