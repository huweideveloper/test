class createauditpro1 extends Interstellar.pagesBase {
  complete() {
    let that = this
    this.app.header.openControl("auditproject")
    this.app.header.changeselected(1)
    this.type = this.app.parpam.type
    this.id = this.app.parpam.projectid * 1
    this.status = parseInt(this.app.parpam.status)
    this.styleModel(1)
    this.dropobj = {}
    this.initProjectGroupSelect()
    this.upload()
    if (this.type !== "new") {
      this.render()
    }

    // 存储空间名称。既可以在这里配置，也可以在SDK中全局配置。
    // 例如 var bucketName = "example-name";
    let bucketName = "proximatest"

    // 存储空间域名URL地址。既可以在这里配置，也可以在SDK中全局配置。
    // 例如 var bucketUrl = "https://example-name.cn-bj.ufileos.com/";
    let bucketUrl = "https://proximatest.internal-cn-sh2-01.ufileos.com/"

    // 计算token的地址。既可以在这里配置，也可以在SDK中全局配置。
    // 例如 var tokenUrl = "token_server.php";
    let tokenUrl = "../../libs/token_server.php"

    // 实例化UCloudUFile
    //that.ufile =  new UCloudUFile(bucketName, bucketUrl, tokenUrl);
    //数据变化的时候处理
    // if ((this.type != 'new' && !this.projectId) || !this.type) {
    //     this.app.changePage('projectmanage')
    //     return
    // }
    this.model._event._addEvent("apiData.change", function() {
      if (that.dom.find(".proname").val() || that.dom.find("textarea").val()) {
        that.app.session.set("ischanged", true)
      }
      if (JSON.stringify(that.model.getData("apiData")) == "{}") {
        that.app.session.del("data_1")
        return
      }
      if (
        that.model.getData("apiData").name &&
        that.model.getData("apiData").remark
      ) {
        that.app.session.set(
          "data_1",
          JSON.stringify(that.model.getData("apiData"))
        )
      } else {
        that.app.session.del("data_1")
      }
    })
    this.eventAdd()
  }
  async initProjectGroupSelect(groupName) {
    let that = this
    let dropConfig = [{
      name: "groupId",
      className: "xlk",
      firstSelect: { val: "请选择一个项目群组", idx: "" },
      input: true,
      data: [{
        val: "",
        idx: ""
      }]
    }]
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js")
      dropConfig.forEach((val, idx) => {
        let drop = that.app.loadModule(
          dropdown,
          that.dom.find("." + val.name),
          {
            className: val.className,
            firstSelect: val.firstSelect,
            data: val.data,
            input: val.input
          }
        )
        drop.event._addEvent("option.click", value => {
          that.model.apiData.groupId = value.idx
        })
        drop.event._addEvent("dropDown.clear", value => {
          that.model.apiData.groupId = ""
        })
        drop.event._addEvent("drop.input", value => {
          that.queryProjectGroupList(value.data)
        })
        that.dropobj[val.name] = drop
      })
      that.queryProjectGroupList()
    })
  }
  // 查询某科室下所有的项目群组
  async queryProjectGroupList(groupName) {
    let { data } = await this.api.queryProjectGroupList({
      name: groupName,
      page: 1
    })
    let temparr = data.list.map(val => {
      return {
        idx: val.id,
        val: val.name
      }
    })
    this.dropobj["groupId"].renderHtml(temparr)
    if (groupName) return
    setTimeout(() => {
      const tempObj = this.model.getData("apiData")
      if (tempObj.groupId) { // 如是编辑进来需默认选中之前的选择项
        this.dom.find('.groupId .option[data-idx="' + tempObj.groupId + '"]').click()
      }
    }, 20)
  }
  eventAdd() {
    let that = this
    this.dom.find(".uploadarea").on("click", () => {
      this.dom.find(".dianjiupload").click()
    })
    this.dom.find(".dianjiupload").on("change", () => {
      let thisurl =
        "http://video-static.xdcdn.xiaodutv.com/browse_static/v3/common/widget/global/player/newPlayer_e2332cd1.swf"
      // that.uploadufile()
      let temp = this.model.getData("apiData")
      temp["remarkFileUrl"] = JSON.parse(temp["remarkFileUrl"])
      temp["remarkFileUrl"].push(thisurl)
      temp["remarkFileUrl"] = JSON.stringify(temp["remarkFileUrl"])
      //temp['remarkFileUrl'] = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539756479843&di=46adde08da81fbb964771f15c6be8ba3&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D84b6266e084f78f0940692b310496f39%2Fa08b87d6277f9e2f7853a5321430e924b899f3a2.jpg'
      // temp['remarkFileUrl']='http://video-static.xdcdn.xiaodutv.com/browse_static/v3/common/widget/global/player/newPlayer_e2332cd1.swf'
      this.model.setData("apiData", temp)
    })
    this.dom.find(".apidata").on("change", function() {
      if (ES.selctorDoc(this).attr("api")) {
        let keyname = ES.selctorDoc(this).attr("api")
        let temp = that.model.getData("apiData")
        temp[keyname] = JSON.stringify(
          ES.selctorDoc(this)
            .val()
            .trim()
        ).slice(1, -1)
        that.model.setData("apiData", temp)
      }
    })
    this.dom.find(".proname").on("blur", function() {
      if (this.type !== "view") {
        ES.selctorDoc(this).removeClass("redborder")
        ES.selctorDoc(this)
          .parent()
          .find(".required1")
          .remove()
        ES.selctorDoc(this)
          .parent()
          .find(".required")
          .remove()
        if (
          ES.selctorDoc(this)
            .val()
            .trim() == this.proname
        ) {
          return
        }
        let json = {
          name: ES.selctorDoc(this)
            .val()
            .trim()
        }
        // that.api.isrepeat(json).done(function(res) {
        //     if (res.code == 401) {
        //         let temp = that.model.getData('apiData')
        //         temp.name=''
        //         that.model.setData('apiData', temp)
        //         that.dom.find('.proname').after('<span class="required1">项目名称已存在</span>')
        //         that.dom.find('.proname').addClass('redborder')
        //     }
        // })
      }
    })
    this.app.header.event._addEvent("header.changePageError", () => {
      this.dom.find(".redlabel").removeClass("redborder")
      this.dom.find(".required").remove()
      this.dom.find(".inputLine").dom.forEach((val, idx) => {
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          val.find("." + val.attr("redlabel")).addClass("redborder")
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
                Tool.checkForm(ES.selctorDoc(val).dom, "red") +
                "</span>"
            )
        }
      })
    })
    this.dom.find(".save").on("click", async () => {
      this.dom.find(".redborder").removeClass("redborder")
      this.dom.find(".required").remove()
      this.dom.find(".inputLine:not(.justToJudge)").dom.forEach(async (val, idx) => {
        if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
          val.find("." + val.attr("redlabel")).addClass("redborder")
          val
            .find("." + val.attr("redlabel"))
            .after(
              '<span class="required">' +
                Tool.checkForm(ES.selctorDoc(val).dom, "red") +
                "</span>"
            )
        }
      })
      if (
        this.dom.find(".redborder").dom &&
        this.dom.find(".redborder").dom.some(item => {
          return item.box().clientHeight !== 0
        })
      ) {
        return false
      } else {
        if (this.type == "new") {
          this.model.apiData.action = 1
        } else {
          this.model.apiData.action = 2
          this.model.apiData.auditProjectId = this.id
        }
        this.app.loading.show()
        let res = await this.api.audit_project_edit(this.model.apiData)
        this.app.loading.hide()
        if (res.code == 0) {
          this.app.session.clearAll()
          this.app.changePage("createauditpro2", {
            type: "edit",
            projectid: res.data ? res.data.auditProjectId : this.id,
            status: this.status
          })
        } else {
          this.errorshow(res.msg)
        }
      }
    })
  }

  errorshow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    })
  }

  async render() {
    let pagedata = {}
    let json = {
      auditProjectId: this.id
    }
    this.app.loading.show()
    let res = await this.api.auditproject_read(json)
    this.app.loading.hide()
    if (res.code == 0) {
      pagedata.name = res.data.name
      pagedata.remark = res.data.remark
      pagedata.groupId = res.data.groupId
      pagedata.remarkFileUrl = res.data.remarkFileUrl
      pagedata.description = res.data.description
    } else {
      this.errorshow(res.msg)
    }
    this.proname = pagedata.name
    this.model.setData("apiData", pagedata)
    this.dom.find(".apidata[api=name]").val(pagedata.name)
    this.dom
      .find(".apidata[api=remark]")
      .val(JSON.parse('"' + pagedata.remark + '"'))
    this.dom
      .find(".apidata[api=description]")
      .val(JSON.parse('"' + pagedata.description + '"'))
    this.app.session.clearAll()
    if (this.type == "view") {
      this.dom.find(".apidata").attr("readonly", "readonly")
      this.dom.find(".save").remove()
    }
  }

  upload() {
    //利用html5 FormData() API,创建一个接收文件的对象，因为可以多次拖拽，这里采用单例模式创建对象Dragfiles
    var Dragfiles = (function() {
      var instance
      return function() {
        if (!instance) {
          instance = new FormData()
        }
        return instance
      }
    })()
    //为Dragfiles添加一个清空所有文件的方法
    FormData.prototype.deleteAll = function() {
      var _this = this
      this.forEach(function(value, key) {
        _this.delete(key)
      })
    }
    //添加拖拽事件
    var dz = document.getElementById("uploadarea")
    dz.ondragover = function(ev) {
      //阻止浏览器默认打开文件的操作
      ev.preventDefault()
      //拖入文件后边框颜色变红
      this.style.borderColor = "red"
    }
    dz.ondrop = ev => {
      //恢复边框颜色
      this.style.borderColor = "gray"
      //阻止浏览器默认打开文件的操作
      ev.preventDefault()
      var files = ev.dataTransfer.files
      var len = files.length,
        i = 0
      var frag = document.createDocumentFragment() //为了减少js修改dom树的频度，先创建一个fragment，然后在fragment里操作
      var tr, time, size
      var newForm = Dragfiles() //获取单例
      var it = newForm.entries() //创建一个迭代器，测试用
      while (i < len) {
        tr = document.createElement("tr")
        //获取文件大小
        size = Math.round((files[i].size * 100) / 1024) / 100 + "KB"
        //获取格式化的修改时间
        time =
          files[i].lastModifiedDate.toLocaleDateString() +
          " " +
          files[i].lastModifiedDate.toTimeString().split(" ")[0]
        tr.innerHTML =
          "<td>" +
          files[i].name +
          "</td><td>" +
          time +
          "</td><td>" +
          size +
          "</td><td>删除</td>"
        let html =
          '<li class="file">\n' +
          '                        <i class="iconfont icon-qubiezhen"></i>\n' +
          '                        <span class="filename">' +
          files[i].name +
          "</span>\n" +
          '                        <span class="progress"></span>' +
          '                        <i class="iconfont icon-guanbi"></i>' +
          "                    </li>"
        ES.selctorDoc(".filelist").append(html)
        frag.appendChild(tr)
        //添加文件到newForm
        newForm.append(files[i].name, files[i])
        i++
      }
      this.upload1(Dragfiles)
      //this.childNodes[1].childNodes[1].appendChild(frag);
      //为什么是‘1'？文档里几乎每一样东西都是一个节点，甚至连空格和换行符都会被解释成节点。而且都包含在childNodes属性所返回的数组中.不同于jade模板
    }
  }

  upload1(value) {
    var data = value() //获取formData
    $.ajax({
      url: "upload",
      type: "POST",
      data: data,
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        alert("succeed!") //可以替换为自己的方法
        closeModal()
        data.deleteAll() //清空formData
        $(".tbody").empty() //清空列表
      },
      error: function(returndata) {
        alert("failed!") //可以替换为自己的方法
      }
    })
  }

  uploadufile() {
    let fileRename = this.dom.find(".dianjiupload").val()
    let file = document.getElementById("uploader").files[0]
    let data = {
      file: file,
      fileRename: fileRename
    }
    let successCallBack = function(res) {
      alert("上传成功")
      let html =
        '<li class="file" linkurl="' +
        res +
        '">\n' +
        '                        <i class="iconfont icon-qubiezhen"></i>\n' +
        '                        <span class="filename">' +
        file.name +
        "</span>\n" +
        '                        <span class="progress"></span>' +
        '                        <i class="iconfont icon-guanbi"></i>' +
        "                    </li>"
      ES.selctorDoc(".filelist").append(html)
      // $("#result").html("上传成功");
      // $("#result").append(JSON.stringify(res));
    }
    let progressCallBack = function(res) {
      var percentComplete = "上传进度：" + res * 100 + "%"
      //$("#result").html(percentComplete);
    }
    let errorCallBack = function(res) {
      // $("#result").html("errorCallBack: " + JSON.stringify(res));
      console.error("errorCallBack", res)
    }
    this.ufile.uploadFile(
      data,
      successCallBack,
      errorCallBack,
      progressCallBack
    )
  }
}

module.exports = createauditpro1
