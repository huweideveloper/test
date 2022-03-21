import './index.less'
import api from '../api.js'
import commonApi from '@/api/common.api.js'

class CreateProStepOne extends Interstellar.pagesBase {
  complete() {
    this.projectType = window.location.hash.indexOf("createproone") !== -1 ? 1 : 3
    if (this.projectType == 1) {
      this.app.header.openControl("projectmanage")
    } else {
      this.app.header.openControl("backflowproject")
    }
    this.app.header.changeselected(1)
    this.styleModel(1)

    const app = this.app
    const that = this

    new Vue({
      el: '#createProStepOne',
      data() {
        return {
          app,
          projectType: that.projectType,
          type: app.parpam.type, // 类型 new, edit, view
          id: app.parpam.projectid * 1, // 项目ID
          status: parseInt(app.parpam.status),
          docFileList: [],
          projectForm: {
            id: '',
            name: '',
            bizFileId: '',
            remark: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入项目名称', trigger: ['blur', 'change'] },
              {
                validator: async (rule, value, callback) => {
                  if (value) {
                    const isExists = await this.checkNameIsrepeat(value)
                    if (isExists) return callback(new Error('项目名称已存在'))
                  }
                  callback()
                }, trigger: ['blur']
              }
            ],
            remark: [{ required: true, message: '请输入项目描述', trigger: ['blur', 'change'] }],
          }
        }
      },
      computed: {
        isView() {
          return this.type === 'view'
        },
        isStart() { // 已开启
          return this.status === 2
        }
      },
      watch: {
        projectForm: {
          deep: true,
          handler(val, old) {
            this.setSessionData1(val)
          }
        }
      },
      mounted() {
        this.initProjectData()
        this.queryDocFileList()
        this.initEvent()
      },
      methods: {
        initEvent() {
          this.app.header.event._addEvent("header.changePageError", () => {
            this.$refs.proform.validate()
          })
        },
        initProjectData() {
          if (this.id) {
            this.queryProjectDetail()
          } else {
            const sessionData = this.getSessionData1()
            this.projectForm = { ...sessionData }
          }
          this.$refs.proform.clearValidate()
        },
        // 获取项目信息
        async queryProjectDetail() {
          const res = await api.projectdetail({
            id: this.id
          })
          const { id, name, bizFileId, remark } = res.data || {}
          this.projectForm = {
            id,
            name,
            bizFileId,
            remark
          }
          this.setSessionData1(this.projectForm)
        },
        // 获取文档下拉列表
        async queryDocFileList(bizName = '') {
          const res = await commonApi.queryFileList({
            bizType: 'PATHOLOGY_PROJECT',
            bizName
          })
          this.docFileList = res.data || []
        },
        // 验证项目名称是否存在
        async checkNameIsrepeat(name) {
          const res = await api.isrepeat({ name, type: this.projectType, useCallerHandler: true })
          const isExists = res.code !== 0 // 401 数据已存在
          if (isExists) {
            // 设置session的project.name为空
            this.setSessionData1({ ...this.projectForm, name: '' })
          }
          return isExists
        },
        handleChangeData() {
          this.app.session.set('ischanged', true)
        },
        // 设置session的data_1
        setSessionData1(data) {
          this.app.session.set('data_1', JSON.stringify(data))
        },
        getSessionData1() {
          const data1 = this.app.session.get('data_1')
          return data1 ? JSON.parse(data1) : { id: '', name: '', bizFileId: '', remark: '' }
        }
      }
    })
  }
}

module.exports = CreateProStepOne
