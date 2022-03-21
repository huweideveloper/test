require('./companyli.less')
// var html = require('./tpl.html')
import InputNumber from '@/components/input-number/index.vue'

class companyli extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = "bztoolli"
    this.data = value
    this.status = this.data.status || this.app.parpam.status || 1
    this.vuePage = null
  }
  complete() {
    this.initVuePage(`#company${this.data.num}`)
  }

  // Vue相关
  initVuePage(el) {
    const that = this
    this.vuePage = new Vue({
      el,
      components: { InputNumber },
      data() {
        return {
          status: Number(that.status),
          companyarr: [], // 所有的company
          dataNum: that.data.num,
          previous: that.data.previous,
          actionType: that.nowParam.type || '',
          choosedUser: [],
          form: {
            venderId: '',
            userList: [],
            cost: '',
            costVisible: false
          },
          firstRender: true,
          venderList: [],
          userSelectList: [],
          isDisabled: false,
          isLast: false,

          rules: {
            venderId: [{ required: true, message: '请选择所属单位', trigger: ['change'] },
            {
              validator: (rule, value, callback) => {
                let target = {}
                that.event._dispatch('companyli.getCompanyarr', target)
                const data = target.companyarr.filter(v => v.venderId === value)
                if (data && data.length > 1) return callback(new Error('已选择相同的所属单位'))
                else return callback()
              }, trigger: ['change']
            }],
            userList: [{ required: true, message: '请选择可选名单', trigger: ['change'] }],
            cost: [{ required: true, message: '请输入标注单价', trigger: ['blur', 'change'] }],
          }
        }
      },
      computed: {
        costLabel() {
          return this.actionType === 'audit' ? '审核单价' : '标注单价'
        }
      },
      watch: {
        form: {
          deep: true,
          handler(val) {
            return that.event._dispatch('companyli.datachange', { data: val, num: that.data.num })
          }
        }
      },
      methods: {
        initFormData(val) {
          const { venderId, userList, cost, costVisible } = val
          const choosedUser = userList.filter(v => v.selected === true).map(v => v.id)
          this.choosedUser = choosedUser
          this.form = {
            venderId,
            userList: choosedUser,
            cost,
            costVisible
          }
          that.event._dispatch('companyli.choosed', { data: { idx: venderId }, num: that.data.num, firstRender: this.firstRender })
        },
        initVenderList(val) {
          this.venderList = val
        },
        initUserSelectList(val) {
          this.userSelectList = val
        },
        handleVenderIdChange(value) {
          this.firstRender = false
          that.event._dispatch('companyli.choosed', { data: { idx: value }, num: that.data.num, firstRender: this.firstRender })
        },
        handleAdd() {
          that.event._dispatch('companyli.addcompany');
        },
        handleDelete() {
          if (this.status > 1 && this.previous) {
            // 任务待发布状态时允许删人，其他状态不能删除
            that.app.alert.show({
              title: " ",
              msg: '已添加的不能删除',
              close: false
            })
            return false
          }
          that.event._dispatch('companyli.delete', { num: that.nowParam.num });
        },
        handleSubmit() {
          let isOk = false
          this.$refs.form.validate(valid => {
            isOk = !!valid
          })
          return isOk
        },
        setIsLast() {
          let last = this.companyarr.length
          this.companyarr.forEach((v, i) => !v.delete && (last = i + 1))
          this.isLast = last === this.dataNum
        }
      }
    })
  }

  setdata(val) {
    this.vuePage.initFormData(val)
  }

  onCompanyarrChange(companyarr) {
    this.vuePage.companyarr = companyarr
    this.vuePage.setIsLast()
  }

  renderPeople(list) {
    // 全选
    if (!this.vuePage.firstRender) {
      this.vuePage.form.userList = list.map(v => v.idx)
    } else {
      const { choosedUser } = this.vuePage
      list.forEach(v => {
        v.selected =  this.status > 1 && choosedUser.includes(v.idx) // 任务待发布状态时允许删人，其他状态不能删除
      })
    }
    this.vuePage.userSelectList = list
  }
  setxlkvalue(value) {
    this.vuePage.venderList = value

  }
  cleardata() {
    this.vuePage.venderId = ''
  }
  disabled() {
    this.vuePage.isDisabled = true
  }
  validate() {
    return this.vuePage.handleSubmit()
  }

}

//原型链一定要有的
module.exports = companyli;
