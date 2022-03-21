class createfirststep extends Interstellar.pagesBase {
  complete() {
    this.app.header.openControl("projectmanage")
    this.app.header.changeselected(1)
    this.type = this.app.parpam.type
    this.projectId = this.app.parpam.projectid
    this.styleModel(1)
    this.upload()
    this.render()
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
    if ((this.type != "new" && !this.projectId) || !this.type) {
      this.app.changePage("projectmanage")
      return
    }
    this.model._event._addEvent("apiData.change", () => {
      if (this.dom.find(".proname").val() || this.dom.find("textarea").val()) {
        this.app.session.set("ischanged", true)
      }
      if (JSON.stringify(this.model.getData("apiData")) == "{}") {
        this.app.session.del("data_1")
        return
      }
      if (
        this.model.getData("apiData").name &&
        this.model.getData("apiData").remark
      ) {
        this.app.session.set(
          "data_1",
          JSON.stringify(this.model.getData("apiData"))
        )
      } else {
        this.app.session.del("data_1")
      }
    })
    this.eventAdd()
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
    this.dom.find(".proname").on("blur", async function() {
      if (that.type !== "view") {
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
            .trim() == that.proname
        ) {
          return
        }
        let json = {
          name: ES.selctorDoc(this)
            .val()
            .trim()
        }
        that.app.loading.show()
        let res = await that.api.isrepeat(json)
        that.app.loading.hide()
        if (res.code == 401) {
          let temp = that.model.getData("apiData")
          temp.name = ""
          that.model.setData("apiData", temp)
          that.dom
            .find(".proname")
            .after('<span class="required1">项目名称已存在</span>')
          that.dom.find(".proname").addClass("redborder")
        }
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
  }

  async render() {
    let pagedata = {}
    switch (this.type) {
      case "new":
        pagedata = this.app.session.get("data_1")
          ? JSON.parse(this.app.session.get("data_1"))
          : this.model.apiData //{ "name": "", "remark": "" ,"remarkFileUrl":"[]"}
        this.model.setData("apiData", pagedata)
        this.dom.find(".apidata[api=name]").val(pagedata ? pagedata.name : "")
        this.dom
          .find(".apidata[api=remark]")
          .val(pagedata ? JSON.parse('"' + pagedata.remark + '"') : "")
        break
      default:
        let json = {
          id: this.projectId
        }
        this.app.loading.show()
        let res = await this.api.projectdetail(json)
        this.app.loading.hide()
        if (res.code == 0) {
          pagedata = res.data
        }
        pagedata = this.app.session.get("data_1")
          ? JSON.parse(this.app.session.get("data_1"))
          : pagedata
        this.proname = pagedata.name
        this.model.setData("apiData", pagedata)
        this.dom.find(".apidata[api=name]").val(pagedata.name)
        this.dom
          .find(".apidata[api=remark]")
          .val(JSON.parse('"' + pagedata.remark + '"'))
        break
    }
    if (this.type == "view") {
      this.dom.find(".apidata").attr("readonly", "readonly")
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
    dz.ondrop = function(ev) {
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
        console.log(size + " " + time)
        let html =
          '<li class="file">\n' +
          '                        <i class="iconfont icon-qubiezhen"></i>\n' +
          '                        <span class="filename">' +
          files[i].name +
          "</span>\n" +
          '                        <span class="progress"></span>' +
          '                        <i class="iconfont icon-guanbi"></i>' +
          "                    </li>"
        console.log(ES.selctorDoc(".filelist").dom, "dom")
        ES.selctorDoc(".filelist").append(html)
        frag.appendChild(tr)
        //添加文件到newForm
        newForm.append(files[i].name, files[i])
        //console.log(it.next());
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
      console.log(ES.selctorDoc(".filelist").dom, "dom")
      ES.selctorDoc(".filelist").append(html)
      // $("#result").html("上传成功");
      // $("#result").append(JSON.stringify(res));
    }
    let progressCallBack = function(res) {
      var percentComplete = "上传进度：" + res * 100 + "%"
      console.log(percentComplete)
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

module.exports = createfirststep
