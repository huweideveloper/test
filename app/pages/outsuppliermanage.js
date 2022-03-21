class outsuppliermanage extends Interstellar.pagesBase {
  complete() {
    let that = this;
    this.addsupplier1 = require("../modal/addsupplier/addsupplier")
    this.addUser1 = require("../modal/addUser1/addUser")
    this.setTitle();
    this.action = {
      bianji: {dis: 'inline', link: 'noLink', titleText: '编辑'},
      xinzeng: {dis: 'inline', link: 'noLink', titleText: '添加用户'}
    }
    this.apidata = {
      page: 1,
      pageSize: 10
    }
    this.dom.find('.create').on('click',  () => {
      this.addsupplier = this.app.loadModal(this.addsupplier1, {adv: true}, {type: 'new'})
      this.addsupplier.event._addEvent('addsupplier.submit',async (data) => {
        this.app.loading.show()
        let res = await this.api.createsupplier(data)
          this.app.loading.hide()
          if (res.code == 0) {
            this.addsupplier.close();
            this.page = 1;
            this.setMain(true);
          } else {
            this.addsupplier.dom.find('.inputBox').after('<span class="required">'+res.msg+'</span>')
          }
      })
    })
    this.dom.find('.search').on('click', () => {
      this.apidata.page = 1;
      this.setMain(true);
    })
    this.dom.find('.gysmc').on('change',function ()  {
      that.apidata.name = ES.selctorDoc(this).val();
    })
  }

  setTitle() {
    let obj = {};
    obj['icon'] = {
      "name": {name: '<span data-i18n="zj">标注供应商名称</span>', type: 'text', w: '25%', ww: '25%', n: '40'},
      "inviteCode": {name: '<span data-i18n="gh">供应商邀请码</span>', type: 'text', w: '25%', ww: '25%'},
      "createTime": {name: '<span data-i18n="yymc">创建时间</span>', type: 'text', w: '25%', ww: '25%', new: false},
      "operation": {name: '<span data-i18n="action">操作</span>', type: 'action', code: 'action', w: '25%', ww: '25%'}
    };
    obj['tablewidth'] = ES.selctorDoc('.outsuppliermanage').box().clientWidth - 40;
    obj['type'] = 'center';
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table");
      this.table = this.app.loadModule(cont_table, this.dom.find('.suppliertable'), {
        id: 'accountlist',
        header: obj
      });
      this.table.event._addEvent('table.pagenumber', (value) => {
        this.apidata.page = parseInt(value);
        this.table.changenum(this.apidata.page);
        this.setMain();
      });
      this.table.event._addEvent('table.pagesize', (value) => {
        this.apidata.pageSize = value.num;
        this.apidata.page = 1;
        this.setMain(true);
      });
      this.table.event._addEvent('table.action',async (value) => {
        switch (value.classname) {
          case 'bianji':
            let json = {
              id: value.id.split(',')[0]
            }
            this.app.loading.show()
            let res =await this.api.viewsupplier(json)
            this.app.loading.hide()
              if (res.code == 0) {
                this.addsupplier = this.app.loadModal(this.addsupplier1, {adv: true}, {type: 'edit', data: res.data})
                this.addsupplier.event._addEvent('addsupplier.submit',async (data) => {
                  data.id = value.id.split(',')[0]
                  this.app.loading.show()
                  let res = await this.api.editsupplier(data)
                    this.app.loading.hide()
                    if (res.code == 0) {
                      this.addsupplier.close();
                      this.page = 1;
                      this.setMain(true);
                    } else{
                      this.addsupplier.dom.find('.inputBox').after('<span class="required">'+res.msg+'</span>')
                    }
                  })
              }
            break;
          case 'xinzeng':
            this.adduser = this.app.loadModal(this.addUser1, {adv: true}, {type: 'newout', title: '创建外部标注医生'})
            this.adduser.event._addEvent('addUser.submit',async (value1) => {
              value1.roleCodeList=[value1.roleListCode];
              value1.password = 'Fosun@123';
              value1.vendorInviteCode = value.id.split(',')[1]
              this.app.loading.show()
              let res = await this.api.createuser(value1)
              this.app.loading.hide()
                if (res.code == 0) {
                  this.adduser.close()
                } else{
                  this.adduser.dom.find('.inputBox').after('<span class="required">'+res.msg+'</span>')
                }
            })
            break;
        }
      });
      this.resize();
      this.setMain(true);
      this.initscroll();
    })
  }

  //查询全部成员/管理员小组成员
  async setMain(repage) {
    this.table.showloading()
    let res = await this.api.querysupplierlist(this.apidata)
    if (res.code == 0) {
      if (res.data.list.length > 0) {
        res.data.list.forEach((val) => {
          for (let i in val) {
            val[i] = val[i] == null ? '' : val[i]
          }
          val.id = val.id + ',' + val.inviteCode;
          val.operation = this.action;
          val.createTime = Tool.time(val.createTime, 'yyyy-mm-dd')
        })
        this.table.setData(res.data.list)
      } else {
        this.table.noData();
      }
    }
    if (repage) {
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
    ES.selctorDoc('.outsuppliermanage').css({'height': ch, 'width': cw})
    ES.selctorDoc('.maintable').css({'height': ch - 220, 'width': cw})
    ES.selctorDoc('.accountlist').css({'width': cw - 100});
  }
}

module.exports = outsuppliermanage;
