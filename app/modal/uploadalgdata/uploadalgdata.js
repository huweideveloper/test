require('./uploadalgdata.less')
import { Loading } from 'element-ui'

class uploadalgdata extends Interstellar.modalBase {
  constructor(app, dom, value, addMode) {
    super(app, dom, value, addMode)
    this.html = require('./tpl.html')
    this.name = 'uploadalgdata'
    this.flag = true;
    this.code = ''
    this.data = value;
    this.apiData = {transferNii:false}
    this.api.toolList.forEach((item) =>{
      this.app.toolList.forEach((cn) =>{
        if(item.val == cn.idx){
          item.val = cn.val
        }
      })
    })
  }

  complete() {
    let that = this
    let uploadLoading
    this.dom.find('.icon-guanbi').on('click', function () {
      that.close();
    })
    this.dom.find('.cancel').on('click', function () {
      that.close();
    })
    const fileDom = that.dom.find('.file')
    this.dom.find('.filechoose').on('click', function() {
      fileDom.click()
      uploadLoading = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)'
      })
    })
    fileDom.on('change', function() {
      const filePath = ES.selctorDoc("#file1").val()
      that.dom.find('.filename').val(filePath)
      uploadLoading && uploadLoading.close()
    })

    that.dom.find('.isRunAlgorithm .check-box').on('click', function() {
      if(!ES.selctorDoc(this).hasClass('choose')){
        ES.selctorDoc(this).addClass('choose');
        // 选择了需要跑算法，再让其选择算法模型和版本
        that.isRunAlgorithm = true
        that.loadAlgTypeAndVersion()
        that.dom.find('.algTypeWrapper').removeClass('hide')
        that.dom.find('.versionNumberWrapper').removeClass('hide')
      }else{
        ES.selctorDoc(this).removeClass('choose');
        that.isRunAlgorithm = false
        that.dom.find('.algTypeWrapper').addClass('hide')
        that.dom.find('.versionNumberWrapper').addClass('hide')
      }
    })
    that.dom.find('.mask .convert-to-mask i').on('click', function() {
      if(!ES.selctorDoc(this).hasClass('choose')){
        ES.selctorDoc(this).addClass('choose');
        that.apiData.transferNii = true
      }else{
        ES.selctorDoc(this).removeClass('choose');
        that.apiData.transferNii = false
      }
    })
    that.dom.find('.mask .convert-cube-to-mask i').on('click', function() {
      if(!ES.selctorDoc(this).hasClass('choose')) {
        ES.selctorDoc(this).addClass('choose');
        that.apiData.transferCuboidMask = true
      }else{
        ES.selctorDoc(this).removeClass('choose');
        that.apiData.transferCuboidMask = false
      }
    })
    this.dom.find('.upload').on('click', () => {
      that.dom.find('.inputLine').dom.forEach(function (val, idx) {
        val.find('.' + val.attr('redlabel')).removeClass('redborder')
        val.find('.required').remove();
        if (Tool.checkForm(ES.selctorDoc(val).dom, 'red') !== '') {
          val.find('.' + val.attr('redlabel')).addClass('redborder')
          val.find('.' + val.attr('redlabel')).after('<span class="required">' + Tool.checkForm(ES.selctorDoc(val).dom, 'red') + '</span>')
        }
      })
      if (that.dom.find('.redborder').dom && that.dom.find('.redborder').dom.some((item) => { return item.box().clientHeight !== 0 })) {
        return false
      } else {
        const tempDataType = this.apiData['dataType']
        if (tempDataType === 4 || (tempDataType === 3 && this.isRunAlgorithm)) { // 数据类型选择的‘冠脉命名’，或者选择了mpr并且勾选了需要跑算法
          Object.assign(that.apiData, {
            algType: that.algType,
            versionNumber: that.versionNumber
          })
        } else {
          delete that.apiData.algType
          delete that.apiData.versionNumber
        }
        that.event._dispatch('uploadalgdata.upload', {data: that.apiData})
      }
    })
    this.render()
  }

  render(value) {
    const dataTypeList = [{idx: '1', val: 'nii'}, {idx: '2', val: '点位'}, {idx: '3', val: 'mpr'}]
    location.hash.includes('createbackflowpro3') && dataTypeList.push({idx: '4', val: '冠脉命名'}) // 只有在算法项目编辑的第三步时，点击导入标注结果的弹窗中数据类型字段才会有'冠脉命名'选择项
    let dropConfig=[
      {name:'type',className: 'xlk',firstSelect:{val: '请选择标注结果类型', idx: ''},data:[{idx: '1', val: '序列标注结果'}, {idx: '2', val: '影像标注结果'}, {idx: '3', val: '影像分割结果'}],maxshownum:5},
      {name:'toolType',className: 'xlk',firstSelect:{val: '请选择标注所需工具', idx: ''},data:this.api.toolList,maxshownum:5},
      {name:'dataType',className: 'xlk',firstSelect:{val: '数据类型', idx: ''},data: dataTypeList, maxshownum:5},
    ]
    require.ensure("../../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      let dropObj={}
      dropConfig.forEach((val,idx) => {
        dropObj[val.name] = this.app.loadModule(dropdown, this.dom.find('.' + val.name), {
          className: 'xlk',
          firstSelect: val.firstSelect,
          data: val.data,
          maxshownum: val.maxshownum
        })
        dropObj[val.name].event._addEvent('dropDown.clear', () => {
          this.apiData[val.name] = null
        })
        dropObj[val.name].event._addEvent('option.click', (value) => {
          this.apiData[val.name] = value.idx;
        })
      })
      dropObj['type'].event._addEvent('option.click', (value) => {
        if(value.idx == 1) {
          this.dom.find('.tool').addClass('hide')
          this.dom.find('.mask .convert-to-mask').addClass('hide')
          this.dom.find('.mask .convert-cube-to-mask').addClass('hide')
          // 隐藏了就不传对应字段了
          delete this.apiData.transferNii
          delete this.apiData.transferCuboidMask

          if(this.api.type == 'project'){
            this.dom.find('.dataType').parent().addClass('hide')
          }
        }else {
          this.dom.find('.tool').removeClass('hide')
          this.dom.find('.mask .convert-to-mask').removeClass('hide')
          if(this.api.type == 'project'){
            this.dom.find('.dataType').parent().removeClass('hide')
          }
        }
        this.apiData['type'] = parseInt(value.idx);
      })
      if(this.api.type == 'project'){
        dropObj['dataType'].event._addEvent('option.click', (value) => {
          const selectedDataType = parseInt(value.idx)
          // 改变时显示
          this.dom.find('.tool').removeClass('hide')
          this.dom.find('.mask .convert-to-mask').removeClass('hide')

          if (selectedDataType === 3) { // 数据类型选择的mpr
            !location.hash.includes('createbackflowtask2') && this.dom.find('.isRunAlgorithm').removeClass('hide')
            this.dom.find('.algTypeWrapper').addClass('hide')
            this.dom.find('.versionNumberWrapper').addClass('hide')
          } else {
            this.dom.find('.isRunAlgorithm').addClass('hide')
            if (selectedDataType === 4) { // 数据类型选择的冠脉命名
              this.loadAlgTypeAndVersion()
              this.dom.find('.algTypeWrapper').removeClass('hide')
              this.dom.find('.versionNumberWrapper').removeClass('hide')
            } else {
              this.dom.find('.algTypeWrapper').addClass('hide')
              this.dom.find('.versionNumberWrapper').addClass('hide')
            }
          }
          if (selectedDataType === 2) { // 选择的数据类型是点位，则显示“方体转mask”
            this.dom.find('.mask .convert-cube-to-mask').removeClass('hide')
          } else {
            this.dom.find('.mask .convert-cube-to-mask').addClass('hide')
            delete this.apiData.transferCuboidMask
          }
          this.apiData['dataType'] = selectedDataType;
        })
      }
    })
  }
  loadAlgTypeAndVersion() {
    this.dropobj = {}
    let dropConfig = [
      {
        name: "algType",
        className: "xlk",
        firstSelect: {
          val: "算法模型",
          idx: ""
        },
        data: Tool.configxlkformat(this.app.constmap["ALG_VERSION"])
      },
      {
        name: "versionNumber",
        className: "xlk",
        firstSelect: {
          val: "模型版本",
          idx: ""
        },
        data: [],
        datatype: "arr"
      }
    ]
    require.ensure("../../moduleslibs/dropdown1/drop.js", () => {
      let dropdown = require("../../moduleslibs/dropdown1/drop.js")
      dropConfig.forEach((val, idx) => {
        let drop = this.app.loadModule(
          dropdown,
          this.dom.find("." + val.name),
          {
            className: val.className,
            firstSelect: val.firstSelect,
            data: val.data,
            input: val.input,
            datatype: val.datatype
          }
        )
        this.dropobj[val.name] = drop
      })
      this.dropobj["algType"].event._addEvent("option.click", value => {
        if (value.idx == 'CORONARY_NAMING_NO_SEGMENT') { // 选择了’冠脉命名不分割‘，隐藏标注所需工具
          this.dom.find('.tool').addClass('hide')
          this.dom.find('.mask .convert-to-mask').addClass('hide')
          delete this.apiData.toolType // 隐藏了就不传对应字段了
        } else {
          this.dom.find('.tool').removeClass('hide')
          this.dom.find('.mask .convert-to-mask').removeClass('hide')
        }

        this.algType = value.idx
        let arr = []
        this.app.constmap["ALG_VERSION"].children.forEach(v => {
          if (value.idx == v.value) {
            arr = v.remark.split("/")
          }
        })
        this.dropobj["versionNumber"].renderHtml(arr)
        this.dropobj["versionNumber"].reset()
        this.versionNumber = null
      })
      this.dropobj["algType"].event._addEvent("dropDown.clear", val => {
        this.algType = null
        this.dropobj["versionNumber"].renderHtml([])
      })
      this.dropobj["versionNumber"].event._addEvent("option.click", val => {
        this.versionNumber = val.idx
      })
      this.dropobj["versionNumber"].event._addEvent("dropDown.clear", val => {
        this.versionNumber = null
      })
    })
  }
}

//原型链一定要有的
module.exports = uploadalgdata;
