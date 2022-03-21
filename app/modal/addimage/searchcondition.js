//任何一种配置都是2位数组
//第一维度是包含全部
//第二个维度是某个条件所要包含的组件类型
//每个组件下面的属性解释
/*
type:组件类型
name:组件的的ode
showname:组件的label名字
datatype:暂时无用，其实应该跟组件返回数据类型挂钩
input:输入框是否可以输入
data:下拉框的内容列表，后期可以跟常量表融合
key:后端对应的字段
out:代表组件是为普通搜素还是高级搜素，true代表为普通搜素，false代表为高级搜素
*/
//组件类型分为以下几种

/*dobuledropdown：多选下拉框
dTexts：两个输入框，并且前面带有文字标
texts：输入框，并且前面带有文字标签
text：输入框，并且前面无文字标签
dropdownS：下拉框，并且前面带有文字标签
dropdown：下拉框，并且前面无文字标签
time：时间控件
editdone：编辑按钮
*/
/*
依照头部列表而来
fs 代表放射，
bl 代表病理
qt 代表其他
*/
function searchcondition(value) {
  let datalist = {
    "fs": [
      [{ "type": "dobuledropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "input": true, "data": [], "key": "name", "out": true }],
      [{ "type": "dobuledropdown", "name": "bodyPart", "showname": "部位", "datatype": "obj", "data": Tool.configxlkformat(value['BODY_PART']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "modality", "showname": "检查机型", "datatype": "obj", "data":Tool.configxlkformat(value['MODALITY']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "fileType", "showname": "文件类型", "datatype": "obj", "data": [{ "val": "DCM", "idx": "DCM" }, { "val": "JPG", "idx": "JPG" }], "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "kernelCapital", "showname": "选择重建Kernel首字母", "datatype": "obj", "data": [{ "val": "H", "idx": "H" }, { "val": "B", "idx": "B" }, { "val": "C", "idx": "C" }, { "val": "S", "idx": "S" }, { "val": "T", "idx": "T" }, { "val": "K", "idx": "K" }, { "val": "I", "idx": "I" }], "key": "", "out": true }],
      [{ "type": "dTexts", "name": "kernalfilter", "showname": "Kernel数值范围", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "keyword", "showname": "关键字", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "equipment", "showname": "设备", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "patientAgeType", "showname": "年龄范围", "datatype": "obj", "data": [{ "val": "岁", "idx": "year" }, { "val": "月", "idx": "month" }], "key": "", "out": true }, { "type": "dText", "name": "patientAgeType", "showname": "年龄范围", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdown", "name": "patientSex", "showname": "性别", "datatype": "obj", "data": [{ "val": "男", "idx": "M" }, { "val": "女", "idx": "F" }], "key": "", "out": true }],
      [{ "type": "dTexts", "name": "chfilter", "showname": "层厚区间(mm)", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdown", "name": "row", "showname": "排数选择", "datatype": "obj", "data": [{ "val": "16", "idx": "16" }, { "val": "32", "idx": "32" }, { "val": "64", "idx": "64" }, { "val": "128", "idx": "128" }, { "val": "256", "idx": "256" }], "key": "", "out": true }],
      [{ "type": "texts", "name": "seriesInstanceUID", "showname": "序列号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "studyInstanceUID", "showname": "检查号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dTexts", "name": "csfilter", "showname": "层数范围", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dTexts", "name": "dyfilter", "showname": "电压范围", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "valid", "showname": "序列是否有效", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "jpgValid", "showname": "JPG化是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true ,"input":false}],
      [{ "type": "dTexts", "name": "windowWidth", "showname": "窗宽范围", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dTexts", "name": "windowCenter", "showname": "窗位范围", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "mhaValid", "showname": "mha是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "jpgCompressValid", "showname": "jpg压缩是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "check", "showname": "诊断所见", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "time", "name": "inspectTime", "showname": "检查时间", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "time", "name": "uploadTime", "showname": "上传时间", "datatype": "obj", "data": null, "key": "", "out": true }]
    ],
    "bl": [
      [{ "type": "dobuledropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "input": true, "data": [], "key": "name", "out": true }],
      [{ "type": "dobuledropdown", "name": "bodyPart", "showname": "部位", "datatype": "obj", "data": Tool.configxlkformat(value['BODY_PART']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "modality", "showname": "检查机型", "datatype": "obj", "data":Tool.configxlkformat(value['MODALITY']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "fileType", "showname": "文件类型", "datatype": "obj", "data": [{ "val": "DCM", "idx": "DCM" }, { "val": "JPG", "idx": "JPG" }, { "val": "BIG_IMAGE", "idx": "BIG_IMAGE" }], "key": "", "out": true }],
      [{ "type": "texts", "name": "keyword", "showname": "关键字", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "equipment", "showname": "设备", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "seriesInstanceUID", "showname": "切片号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "studyInstanceUID", "showname": "检查号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "valid", "showname": "切片是否有效", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "jpgCompressValid", "showname": "jpg压缩是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdown", "name": "stainingMethod", "showname": "染色方法", "datatype": "obj", "data": Tool.configxlkformat(value['STAINING_METHODS']), "key": "", "out": true }],
      [{ "type": "dropdown", "name": "sampleClassification", "showname": "样本分类", "datatype": "obj", "data": Tool.configxlkformat(value['SAMPLE_CLASSIFICATION']), "key": "", "out": true }],
      [{ "type": "dropdown", "name": "sampleLocation", "showname": "采样位置", "datatype": "obj", "data": Tool.configxlkformat(value['SAMPLE_LOCATION']), "key": "", "out": true }],
      [{ "type": "dropdown", "name": "sampleMethod", "showname": "取样方法", "datatype": "obj", "data": Tool.configxlkformat(value['SAMPLING_METHODS']), "key": "", "out": true }],
      [{ "type": "time", "name": "uploadTime", "showname": "上传时间", "datatype": "obj", "data": null, "key": "", "out": true }]
    ],
    "qt": [
      [{ "type": "dobuledropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "input": true, "data": [], "key": "name", "out": true }],
      [{ "type": "dobuledropdown", "name": "bodyPart", "showname": "部位", "datatype": "obj", "data": Tool.configxlkformat(value['BODY_PART']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "modality", "showname": "检查机型", "datatype": "obj", "data":Tool.configxlkformat(value['MODALITY']), "key": "", "out": true }],
      [{ "type": "dobuledropdown", "name": "fileType", "showname": "文件类型", "datatype": "obj", "data": [{ "val": "DCM", "idx": "DCM" }, { "val": "JPG", "idx": "JPG" }], "key": "", "out": true }],
      [{ "type": "texts", "name": "keyword", "showname": "关键字", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "equipment", "showname": "设备", "datatype": "str", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "seriesInstanceUID", "showname": "序列号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "texts", "name": "studyInstanceUID", "showname": "检查号", "datatype": "obj", "data": null, "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "valid", "showname": "序列是否有效", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "dropdownS", "name": "jpgCompressValid", "showname": "jpg压缩是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
      [{ "type": "time", "name": "uploadTime", "showname": "上传时间", "datatype": "obj", "data": null, "key": "", "out": true }]
    ],
    "tableconfig" : {
      fs: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '11%', ww: '11%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '7%', ww: '7%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '4%', ww: '4%',},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查机型</span>', type: 'text', code: 'pname', w: '5%', ww: '5%'},
          "studyDate": {name: '<span data-i18n="age" data-name="年龄">检查时间</span>', type: 'text', code: 'psex', w: '7%', ww: '7%'},
          "studyInstanceUID": {name: '<span data-i18n="age" data-name="年龄">检查号</span>', type: 'text', code: 'age', w: '9%', ww: '9%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '6%', ww: '6%'},
          "patientAge": {name: '<span data-i18n="handler" data-name="状态">年龄</span>', type: 'text', code: 'handler', w: '6%', ww: '6%',},
          "patientSex": {name: '<span data-i18n="action" data-name="操作">性别</span>', type: 'text', code: 'action', w: '5%', ww: '5%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '6%', ww: '6%'},
          "valid": {name: '<span data-i18n="action" data-name="操作">序列是否有效</span>', type: 'text', code: 'action', w: '6%', ww: '6%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '8%', ww: '8%'},
          "finding": {name: '<span data-i18n="action" data-name="操作">检查所见</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
          "conclusion": {name: '<span data-i18n="action" data-name="操作">诊断</span>', type: 'text', code: 'action', w: '10%', ww: '10%'}
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        },
      },
      qt: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '11%', ww: '11%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '10%', ww: '10%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '10%', ww: '10%',},
          "studyInstanceUID": {name: '<span data-i18n="age" data-name="年龄">检查号</span>', type: 'text', code: 'age', w: '9%', ww: '9%'},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查设备</span>', type: 'text', code: 'pname', w: '15%', ww: '15%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '15%', ww: '15%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '15%', ww: '15%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '15%', ww: '15%'},
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        }
      },
      bl: {
        icon: {
          "seriesInstanceUID": {name: '<span data-i18n="date" data-name="检查时间">切片号</span>', type: 'text', code: 'date', w: '9%', ww: '9%', n: "40"},
          "hospitalCode": {name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '9%', ww: '9%'},
          "bodyPart": {name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '6%', ww: '6%',},
          "modality": {name: '<span data-i18n="age" data-name="年龄">检查设备</span>', type: 'text', code: 'pname', w: '7%', ww: '7%'},
          "fileType": {name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "studyInstanceUID": {name: '<span data-i18n="age" data-name="年龄">检查号</span>', type: 'text', code: 'age', w: '9%', ww: '9%'},
          "stainingMethod": {name: '<span data-i18n="shebei" data-name="设备">染色方法</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleClassification": {name: '<span data-i18n="shebei" data-name="设备">样本分类</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleLocation": {name: '<span data-i18n="shebei" data-name="设备">采样位置</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "sampleMethod": {name: '<span data-i18n="shebei" data-name="设备">取样方法</span>', type: 'text', code: 'shebei', w: '8%', ww: '8%'},
          "importDate": {name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
          "keyword": {name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '10%', ww: '10%'},
        },
        actionicon: {
          "operation": {name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%'}
        }
      }
    }
  }
  return datalist
}
module.exports = searchcondition;
