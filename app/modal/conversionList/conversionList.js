require('./conversionList.less')
// var html = require('./tpl.html')

class conversionList extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'conversionList'
      this.searchData={page:1,pageSize:10}
      this.exportData={}
      this.refreshPage = true;
    }
    complete() {
        let that = this
        this.render()
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close();
        })
      this.dom.find('.inputBox').on('change',function () {
        that.searchData[ES.selctorDoc(this).attr('api')] = ES.selctorDoc(this).val()
      })
        that.dom.find('.btnSearch').on('click', function() {
            that.refreshPage = true;
            that.searchData.page = 1;
          that.dom.find('.choose').removeClass('choose')
          that.event._dispatch('conversionList.search', that.searchData)
          that.exportData={}
        })
        that.dom.find('.reportBtn').on('click', function() {
          that.dom.find('.choose').removeClass('choose')
          console.log(that.exportData,'aaaa')
          if(JSON.stringify(that.exportData)!=='{}'){
            that.event._dispatch('conversionList.export', that.exportData)
            that.exportData={}
          }else{
            that.app.alert.show({
              title: ' ',
              msg: '请选择需要导入的获取编号',
              close: false
            })
          }

        })
        this.setTitle()
    }
    render (){
        let that = this;
        console.log(that.api.modalConfig)
        let config=[
             {
                className: 'xlk',
                name: 'algTarget',
                showname: '算法目的',
               datatype:'arr',
                data: that.api.modalConfig.algTarget
            },{
                className: 'xlk',
                name: 'modality',
                showname: '检查设备',
                data: Tool.configxlkformat(that.api.modalConfig.modality)
            }, {
                className: 'xlk',
                name: 'bodyPart',
                showname: '检查部位',
                data: Tool.configxlkformat(that.api.modalConfig.bodyPart)
            }
        ]
        that.singleobj={}
        require.ensure("../../moduleslibs/dropdown1/drop.js", ()=> {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            config.forEach( (val, idx) =>{
                that.singleobj[val.name] = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
                    className: 'xlk',
                    firstSelect: {val: val.showname, idx: ''},
                    data: val.data,
                    input:val.input,
                    maxshownum:5,
                    datatype:val.datatype
                })
                that.singleobj[val.name].event._addEvent('option.click', function (value) {
                    that.searchData[val.name] = value.idx
                })
                that.singleobj[val.name].event._addEvent('dropDown.clear', function (value) {
                    that.searchData[val.name] = ''
                })
            })
        })
    }
    setTitle() {
        let obj = {}
        let that = this;
        obj['icon'] = {
            "id": { name: '<span>获取编号</span>', type: 'text', code: 'checkid', w: '20%', ww: '20%', n: "45" },
            "algTarget": { name: '<span>算法目的</span>', type: 'text', code: 'checkid', w: '25%', ww: '25%' },
            "modality": { name: '<span>检查设备</span>', type: 'text', code: 'pid', w: '15%', ww: '15%', },
            "bodyPart": { name: '<span>检查部位</span>', type: 'text', code: 'pid', w: '15%', ww: '15%', },
            "acquireTime": { name: '<span>获取时间</span>', type: 'text', code: 'pid', w: '20%', ww: '20%', },
        };
        obj['type'] = 'center';
        obj['chose'] = 'all';
        obj['chosew'] = '30px';
        obj['tablewidth'] = ES.selctorDoc('.conversionList').box().clientWidth - 40;
        require.ensure("../../moduleslibs/table/table", function() {
            let cont_table = require("../../moduleslibs/table/table")
            that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
                id: 'datatable',
                header: obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.dom.find('.list-header .check-box').removeClass('choose')
                that.searchData.page = parseInt(value);
                that.exportData={}
                that.refreshPage = false;
                that.table.changenum(that.searchData.page);
                that.event._dispatch('conversionList.search', that.searchData)
            });
            that.table.event._addEvent('table.pagesize', function(value) {
                that.searchData.pageSize = value.num*1;
                that.searchData.page = 1;
                that.exportData={}
                that.refreshPage = true;
                that.event._dispatch('conversionList.search', that.searchData)
            });
          that.table.event._addEvent('table.check', (value) => {
            console.log(value,'value.check')
            let temp = value;
            if (temp.type == 'add') {
              that.exportData[temp.id] = value.data
            }else{
              delete that.exportData[temp.id]
            }
            console.log(that.exportData,'exportdata')
          });
          that.table.event._addEvent('table.allcheck', function(value) {
            console.log(value,'value')
            let temp = value;
            if(value.type == 'add'){
              value.data.forEach((item)=>{
                that.exportData[item.id] = item
              })
            }else{
              value.data.forEach((item)=>{
                delete that.exportData[item.id]
              })
            }
            console.log(that.exportData)
          });
            that.dom.find('.list-content').removeClass('hide');
        })
    }
    renderList(res) {
      let that = this;
      console.log(res,'ddddd')
        if (res.list.length > 0) {
            res.list.forEach((val, idx) => {
                for (let i in val) {
                    val[i] = (val[i] == null ? '' : val[i])
                }
              if (val.acquireTime) val.acquireTime = Tool.time(val.acquireTime, 'yyyy-mm-dd')
              Tool.configxlkformat(that.api.modalConfig.modality).forEach(function (a, b) {
                if (a.idx == val.modality) {
                  val.modality = a.val;
                }
              })
              Tool.configxlkformat(that.api.modalConfig.bodyPart).forEach(function (a, b) {
                if (a.idx == val.bodyPart) {
                  val.bodyPart = a.val;
                }
              })
            })
            that.table.setData(res.list)
        } else {
            that.table.noData();
        }
      if (this.refreshPage) {
        this.table.getTotal(res.pages, 2, res.total)
      }
        that.initscrollmenu();
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.datatable').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
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
module.exports = conversionList;
