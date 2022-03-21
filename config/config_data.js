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
function data_Config(value) {
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
            [{ "type": "dropdown", "name": "row", "showname": "排数选择", "datatype": "obj", "data": [{ "val": "16", "idx": "16" }, { "val": "32", "idx": "32" }, { "val": "64", "idx": "64" }, { "val": "128", "idx": "128" }, { "val": "256", "idx": "256" }], "key": "", "out": true }, { "type": "editdone", "name": "row", "showname": "排数编辑", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "texts", "name": "seriesInstanceUID", "showname": "序列号", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "texts", "name": "studyInstanceUID", "showname": "检查号", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dTexts", "name": "csfilter", "showname": "层数范围", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dTexts", "name": "dyfilter", "showname": "电压范围", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dropdownS", "name": "valid", "showname": "序列是否有效", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
            [{ "type": "dropdownS", "name": "jpgValid", "showname": "JPG化是否成功", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
            [{ "type": "dTexts", "name": "windowWidth", "showname": "窗宽范围", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dTexts", "name": "windowCenter", "showname": "窗位范围", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dropdownS", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "inspect", "showname": "检查所见", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "inspect", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }],
            [{ "type": "dropdownS", "name": "check", "showname": "诊断所见", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "并且", "datatype": "obj", "data": [{ "val": "并且", "idx": "AND" }, { "val": "或者", "idx": "OR" }], "key": "", "out": true }, { "type": "dropdown", "name": "check", "showname": "包含", "datatype": "obj", "data": [{ "val": "包含", "idx": "CONTAIN" }, { "val": "不包含", "idx": "NOT_CONTAIN" }], "key": "", "out": true }, { "type": "text", "name": "check", "showname": "诊断", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "time", "name": "inspectTime", "showname": "检查时间", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "time", "name": "uploadTime", "showname": "上传时间", "datatype": "obj", "data": null, "key": "", "out": true }]
        ],
        "bl": [
            [{ "type": "dobuledropdown", "name": "hospitalCode", "showname": "医院名称", "datatype": "obj", "input": true, "data": [], "key": "name", "out": true }],
            [{ "type": "dobuledropdown", "name": "bodyPart", "showname": "部位", "datatype": "obj", "data": Tool.configxlkformat(value['BODY_PART']), "key": "", "out": true }],
            [{ "type": "dobuledropdown", "name": "modality", "showname": "检查机型", "datatype": "obj", "data":Tool.configxlkformat(value['MODALITY']), "key": "", "out": true }],
            [{ "type": "dobuledropdown", "name": "fileType", "showname": "文件类型", "datatype": "obj", "data": [{ "val": "DCM", "idx": "DCM" }, { "val": "JPG", "idx": "JPG" }], "key": "", "out": true }],
            [{ "type": "texts", "name": "keyword", "showname": "关键字", "datatype": "str", "data": null, "key": "", "out": true }],
            [{ "type": "texts", "name": "equipment", "showname": "设备", "datatype": "str", "data": null, "key": "", "out": true }],
            [{ "type": "texts", "name": "seriesInstanceUID", "showname": "序列号", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "texts", "name": "studyInstanceUID", "showname": "检查号", "datatype": "obj", "data": null, "key": "", "out": true }],
            [{ "type": "dropdownS", "name": "valid", "showname": "序列是否有效", "datatype": "obj", "data": [{ "val": "是", "idx": "1" }, { "val": "否", "idx": "0" }], "key": "", "out": true }],
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
            [{ "type": "time", "name": "uploadTime", "showname": "上传时间", "datatype": "obj", "data": null, "key": "", "out": true }]
        ]
    }
    return datalist
}
module.exports = data_Config;
