require("./header.less")

class header extends Interstellar.moduleBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require("./tpl.html")
    this.name = "header"
  }

  complete() {
    let _Object = this
    this.app.languageMode.setTranslate(
      this.dom.find("[data-i18n]").dom,
      this.app.language,
      this.name
    )
    // 切换到管理员或医生
    const doctorUrls = ['personalaccount', 'alltasklist', 'newtaskdetail', 'taskdetail', 'userStat'] // 医生的所有页面，除了编辑影像页面
    const isDoctor = doctorUrls.some(v => location.hash.includes(v))
    this.app.local.set("identity", isDoctor ? 'bzys' : 'gly')
    this.setNameCont()

    this.makeuseBtn()
  }

  //操作用户菜单
  makeuseBtn() {
    let _Object = this
    _Object.dom.find(".loginName").on("click", function() {
      if (_Object.dom.find(".nameCont").hasClass("hide")) {
        _Object.dom.find(".nameCont").removeClass("hide")
        _Object.dom.find(".mask").removeClass("hide")
      }
    })
    // 切换到医生
    _Object.dom.find(".qhys").on("click", function() {
      _Object.app.local.set("identity", "bzys")
      _Object.app.changePage("personalaccount")
    })
    // 切换到管理员
    _Object.dom.find(".qhgly").on("click", function() {
      _Object.app.local.set("identity", "gly")
      if (_Object.app.userResource[0][0].type !== "personalaccount") {
        _Object.app.changePage(
          _Object.app.userResource[0][0].type.split("$$")[0],
          { type: "fs" }
        )
      } else {
        _Object.app.changePage(
          _Object.app.userResource[0][1].type.split("$$")[0],
          { type: "fs" }
        )
      }
    })
    _Object.dom.find(".mask").on("click", function() {
      _Object.dom.find(".nameCont").addClass("hide")
      _Object.dom.find(".mask").addClass("hide")
    })
    _Object.dom.find(".loginName p a").on("click", function(e) {
      e.stopPropagation()
      if (ES.selctorDoc(this).attr("link") != undefined) {
        _Object.dom.find(".nameCont").addClass("hide")
        _Object.dom.find(".mask").addClass("hide")
      }
    })
    _Object.dom.find(".exit").on("click", function() {
      ES.ajax({
        url: _Object.app.domain1 + "v1/tUser/loginOut",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        questring: {}
      }).then(function(response) {
        _Object.app.model.clearAll()
        _Object.dom.find(".nameCont").addClass("hide")
        _Object.dom.find(".mask").addClass("hide")
        _Object.app.local.set("accessToken", "")
        _Object.app.changePage("login")
      })
    })
    _Object.dom.find(".changepwd").on("click", function() {
      let changePwd = require("../../modal/changePwd/changePwd")
      let modal = _Object.app.loadModal(changePwd, { adv: true })
      _Object.dom.find(".nameCont").addClass("hide")
      modal.event._addEvent("changePwd.password", function(value) {
        ES.ajax({
          url: _Object.app.domain1 + "v1/user/password/modify",
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          questring: value
        }).then(function(response) {
          if (response.code == 0) {
            modal.close()
          } else if (response.code == 512) { // 不确定
            modal.showerr("原密码错误")
          } else if (response.code == 513) {
            modal.showerr("新旧密码相同")
          } else if (response.code == 521) {
            modal.showerr("原始密码不正确")
          }  else {
            _Object.app.alert.show({
              title: " ",
              msg: "修改失败",
              close: true,
              footer: true
            })
          }
        })
      })
    })
  }

  showcrube() {
    let _Object = this
    let pagename = window.location.hash.split("/")[1]
    if (pagename == "xray") {
      pagename += window.location.hash.split("/")[3]
    }
    let headerName = this.app.languageMode.getTranslate(
      this.app.language,
      "header",
      pagename
    )
    if (headerName == null)
      headerName = this.app.languageMode.getTranslate(
        this.app.language,
        "header",
        "pro"
      )
    _Object.dom.find(".header .word_header").html(headerName)
    _Object.dom.find(".word_header span").on("click", function() {
      // if (ES.selctorDoc(this).attr('link') != '') {
      //   if (ES.selctorDoc(this).attr('linkdata')) {
      //     _Object.app.changePage(ES.selctorDoc(this).attr('link'), JSON.parse(ES.selctorDoc(this).attr('linkdata')));
      //   } else {
      //     _Object.app.changePage(ES.selctorDoc(this).attr('link'));
      //   }
      // }
      window.location.href =
         window.location.origin + "/#!/projectmanage/fs"
    })
  }

  openControl(type) {
    const isViewDetail = this.app.parpam.type === "view"
    this.headerconfig = {
      taskmanage: {
        name: "任务管理",
        config: [
          { text: "任务信息", link: "createtask", canjump: false },
          {
            text: "添加数据",
            link: "createtask2",
            canjump: false
          }
        ],
        type: "fs"
      },
      backflowtask: {
        name: "算法任务",
        config: [
          { text: "任务信息", link: "createbackflowtask1", canjump: false },
          {
            text: "添加数据",
            link: "createbackflowtask2",
            canjump: false
          }
        ],
        type: "fs"
      },
      projectmanage: {
        name: "项目管理",
        config: [
          { text: "第一步", link: "createproone", canjump: true },
          {
            text: "第二步",
            link: "createprotwo",
            canjump: true
          },
          { text: "第三步", link: "createprothree", canjump: false }
        ],
        type: "fs"
      },
      backflowproject: {
        name: "算法项目",
        config: [
          { text: "第一步", link: "createbackflowpro1", canjump: true },
          {
            text: "第二步",
            link: "createbackflowpro2",
            canjump: true
          },
          { text: "第三步", link: "createbackflowpro3", canjump: false }
        ],
        type: "fs"
      },
      auditproject: {
        name: "B端审核项目",
        config: [
          { text: '第一步', link: "createauditpro1", canjump: false },
          {
            text: "第二步",
            link: "createauditpro2",
            canjump: false
          },
          { text: '第三步', link: "createauditpro3", canjump: false }
        ]
      },
      auditprojectc: {
        name: 'C端审核项目',
        config: [
          { text: '第一步', link: 'createauditproc1', canjump: false },
          {
            text: '第二步',
            link: 'createauditproc2',
            canjump: false
          }
        ]
      },
      audittask: {
        name: "B端审核任务",
        config: [
          { text: '第一步', link: "createaudittask1", canjump: false },
          {
            text: '第二步',
            link: "createaudittask2",
            canjump: false
          },
          { text: '第三步', link: "createaudittask3", canjump: false }
        ]
      },
      audittaskc: {
        name: "C端审核任务",
        config: [
          { text: '第一步', link: "createaudittaskc1", canjump: false },
          {
            text: '第二步',
            link: "createaudittaskc2",
            canjump: false
          },
          { text: '第三步', link: "createaudittaskc3", canjump: false }
        ]
      }
    }
    if (isViewDetail) {
      this.headerconfig.projectmanage.config.push({ text: "关联任务", link: "createprofour", canjump: true })
      this.headerconfig.backflowproject.config.push({ text: "关联任务", link: "createbackflowpro4", canjump: true })
      this.headerconfig.auditproject.config.push({ text: "关联任务", link: "createauditpro4", canjump: true })
      this.headerconfig.auditprojectc.config.push({ text: "关联任务", link: "createauditproc3", canjump: true })
    }
    this.dom.find(".header .word_header").addClass("yisheng")
    this.dom.find(".header .word_header").addClass("specialtask")
    this.dom.find(".header .headercontrol").removeClass("hide")
    let html =
      '<li><a link="' + type + '">' + this.headerconfig[type].name + "</a></li>"
    this.headerconfig[type].config.forEach(function(val, idx) {
      html +=
        '<li><span class="step' +
        (idx + 1) +
        '" nowid="' +
        (idx + 1) +
        '" check="" page="' +
        val.link +
        '" canjump="' +
        val.canjump +
        '">' +
        val.text +
        "</span>\n" +
        '            <p class="xiahuaxian">' +
        '                <label class="circle"></label>' +
        '                <label class="line"></label>' +
        "            </p>\n" +
        "        </li>"
    })
    this.dom.find(".header .headercontrol").html(html)
    this.dom.find(".header .headercontrol").attr("type", type)
    this.clickevent(type)
  }

  clickevent(type) {
    let _Object = this
    _Object.dom.find(".headercontrol li a").on("click", function() {
      if (_Object.app.session.get("ischanged") == "true") {
        _Object.app.alert.show({
          title: " ",
          msg: "内容有更新，返回将不做保存。",
          close: true,
          sure: function() {
            _Object.app.session.clearAll()
            _Object.app.changePage(type, {
              type: _Object.headerconfig[type].type
            })
          }
        })
      } else {
        _Object.app.session.clearAll()
        _Object.app.changePage(type, { type: _Object.headerconfig[type].type })
      }
    })
    _Object.dom.find(".headercontrol li span").on("click", function() {
      ES.selctorDoc(".redborder").removeClass("redborder")
      ES.selctorDoc(".required").remove()
      let dom = ES.selctorDoc(this)
      let classdone = dom
        .parent()
        .find("p")
        .hasClass("hide")
      if (classdone) {
        switch (_Object.app.parpam.type) {
          case "new":
            if (dom.attr("nowid") == 1) {
              _Object.app.changePage(dom.attr("page"), _Object.app.parpam)
              _Object.changeselected(dom.attr("nowid"))
            }
            if (dom.attr("nowid") == 3) {
              return
            }
            if (dom.attr("nowid") == 2) {
              if (dom.attr("canjump") !== "false") {
                if (
                  _Object.app.session.get("data_1") &&
                  JSON.parse(_Object.app.session.get("data_1")).name &&
                  JSON.parse(_Object.app.session.get("data_1")).remark
                ) {
                  _Object.app.changePage(dom.attr("page"), _Object.app.parpam)
                  _Object.changeselected(dom.attr("nowid"))
                } else {
                  _Object.event._dispatch("header.changePageError")
                }
              } else {
                return
              }
            }
            break
          default:
            if (
              dom.parents("headercontrol").attr("type") == "backflowproject" ||
              dom.parents("headercontrol").attr("type") == "projectmanage"
            ) {
              if (
                _Object.app.session.get("data_1") &&
                JSON.parse(_Object.app.session.get("data_1")).name &&
                JSON.parse(_Object.app.session.get("data_1")).remark
              ) {
                _Object.app.changePage(dom.attr("page"), _Object.app.parpam)
                _Object.changeselected(dom.attr("nowid"))
              } else {
                _Object.event._dispatch("header.changePageError")
              }
            } else {
              _Object.app.changePage(dom.attr("page"), _Object.app.parpam)
              _Object.changeselected(dom.attr("nowid"))
            }
            break
        }
      }
    })
  }

  changeselected(value) {
    let _Object = this
    ES.selctorDoc(".headercontrol li p").addClass("hide")
    _Object.dom
      .find(".step" + value)
      .parent()
      .find("p")
      .removeClass("hide")
  }

  showBtn() {
    let _Object = this
    let sureread = this.app.languageMode.getTranslate(
      this.app.language,
      "header",
      "sureread"
    )
    _Object.dom.find(".header .readct").html(sureread)
    _Object.dom.find(".header .readct").show()
  }

  setloginname() {
    let _Object = this
    _Object.dom
      .find(".headerCont .login_name")
      .html(JSON.parse(_Object.app.local.get("all")).name)
  }

  setNameCont() {
    let html = ""
    if (this.app.local.get("doublePage") == "true") {
      if (this.app.local.get("identity") == "gly") {
        html +=
          '<a link="personalaccount" class="qhys" data-i18n=\'qhzbzys\' data-name="切换至标注医生">切换至标注医生</a>\n' +
          '                <a class="changepwd">修改密码</a>\n' +
          '                <a class="exit" data-i18n=\'tcdl\' data-name="退出登录">退出登录</a>'
      } else {
        html +=
          '<a link="personalaccount" class="qhys" data-i18n=\'wdzy\' data-name="我的主页">我的主页</a>\n' +
          '                <a link="taskmanage" class="qhgly" data-i18n=\'qhzgly\' data-name="切换至管理员">切换至管理员</a>\n' +
          '                <a class="changepwd">修改密码</a>\n' +
          '                <a class="exit" data-i18n=\'tcdl\' data-name="退出登录">退出登录</a>'
      }
    } else {
      if (this.app.local.get("identity") == "gly") {
        html +=
          '<a class="changepwd">修改密码</a>\n' +
          '                <a class="exit" data-i18n=\'tcdl\' data-name="退出登录">退出登录</a>'
      } else {
        html +=
          '<a link="personalaccount" class="qhys" data-i18n=\'wdzy\' data-name="我的主页">我的主页</a>\n' +
          '                <a class="changepwd">修改密码</a>\n' +
          '                <a class="exit" data-i18n=\'tcdl\' data-name="退出登录">退出登录</a>'
      }
    }
    this.dom.find(".nameCont").append(html)
  }
}

module.exports = header
