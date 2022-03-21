//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
import ProductDisclaimer from './product-disclaimer.vue'

//var pagebaseClass = require('../base/es6pagebase')
//var JSEncrypt = require('../libs/jsencrypt.js');

class login extends Interstellar.pagesBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.name = 'login'
  }

  complete() {
    let that = this
    that.styleModel(1)

    that.app.languageMode.setTranslate(that.dom.find('[data-i18n]').dom, that.app.language, that.name)

    that.dom.find(".registerbtn").on("click", function() {
      that.app.changePage("register")
    })
    that.dom.find(".reset ._cancel").on("click", function() {
      that.dom.find(".contains").removeClass("hide")
      that.dom.find(".reset").addClass("hide")
    })
    that.dom.find(".forget").on("click", function() {
      that.dom.find(".contains").addClass("hide")
      that.dom.find(".reset").removeClass("hide")
    })
    //let dropdown = require.sure('../moduleslibs/dropdown/dropdown.js');
    this.flag = true
    if (this.app.local.get("isRemember") == "true") {
      if (that.app.local.get("all")) {
        that.dom.find(".name").val(that.app.local.get("username"))
        that.dom.find(".password").val(that.app.local.get("password"))
        that.dom.find(".remeber i").addClass("choose")
      }
    }
    that.dom.find(".tosee").on("click", function() {
      if (that.flag) {
        ES.selctorDoc(this)
          .find(".iconfont")
          .removeClass("icon-biyan")
        ES.selctorDoc(this)
          .find(".iconfont")
          .addClass("icon-chakan")
        that.dom.find(".password").attr("type", "text")
        that.flag = false
      } else {
        ES.selctorDoc(this)
          .find(".iconfont")
          .removeClass("icon-chakan")
        ES.selctorDoc(this)
          .find(".iconfont")
          .addClass("icon-biyan")
        that.dom.find(".password").attr("type", "password")
        that.flag = true
      }
    })
    that.dom.find(".loginBtn").on("click", function() {
      that.loginCheck()
    })
    that.dom.find(".password").on("keydown", function(e) {
      if (e.keyCode == 13) {
        that.loginCheck()
      }
    })
    that.dom.find(".remeber i").on("click", function() {
      if (!ES.selctorDoc(this).hasClass("choose")) {
        ES.selctorDoc(this).addClass("choose")
      } else {
        ES.selctorDoc(this).removeClass("choose")
      }
    })
    that.dom.find(".forget").on("click", function() {
      let changepwd = that.app.languageMode.getTranslate(
        that.app.language,
        "login",
        "changepwd"
      )
      if (that.app.cloud) {
        that.dom.find(".contains").hide()
        that.dom.find(".retrieve").show()
      } else {
        that.dom.find(".errorSpan").removeClass("hide")
        // that.dom.find('.errorSpan').html('请联系管理员修改密码')
        that.dom.find(".errorSpan").html(changepwd)
      }
    })

    that.disclaimerModal = new Vue({
      el: '#product-disclaimer-wrapper',
      components: {
        ProductDisclaimer
      },
      data() {
        return {
          controller: false, // query配置是否显示免责声明
          version: 'v1', // query配置版本号
          updateDate: '', // 更新日期
          isShowProductDisClainmer: false
        }
      },
      computed: {
        // 存到local版本号的key
        localVersionKey(){
          const userInfo = JSON.parse(that.app.local.get('all'))
          return `disclaimerVersion${userInfo.userId}`
        }
      },
      methods: {
        // 显示免责声明弹窗，显示则返回true
        showProductDisClainmer() {
          this.setInitData()
          if (!this.controller) return false
          const localVersion = that.app.local.get(this.localVersionKey)
          if (localVersion !== this.version) {
            this.isShowProductDisClainmer = true
            return true
          }
          return false
        },
        // 获取DISCLAIMER，并设置controller和version
        setInitData() {
          const disclaimer = Tool.configRemarkFormat(that.app.constmap['DISCLAIMER'])
          if (!disclaimer) return
          this.controller = disclaimer.controller === 'true' ||  disclaimer.controller === true
          this.version = disclaimer.version
          this.updateDate = disclaimer.updateDate
        },
        goNextPage() {
          that.app.changePage(that.app.userResource[0][0].type.split("$$")[0], {
            type: "fs"
          })
        },
        confirmDisclaimer() {
          that.app.local.set(this.localVersionKey, this.version) // 当前版本号存到local
          this.goNextPage()
        }
      }
    })
  }
  async loginCheck() {
    let that = this
    ES.selctorDoc(".errorSpan").addClass("hide")
    ES.selctorDoc(".errorSpan").html("")
    let loginName = ES.selctorDoc(".name").val()
    let password = ES.selctorDoc(".password").val()
    // let password = encodeURIComponent(ES.selctorDoc('.password').val());
    if (loginName == "") {
      ES.selctorDoc(".errorSpan").removeClass("hide")
      ES.selctorDoc(".errorSpan").html("用户名不能为空")
    } else if (password == "") {
      ES.selctorDoc(".errorSpan").removeClass("hide")
      ES.selctorDoc(".errorSpan").html("密码不能为空")
    } else {
      var json = {
        phone: loginName.replace(/ /g, ""),
        pwd: password
      }
      that.app.loading.show()
      let res = await that.api.login(json)
      that.app.loading.hide()
      if (res.code == 0) {
        if (that.dom.find(".remeber i").hasClass("choose")) {
          that.app.local.set("isRemember", "true")
          that.app.local.set("username", loginName)
          that.app.local.set("password", ES.selctorDoc(".password").val())
        } else {
          that.app.local.set("isRemember", "")
          that.app.local.set("username", "")
          that.app.local.set("password", "")
        }
        const userInfo = res.data.user.user
        let json = {
          name: userInfo.name,
          userId: userInfo.id,
          productList: userInfo.productList,
          status: userInfo.status,
          isAudit: userInfo.isAudit
        }
        that.app.local.set("all", JSON.stringify(json))
        that.app.local.set("accessToken", res.data.accessToken)
        let response = await that.api.user_resource({
          id: userInfo.id
        })
        let temp = { 0: [] }
        let doctorIdentity = false
        let tempStr = ","
        if (JSON.stringify(response.data.pageResourceList) == "[]") {
          ES.selctorDoc(".errorSpan").removeClass("hide")
          ES.selctorDoc(".errorSpan").html("该账号无权限，请联系管理员")
          return
        }
        response.data.pageResourceList.forEach(item => {
          if (!temp[item.parentId]) temp[item.parentId] = []
          if (item.parentId == 0) {
            temp[0].push(item)
            tempStr += item.type + ","
            if (item.type == "personalaccount") {
              doctorIdentity = true
            }
          } else {
            temp[item.parentId].push(item)
          }
        })
        that.app.userResource = temp
        that.app.local.set("doublePage", true)
        if (doctorIdentity && that.app.userResource[0].length > 1) {
          that.app.local.set("doublePage", true)
        } else {
          that.app.local.set("doublePage", false)
        }
        // if (JSON.stringify(res.data.roleList) == '[]'||res.data.roleList[0].code == 'ADMIN') {
        //   that.app.local.set('identity', 'gly');
        //   that.app.changePage('projectmanage', { type: 'fs' })
        //   that.app.menu.refreshmenu()
        // } else if (res.data.roleList[0].code == 'doctor.tourist') {
        //   that.app.local.set('identity', 'bzys');
        //   that.app.changePage('personalaccount')
        //   that.app.menu.refreshmenu()
        // }
        if (
          that.app.userResource[0][0].type.split("$$")[0] == "personalaccount"
        ) {
          that.app.local.set("identity", "bzys")
        } else {
          that.app.local.set("identity", "gly")
        }
        // that.app.menu.renderHtml()
        that.app.header.setloginname()
        that.app.header.setNameCont()

        // 获取query的数据，并初始化app.constmap
        const queryRes = await that.api.getQuery({ value: null })
        if (that.app.apiresult(queryRes)) {
          queryRes.data && queryRes.data.map(item => {
            that.app.constmap[item.value] = item
          })
        }

        // 显示产品免责声明
        const isShow = this.disclaimerModal.showProductDisClainmer()

        !isShow && that.app.changePage(that.app.userResource[0][0].type.split("$$")[0], {
          type: "fs"
        })
      } else if (res.code == "500") {
        ES.selctorDoc(".errorSpan").removeClass("hide")
        ES.selctorDoc(".errorSpan").html("用户名或密码错误，请重新输入")
      } else if (res.code == "503") {
        ES.selctorDoc(".errorSpan").removeClass("hide")
        ES.selctorDoc(".errorSpan").html("账户已被冻结。")
        setTimeout(function() {
          ES.selctorDoc(".errorSpan").html("")
        }, 5000)
      } else {
        ES.selctorDoc(".errorSpan").removeClass("hide")
        ES.selctorDoc(".errorSpan").html(res.msg)
      }
    }
  }
}

module.exports = login
