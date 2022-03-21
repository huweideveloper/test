//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class taggingNeedDetail extends Interstellar.pagesBase {
  complete() {
    this.styleModel(1);
    this.getdictionary();
    this.id = this.app.parpam.id * 1;
    this.type = this.app.parpam.type;
    this.total = 0;
    this.resize();
    this.setTitle();
    this.bindchangefile();
    this.render();
    this.dropobj = {};
    this.listData = {};
    this.searchData = { page: 1, pageSize: 10, id: this.id };
    this.modeList = [
      { val: "jpg化默认窗宽", idx: "1" },
      { val: "jpg化多窗宽", idx: "7" },
      { val: "jpg压缩", idx: "8" },
      { val: "超大图切割", idx: "4" },
      { val: "dicom转mha", idx: "6" },
      { val: "nii转jpg默认窗宽", idx: "9" },
      { val: "nii转jpg多窗宽", idx: "10" },
      { val: "dicom转mha2", idx: "11" }
    ];
    this.conversion = require("../modal/conversionList/conversionList");
  }

  render() {
    let that = this;
    this.dom.find('input[api="name"]').on("change", function() {
      that.model.apiData.name = ES.selctorDoc(this).val();
    });
    this.dom.find(".back").on("click", () => {
      this.app.changePage("taggingNeed");
    });
    this.dom.find(".export").on("click", function() {
      that.dom.find(".file").click();
    });
    this.dom.find(".batchStart").on("click", async () => {
      let tempArr = [];
      for (let i in this.listData) {
        tempArr.push(this.listData[i].id);
      }
      if (tempArr.length > 0) {
        this.app.alert.show({
          title: " ",
          msg: "确认执行吗？",
          close: true,
          sure: async () => {
            this.app.loading.show();
            let res = await this.api.tagneed_batchExecuteTagTransfer({
              idsList: tempArr
            });
            this.app.loading.hide();
            if (res.code == 0) {
              this.listData = {};
              this.dom.find(".tablearea .choose").removeClass("choose");
              this.searchData.page = 1;
              this.tagneed_findTagNeedById(this.searchData, true);
            } else {
              this.errorShow(res.msg);
            }
          }
        });
      } else {
        this.errorShow("请选择需要执行的数据");
      }
    });
    this.dom.find(".batchExport").on("click", async () => {
      let tempArr = [];
      for (let i in this.listData) {
        tempArr.push(this.listData[i].id);
      }
      if (tempArr.length > 0) {
        let url =
          this.app.domain1 +
          "v1/tagneed/convertList/export?tagNeedId=" +
          this.id +
          "&tagTransferIdList=" +
          tempArr.join(",") +
          "&accessToken=" +
          window.localStorage.accessToken;
        //let token = this.app.local.get('accessToken')
        this.api.HttpRequest.downLoadFile(url, {
          key: "accessToken",
          val: this.app.local.get("accessToken")
        });
      } else {
        this.errorShow("请选择需要执行的数据");
      }
    });
    this.dom.find(".batchRestart").on("click", async () => {
      let tempArr = [];
      for (let i in this.listData) {
        tempArr.push(this.listData[i].id);
      }
      if (tempArr.length > 0) {
        this.app.alert.show({
          title: " ",
          msg: "确认重跑吗？",
          close: true,
          sure: async () => {
            this.app.loading.show();
            let res = await this.api.tagneed_restart({
              tagTransferIdList: tempArr
            });
            this.app.loading.hide();
            if (res.code == 0) {
              this.listData = {};
              this.dom.find(".tablearea .choose").removeClass("choose");
              this.searchData.page = 1;
              this.tagneed_findTagNeedById(this.searchData, true);
            } else {
              this.errorShow(res.msg);
            }
          }
        });
      } else {
        this.errorShow("请选择需要重跑的数据");
      }
    });
    this.dom.find(".icon-tianjia").on("click", () => {
      this.conversionModal = that.app.loadModal(
        that.conversion,
        { adv: true },
        { modalConfig: this.modalConfig }
      );
      this.conversionModal.event._addEvent(
        "conversionList.export",
        async value => {
          console.log(value, "eeeeee", this.listData, this.nowList);
          let temp = this.nowList ? this.nowList : [];
          let idList = [];
          if (this.nowList && this.type !== "edit") {
            this.nowList.forEach(v => {
              idList.push(v.id);
            });
          }
          for (let i in value) {
            temp.push(value[i]);
            idList.push(value[i].id);
          }
          console.log(temp, "ddddd");
          if (this.type == "edit") {
            let res = await this.api.tagneed_batchAddTagTransfer({
              tagNeedId: this.id,
              gainIdsList: idList
            });
            if (res.code == 0) {
              this.conversionModal.close();
              this.searchData.page = 1;
              this.tagneed_findTagNeedById(this.searchData, true);
            } else {
              Tool.errorshow(res.msg, this.app);
            }
          } else {
            this.conversionModal.close();
            this.loadList(temp);
            // this.listData = temp;
            this.model.apiData.gainIdList = idList;
          }
        }
      );
      this.conversionModal.event._addEvent("conversionList.search", value => {
        console.log(value, "vvvv");
        this.tagneed_findTagInfoList(value);
      });
      this.tagneed_findTagInfoList({ page: 1, pageSize: 10 });
    });
    this.dropconfig = [
      {
        className: "xlk",
        name: "sicknessType",
        firstSelect: { val: "项目标签", idx: "" },
        data: Tool.configxlkformat(this.app.constmap["SICKNESS_TYPE"])
      },
      {
        className: "xlk",
        name: "projectFunction",
        firstSelect: { val: "项目目标", idx: "" },
        data: Tool.configxlkformat(this.app.constmap["PROJECT_FUNCTION"])
      }
    ];
    require.ensure("../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../moduleslibs/dropdown1/drop.js");
      this.dropconfig.forEach((val, idx) => {
        let drop = this.app.loadModule(
          dropdown,
          this.dom.find("." + val.name),
          {
            className: val.className,
            firstSelect: val.firstSelect,
            data: val.data,
            input: val.input
          }
        );
        drop.event._addEvent("option.click", value => {
          this.model.apiData[val.name] = value.idx;
          this.model.setData("apiData", this.model.apiData);
          console.log(this.model.apiData, "tagchange");
          this.app.session.set("ischanged", true);
        });
        drop.event._addEvent("dropDown.clear", value => {
          this.model.setData("apiData", this.model.apiData);
          this.model.apiData[val.name] = "";
        });
        this.dropobj[val.name] = drop;
      });
      this.type_action();
    });
    require.ensure("../moduleslibs/duoxuanxlk/duoxuanxlk.js", () => {
      let duoxuankuan = require("../moduleslibs/duoxuanxlk/duoxuanxlk.js");
      let mode = that.app.loadModule(duoxuankuan, that.dom.find(".mode"), {
        showname: "转换模式",
        data: this.modeList,
        datatype: "obj"
      });
      mode.event._addEvent("duoxuan.select", function(value) {
        that.model.apiData["mode"] = value.name;
        console.log(that.model.apiData, "apidata");
      });
      mode.event._addEvent("duoxuanxlk.clear", function(value) {
        that.model.apiData["mode"] = "";
      });
    });
  }
  setTitle() {
    let obj = {};
    this.model.listheader[this.type].tablewidth =
      ES.selctorDoc(".taggingNeedDetail").box().clientWidth - 40;
    require.ensure("../moduleslibs/table/table", () => {
      let cont_table = require("../moduleslibs/table/table");
      this.table = this.app.loadModule(
        cont_table,
        this.dom.find(".revertTable"),
        {
          id: "tablearea",
          header: this.model.listheader[this.type]
        }
      );
      this.table.event._addEvent("table.action", async value => {
        console.log(value, "ss");
        switch (value.classname) {
          case "start":
            this.app.alert.show({
              title: " ",
              msg: "确认执行吗？",
              close: true,
              sure: async () => {
                this.app.loading.show();
                let res1 = await this.api.tagneed_executeTagTransfer({
                  id: value.id * 1
                });
                this.app.loading.hide();
                if (res1.code == 0) {
                  this.searchData.page = 1;
                  this.tagneed_findTagNeedById(this.searchData, true);
                } else {
                  this.errorShow(res1.msg);
                }
              }
            });
            break;
          case "delete":
            this.app.alert.show({
              title: " ",
              msg: "确认删除吗？",
              close: true,
              sure: async () => {
                if (this.type == "edit") {
                  let res = await this.api.tagneed_batchDelTagTransfer({
                    idsList: [value.id * 1]
                  });
                  if (res.code == 0) {
                    this.searchData.page = 1;
                    this.tagneed_findTagNeedById(this.searchData, true);
                  } else {
                    this.errorShow(res.msg);
                  }
                } else {
                  let temp = this.nowList.filter(v => {
                    return v.id !== value.id;
                  });
                  this.nowList = temp;
                  let arr = [];
                  temp.forEach(v => {
                    arr.push(v.id);
                  });
                  this.model.apiData.gainIdList = arr;
                  this.loadList(temp);
                }
              }
            });
            break;
          case "export":
            let json = {
              tagNeedId: this.id,
              tagTransferIdList: value.id * 1
            };
            // let url = this.app.domain1 + 'v1/tagneed/convertList/export?param=' + encodeURI(JSON.stringify(json) + '&accessToken=' + window.localStorage.accessToken);
            let url =
              this.app.domain1 +
              "v1/tagneed/convertList/export?tagNeedId=" +
              this.id +
              "&tagTransferIdList=" +
              value.id * 1 +
              "&accessToken=" +
              window.localStorage.accessToken;
            //let token = this.app.local.get('accessToken')
            this.api.HttpRequest.downLoadFile(url, {
              key: "accessToken",
              val: this.app.local.get("accessToken")
            });
            break;
          case "restart":
            this.alertTips("确认重跑吗", async () => {
              this.app.loading.show();
              let res1 = await this.api.tagneed_restart({
                tagTransferIdList: [value.id * 1]
              });
              this.app.loading.hide();
              if (res1.code == 0) {
                this.searchData.page = 1;
                this.tagneed_findTagNeedById(this.searchData, true);
              } else {
                this.errorShow(res1.msg);
              }
            });
            break;
          case "stop":
            this.alertTips("确认暂停吗", async () => {
              let res1 = await this.api.tagneed_restart({
                tagTransferIdList: [value.id * 1]
              });
              if (res1.code == 0) {
                this.searchData.page = 1;
                this.tagneed_findTagNeedById(this.searchData, true);
              } else {
                this.errorShow(res1.msg);
              }
            });
            break;
          case "continue":
            this.alertTips("确认继续执行吗?", async () => {
              this.app.loading.show();
              let res1 = await this.api.tagneed_continueByTagTransferId({
                tagTransferId: value.id * 1
              });
              this.app.loading.hide();
              if (res1.code == 0) {
                this.searchData.page = 1;
                this.tagneed_findTagNeedById(this.searchData, true);
              } else {
                this.errorShow(res1.msg);
              }
            });
            break;
        }
      });
      this.table.event._addEvent("table.pagenumber", value => {
        this.dom.find(".tablearea .choose").removeClass("choose");
        this.listData = {};
        this.searchData.page = parseInt(value);
        this.table.changenum(this.searchData.page);
        this.tagneed_findTagNeedById(this.searchData, false);
      });
      this.table.event._addEvent("table.pagesize", value => {
        this.dom.find(".tablearea .choose").removeClass("choose");
        this.listData = {};
        this.searchData.page = 1;
        this.searchData.pageSize = value.num * 1;
        this.tagneed_findTagNeedById(this.searchData, true);
      });
      this.table.event._addEvent("table.check", value => {
        console.log(value, "value.check");
        let temp = value;
        if (temp.type == "add") {
          this.listData[temp.id] = value.data;
        } else {
          delete this.listData[temp.id];
        }
      });
      this.table.event._addEvent("table.allcheck", value => {
        console.log(value, "value");
        let temp = value;
        if (value.type == "add") {
          value.data.forEach(item => {
            this.listData[item.id] = item;
          });
        } else {
          value.data.forEach(item => {
            delete this.listData[item.id];
          });
        }
      });
      this.dom.find(".list-content").removeClass("hide");
      this.resize();
    });
  }
  async type_action() {
    switch (this.type) {
      case "edit":
        this.dom.find(".save").addClass("hide");
        this.tagneed_findTagNeedById(this.searchData, true);
        this.disabled("edit");
        break;
      case "view":
        this.dom.find(".save").addClass("hide");
        this.tagneed_findTagNeedById(this.searchData, true);
        this.disabled("view");
        this.dom.find(".batchArea").remove();
        break;
      default:
        this.dom.find(".save").on("click", async () => {
          this.dom.find(".inputLine").dom.forEach(val => {
            val.find("." + val.attr("redlabel")).removeClass("redborder");
            val.find(".required").remove();
            console.log(val, "val");
            if (Tool.checkForm(ES.selctorDoc(val).dom, "red") !== "") {
              if (val.find("." + val.attr("redlabel"))) {
                val.find("." + val.attr("redlabel")).addClass("redborder");
              }
              val
                .find("." + val.attr("redlabel"))
                .after(
                  '<span class="required">' +
                    Tool.checkForm(ES.selctorDoc(val).dom, "red") +
                    "</span>"
                );
            }
          });
          if (
            this.dom.find(".redborder").dom &&
            this.dom.find(".redborder").dom.some(val => {
              return !val.parent().hasClass("hide");
            })
          ) {
            return false;
          } else {
            let res = await this.api.tagneed_addTagNeed({ ...this.model.apiData, type: 1});
            if (res.code == 0) {
              this.app.changePage("taggingNeed");
            } else {
              Tool.errorshow(res.msg, this.app);
            }
          }
        });
        this.dom.find(".batchArea").remove();
    }
  }
  async tagneed_findTagNeedById(data, bool) {
    let res = await this.api.tagneed_findTagNeedById(data);
    if (res.code == 0) {
      this.dom.find('input[api="name"]').val(res.data.name);
      this.dropconfig.forEach(val => {
        this.dom
          .find(
            "." + val.name + ' .option[data-idx="' + res.data[val.name] + '"]'
          )
          .click();
      });
      let temp = res.data.mode.split(",");
      console.log(temp, "aaaa", this.modeList);
      let html = "";
      temp.forEach(val => {
        this.modeList.forEach(v => {
          if (v.idx == val) {
            html += v.val + "  ";
          }
        });
      });
      this.dom.find(".mode").html(html);
      console.log(
        res.data.tagTransferPageInfo.list.length,
        "res.data.tagTransferPageInfo.list.length"
      );
      this.loadList(
        res.data.tagTransferPageInfo.list,
        bool,
        res.data.tagTransferPageInfo.pages,
        res.data.tagTransferPageInfo.total
      );
    } else {
      Tool.errorshow(res.msg, this.app);
    }
    this.initscroll();
  }
  alertTips(msg, callback) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: true,
      sure: callback
    });
  }
  loadList(list, bool, pages, total) {
    if (list.length > 0) {
      // this.total = res.data.total
      console.log(list, "ddd");
      this.nowList = list;
      list.forEach((val, idx) => {
        for (let i in val) {
          val[i] = val[i] == null ? "" : val[i];
        }
        if (this.type == "new") {
          val.operation = this.model.listicon[this.type].action;
        } else {
          switch (val.status) {
            case 0:
              val.status = " ";
              val.operation = this.model.listicon[this.type].action;
              break;
            case 1:
              val.status = "执行中";
              if (val.failNum > 0) {
                val.operation = this.model.listicon[this.type].action3;
              } else if (val.successNum > 0) {
                val.operation = this.model.listicon[this.type].action4;
              } else {
                val.operation = this.model.listicon[this.type].action8;
              }
              break;
            case 2:
              val.status = "已完成";
              if (val.failNum > 0) {
                val.operation = this.model.listicon[this.type].action3;
              } else if (val.successNum > 0) {
                val.operation = this.model.listicon[this.type].action4;
              } else {
                val.operation = this.model.listicon[this.type].action8;
              }
              break;
            case 4:
              val.status = "已暂停";
              if (val.successNum > 0 || val.failNum > 0) {
                val.operation = this.model.listicon[this.type].action1;
              } else {
                val.operation = this.model.listicon[this.type].action2;
              }
              break;
          }
        }
      });
      this.table.setData(list);
    } else {
      this.table.noData();
    }
    if (bool) {
      this.table.getTotal(pages, 2, total);
    }
    this.initscroll();
  }

  async tagneed_findTagInfoList(data) {
    data.userId = JSON.parse(this.app.local.get("all")).userId;
    let res = await this.api.tagneed_findTagInfoList(data);
    if (res.code == 0) {
      this.conversionModal.renderList(res.data);
    } else {
      Tool.errorshow(res.msg, this.app);
    }
  }

  async getdictionary() {
    this.constmap = {};
    this.modalConfig = {};
    let res = await this.api.getdictionary({
      method: "/v1/data/request/algTarget/query/fuzzy",
      params: `{"type":"algTarget","value":"","userId":${
        JSON.parse(this.app.local.get("all")).userId
      }}`,
      service: "DR"
    });
    if (res.code == 0) {
      let temparr = [];
      res.data.map(item => {
        temparr.push(item);
      });
      this.modalConfig.algTarget = temparr;
      this.modalConfig.modality = this.app.constmap["MODALITY"];
      this.modalConfig.bodyPart = this.app.constmap["BODY_PART"];
    } else {
      Tool.errorshow(res.msg, this.app);
    }
  }
  bindchangefile() {
    let that = this;
    this.dom.find(".file").on("change", () => {
      let filePath = ES.selctorDoc("#file").val();
      let fileType = Tool.getFileType(filePath);
      if ("xlsx" !== fileType && "xls" !== fileType) {
        ES.selctorDoc("#filechoose").val("");
        this.app.alert.show({
          title: "",
          template:
            '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
          close: false,
          sure: () => {
            this.app.alert.hide();
          }
        });
      } else {
        this.app.loading.show();
        $.ajaxFileUpload({
          url: "/aaa/v1/tagneed/addTagTransfer/importSeries", // that.app.domain+'/ccc/user/import',
          secureuri: false,
          dataType: "JSON",
          async: false,
          data: {
            tagNeedId: this.id * 1,
            userId: JSON.parse(that.app.local.get("all")).userId,
            accessToken: window.localStorage.accessToken
          },
          type: "post",
          fileElementId: "file",
          success: (data, status, e) => {
            this.app.loading.hide();
            let jsonArr = JSON.parse(data.match(/{.+}/g)[0]);
            console.log(jsonArr, "jsonAee");
            if (jsonArr.code == 0) {
              this.app.alert.show({
                title: "",
                template:
                  '<span style="font-size: 18px;margin-left:20px;">成功导入' +
                  jsonArr.data.successCount +
                  "条，失败" +
                  jsonArr.data.errorCount +
                  "条</span>",
                sure: false,
                close: true,
                footer: true
              });
              this.tagneed_findTagNeedById(this.searchData, true);
            } else {
              let msg = jsonArr.code == -1 ? "繁忙" : jsonArr.msg;
              this.app.alert.show({
                title: "",
                template:
                  '<span style="font-size: 18px;margin-left:20px;">' +
                  msg +
                  "</span>",
                sure: false,
                close: true,
                footer: true
              });
            }
            this.dom.find(".file").remove();
            this.dom
              .find(".batchArea")
              .append(
                '<input class="file" type="file" id="file" name="file"/>'
              );
            that.bindchangefile();
          }
        });
      }
    });
  }

  disabled(type) {
    for (let i in this.dropobj) {
      this.dropobj[i].disable();
    }
    this.dom.find(".toparea input").attr("disabled", "disabled");
    if (type == "view") {
      this.dom.find(".icon-tianjia").remove();
      this.dom.find(".batchArea").remove();
    }
  }

  errorShow(msg) {
    this.app.alert.show({
      title: " ",
      msg: msg,
      close: false
    });
  }

  initscroll() {
    if (this.myScroll) {
      this.myScroll.refresh();
      return;
    }
    var rid = "aaa_" + Math.floor(new Date().getTime() * Math.random());
    this.dom.find(".taggingNeedDetail .revertTable").attr("id", rid);
    this.myScroll = new IScroll("#" + rid, {
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      hideScrollbar: false,
      vScrollbar: true,
      shrinkScrollbars: "scale",
      fadeScrollbars: false,
      disableMouse: true,
      disablePointer: true
    });
  }

  resize() {
    let ch = ES.selctorDoc(window).box().clientHeight;
    let cw = ES.selctorDoc(window).box().clientWidth - 40;
    ES.selctorDoc(".taggingNeedDetail").css({
      height: ch - 90,
      width: cw
    });
    this.dom
      .find(".taggingNeedDetail .revertTable")
      .css({ height: ch - 380, width: cw });
  }
}

module.exports = taggingNeedDetail;
