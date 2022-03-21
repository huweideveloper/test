require('./datacondition.less')
// var html = require('./tpl.html')
import SelectTablePage from '@/components/select-table-page'

class bztoollist extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = "datacondition"
        this.data = {}
        this.needCompent = {}

        this.moduleobj={}

    }
    complete() {
        let that = this
        this.dom.find('.btnarea .searchbtn').on('click', (item) => {
            this.event._dispatch('datacondition.search')
        })
        this.dom.find('.btnarea .exportlink').on('click', (item) => {
            this.event._dispatch('datacondition.export')
        })
        require.ensure(["../../moduleslibs/dropdown1/drop.js", "../../moduleslibs/duoxuanxlk/duoxuanxlk.js", "../../moduleslibs/times_double/times.js"], function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            that.needCompent['dropdown'] = dropdown
            let duoxuanxlk = require("../../moduleslibs/duoxuanxlk/duoxuanxlk.js")
            that.needCompent['duoxuanxlk'] = duoxuanxlk
            let calendar = require('../../moduleslibs/times_double/times.js')
            that.needCompent['calendar'] = calendar
            that.setData()
            that.event._dispatch('datacondition.moduledone')
        })
    }
    setData(refreshdata) {
      this.dom.find('.condition').html('')
      if(refreshdata){
        refreshdata.map((item) => {
          this.part(item)
        })
      }else{
        this.initDate.data.map((item) => {
          this.part(item)
        })
      }
    }
    part(value) {
        this.dom.find('.condition').append('<div class="content ' + value[0].name + '"></div>')
        this.data[value[0].name]=[]
        for (let i = 0; i < value.length; i++) {
            this.allControl(value[i], i)
        }
    }
    allControl(value, pos) {
        this.dom.find('.condition .' + value.name).append('<div class="signlecontent' + pos + ' fl"></div>')
        eval('this.' + value.type + '(value,pos)')
    }
    // 下拉分页下拉列表，使用vue组件select-table-page
    selectTablePage(value, pos) {
      const that = this
      const id = `signlecontent${pos}`
      const { name, showname, key, keywordName, searchApi, params = {}, keyName, valueName, multiple } = value

      const el = this.dom.find(`.condition .${name} .${id}`)
      el.append(`
          <div id="${id}">
            <select-table-page
              placeholder="请选择${showname}"
              v-model="${key}"
              :data="likeListPage"
              :remote-method="queryListPage"
              :key-name="keyName"
              :value-name="valueName"
              :multiple="multiple"
            ></select-table-page>
          </div>
        `)
      new Vue({
        el: `#${id}`,
        components: {
          SelectTablePage,
        },
        data() {
          return {
            [key]: '',
            keyName,
            valueName,
            multiple,
            likeListPage: {},
          }
        },
        watch: {
          [key](val) {
            that.data[key][0] = val
          },
        },
        mounted() {
          this.queryListPage()
        },
        methods: {
          queryListPage({ value = '', page = 1, pageSize = 10 } = {}) {
            setTimeout(async () => {
              const qparams = {
                noLoading: true,
                page,
                pageSize,
                [keywordName]: value,
                ...params,
              }
              const res = await eval(searchApi)(qparams)
              this.likeListPage = res.data
            }, 500)
          },
        },
      })
    }

    dobuledropdown(value, pos) {
        //console.log(value, 'dobuledropdowndobuledropdown')
        let that = this
        let inputSt = value.input
        let myname = this.app.loadModule(this.needCompent['duoxuanxlk'], this.dom.find('.condition .' + value.name + ' .signlecontent' + pos), {
            showname: value.showname,
            data: value.data,
            datatype: value.datatype,
            input: value.input ? value.input : false,
            code: value.name,
            pos: pos
        })
        myname.event._addEvent('duoxuan.select', function(value) {
            that.data[myname.initDate.code][myname.initDate.pos] = value.name
        })
        myname.event._addEvent('duoxuan.input', function(value) {
            // if (inputSt) {
            //     that.data[myname.initDate.code]['key'] = value.data
            //     that.event._dispatch('datacondition.duoxuanInput')
            // }
            that.event._dispatch('datacondition.dropinput',{data:value,name:myname.initDate.code})
        })
        myname.event._addEvent('duoxuanxlk.clear', function(value) {
            that.data[myname.initDate.code][myname.initDate.pos] = ''
            that.event._dispatch('datacondition.dropinput',{data:'',name:myname.initDate.code})
        })
        that.moduleobj[myname.initDate.code]=myname

    }
    dropdown(item, pos) {
        let that = this
        let myname = this.app.loadModule(this.needCompent['dropdown'], this.dom.find('.condition .' + item.name + ' .signlecontent' + pos), {
            className: 'xlk',
            firstSelect: { val: item.showname, idx: '' },
            data: item.data,
            code: item.name,
            datatype:item.datatype,
            input:item.input?item.input:false

        })
        myname.event._addEvent('option.click', function(value) {
            that.data[myname.initDate.code][pos] = value.idx
        })
        myname.event._addEvent('dropDown.clear', function(value) {
            that.data[myname.initDate.code][pos] = ''
            that.event._dispatch('datacondition.dropinput',{data:'',name:myname.initDate.code})
        })

        myname.event._addEvent('drop.input', function(value) {
            that.event._dispatch('datacondition.dropinput',{data:value,name:myname.initDate.code})
        })
        that.moduleobj[myname.initDate.code]=myname

    }
    dropdownS(item, pos) {
        let that = this
        this.dom.find('.condition .' + item.name + ' .signlecontent' + pos).append('<span class="radioonly" style="margin:0 10px 0 5px">' + item.showname + '</span>')
        this.dom.find('.condition .' + item.name + ' .signlecontent' + pos).append('<div class="dropdownContent" style="display: inline-block;"></div>')
        let fname = item.showname
        if (item.name == "check" || item.name == "inspect") {
            fname = item.data[0].val
        }
        let myname = this.app.loadModule(this.needCompent['dropdown'], this.dom.find('.condition .' + item.name + ' .signlecontent' + pos + ' .dropdownContent'), {
            className: 'xlk',
            firstSelect: { val: fname, idx: '' },
            data: item.data,
            code:item.name,

            datatype:item.datatype,
            input:item.input?item.input:false

        })
        myname.event._addEvent('option.click', function(value) {
            console.log(myname.initDate.code)
            that.data[myname.initDate.code][pos] = value.idx
        })
        myname.event._addEvent('dropDown.clear', function(value) {
            that.data[myname.initDate.code][pos] = ''
        })
      myname.event._addEvent('drop.input', function(value) {
        that.event._dispatch('datacondition.dropinput',{data:value,name:myname.initDate.code})
      })
        that.moduleobj[myname.initDate.code]=myname

    }
    dTexts(value, pos) {
        let str = `<span>` + value.showname + `</span>
                <input type="text" class="lower dText" check="num">
                <label>-</label>
            <input type="text" class="upper dText" check="num">`
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append(str)
        this.data[value.name].push({})
        this.dom.find('.condition .' + value.name + ' .lower').on('blur', () => {
            console.log(this.data,value.name)
            this.data[value.name][pos]['lower'] = this.dom.find('.condition .' + value.name + ' .lower').val()
        })
        this.dom.find('.condition .' + value.name + ' .upper').on('blur', () => {
            this.data[value.name][pos]['upper'] = this.dom.find('.condition .' + value.name + ' .upper').val()
        })
    }
    dText(value, pos) {
        let str = `<input type="text" class="lower dText" check="num">
                <label>-</label>
            <input type="text" class="upper dText" check="num">`
        this.dom.find('.condition .' + value.name+ ' .signlecontent' + pos).append(str)
        this.data[value.name][pos]={}
        console.log(this.data)
        this.dom.find('.condition .' + value.name + ' .lower').on('blur', () => {
            console.log(this.data,'value.name')
            this.data[value.name][pos]['lower'] = this.dom.find('.condition .' + value.name + ' .lower').val()
        })
        this.dom.find('.condition .' + value.name + ' .upper').on('blur', () => {
            this.data[value.name][pos]['upper'] = this.dom.find('.condition .' + value.name + ' .upper').val()
        })

    }
    texts(value, pos) {
        let str = `<span>` + value.showname + `</span>
        <input type="text" class="inputtext textData" style="display:inline-block" value="${value.data?value.data:''}" ${value.input===false?'readonly':''}>`
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append(str)
        this.dom.find('.condition .' + value.name + ' .textData').on('blur', () => {
            console.log(pos,value.name)
            this.data[value.name][pos]=this.data[value.name][pos]?this.data[value.name][pos]:{}
            this.data[value.name][pos] = this.dom.find('.condition .' + value.name + ' .textData').val()
        })
    }
    time(value, pos) {
        let that = this
        let code = value.name
        that.data[code].push({})
        let todayTime = new Date()
        let Month = todayTime.getMonth() + 1 < 10 ? '0' + (todayTime.getMonth() + 1) : (todayTime.getMonth() + 1)
        let today = todayTime.getFullYear() + '-' + Month + '-' + todayTime.getDate()
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append('<span class="radioonly">' + value.showname + '</span>')
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append('<div class="timefilter" style="display: inline-block;"></div>')
        let timeCotrol = this.app.loadModule(this.needCompent['calendar'], this.dom.find('.condition .' + value.name + ' .signlecontent' + pos + ' .timefilter'), { titleShow: false, defaultword: '请选择时间' })
        timeCotrol.event._addEvent('times1.day', function(value) {
            console.log(value, 'valuetime',that.data)
            that.data[code][pos]['startTime'] = value.st ? value.st + " 00:00:00" : ''
            that.data[code][pos]['endTime'] = value.et ? value.et + " 23:59:59" : ''
            console.log(that.apidata)
        })
        timeCotrol.event._addEvent('times.dele', function(value) {
            if (value.dom.hasClass('day_left')) {
                that.data[code][pos]['startTime'] = ''
            } else {
                that.data[code][pos]['endTime'] = '';
            }
        })
    }
    text(value, pos) {
        let str = `<input type="text" class="inputtext textData" placeholder="${value.showname}">`
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append(str)
        this.data[value.name][pos]=''
        this.dom.find('.condition .' + value.name + ' .textData').on('blur', () => {
            console.log(this.dom.find('.condition .' + value.name+ ' .signlecontent' + pos + ' .textData').val(),value.name)
            this.data[value.name][pos] = this.dom.find('.condition .' + value.name+ ' .signlecontent' + pos + ' .textData').val()
        })
    }
    editdone(value, pos) {
        let str = '<a class="iconfont icon-bianji radioonly"></a>'
        let code = value.name
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos).append(str)
        this.dom.find('.condition .' + value.name + ' .signlecontent' + pos + ' .icon-bianji').on('click', () => {
            this.event._dispatch('datacondition.editor', { code: code })
        })
    }
//渲染下拉框内容
    renderHtml(value,type){
        this.moduleobj[type].renderHtml(value)
    }

}

//原型链一定要有的
module.exports = bztoollist;
