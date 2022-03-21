class imagedataglmodel extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.proseriesdata = {page:1,pageSize:10,isselected:'no'}
        console.log(ES.selctorDoc('.imagedatagl').box().clientWidth-140,'width')
        this.radiotable={
            icon:{
                "seriesInstanceUID": { name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '11%', ww: '11%', n: "40"},
                "hospitalName": { name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '7%', ww: '7%' },
                "bodyPart": { name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '4%', ww: '4%', },
                "modality": { name: '<span data-i18n="age" data-name="年龄">检查机型</span>', type: 'text', code: 'pname', w: '5%', ww: '5%' },
                "studyDate": { name: '<span data-i18n="age" data-name="年龄">检查时间</span>', type: 'text', code: 'psex', w: '7%', ww: '7%' },
                "studyInstanceUID": { name: '<span data-i18n="age" data-name="年龄">检查号</span>', type: 'text', code: 'age', w: '9%', ww: '9%' },
                "fileType": { name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '6%', ww: '6%' },
                "patientAge": { name: '<span data-i18n="handler" data-name="状态">年龄</span>', type: 'text', code: 'handler', w: '6%', ww: '6%', },
                "patientSex": { name: '<span data-i18n="action" data-name="操作">性别</span>', type: 'text', code: 'action', w: '5%', ww: '5%' },
                "importDate": { name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '6%', ww: '6%' },
                "valid": { name: '<span data-i18n="action" data-name="操作">序列是否有效</span>', type: 'text', code: 'action', w: '6%', ww: '6%' },
                "keyword": { name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '8%', ww: '8%' },
                "finding": { name: '<span data-i18n="action" data-name="操作">检查所见</span>', type: 'text', code: 'action', w: '10%', ww: '10%' },
                "conclusion": { name: '<span data-i18n="action" data-name="操作">诊断</span>', type: 'text', code: 'action', w: '10%', ww: '10%' }
            },
            actionicon:{
                "operation": { name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action',code:'action', w: '100%', ww: '100%' }
            },
            tablewidth:ES.selctorDoc('.imagedatagl').box().clientWidth-140,
            type:'center',
            minwidth:2500
        }
        this.othertable={
            icon:{
                "seriesInstanceUID": { name: '<span data-i18n="date" data-name="检查时间">序列号</span>', type: 'text', code: 'date', w: '20%', ww: '20%', n: "40"},
                "hospitalName": { name: '<span data-i18n="age" data-name="年龄">医院名称</span>', type: 'text', code: 'checkid', w: '10%', ww: '10%' },
                "bodyPart": { name: '<span data-i18n="age" data-name="年龄">部位</span>', type: 'text', code: 'pid', w: '10%', ww: '10%', },
                "modality": { name: '<span data-i18n="age" data-name="年龄">检查设备</span>', type: 'text', code: 'pname', w: '15%', ww: '15%' },
                "fileType": { name: '<span data-i18n="shebei" data-name="设备">文件类型</span>', type: 'text', code: 'shebei', w: '15%', ww: '15%' },
                "importDate": { name: '<span data-i18n="action" data-name="操作">上传时间</span>', type: 'text', code: 'action', w: '15%', ww: '15%' },
                "keyword": { name: '<span data-i18n="action" data-name="操作">关键字</span>', type: 'text', code: 'action', w: '15%', ww: '15%' },
            },
            actionicon:{
                "operation": { name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action',code:'action', w: '100%', ww: '100%' }
            },
            tablewidth:ES.selctorDoc('.imagedatagl').box().clientWidth-140,
            type:'center'
        }
        //this.bodypart=[{idx:'LUNG',val:'肺部'},{idx:'RIB',val:'肋骨'},{idx:'KNEE_JOINT',val:'膝关节'},{idx:'COXA_JOINT',val:'髋关节'},{idx:'HAND',val:'手'},{idx:'FOOT',val:'足'},{idx:'SKULL_BRAIN',val:'颅脑'},{idx:'HEART',val:'心脏'},{val:'眼底',idx:'EYEGROUND'}]
        this.radiobasicconfig=[
            {
                type:'checkbox',
                name: 'hospitalCode',
                showname: '医院名称',
                datatype:'obj',
                input:true,
                data: [],
                key:'name'
            }, {
                type:'checkbox',
                name: 'bodyPart',
                showname: '部位',
                datatype:'obj',
                data:Tool.configxlkformat(app.constmap['BODY_PART'])
            }, {
                type:'checkbox',
                name: 'modality',
                showname: '检查设备',
                datatype:'obj',
                data:Tool.configxlkformat(app.constmap['MODALITY'])
            }, {
                type:'checkbox',
                name: 'fileType',
                showname: '文件类型',
                datatype:'arr',
                data: ['DCM','JPG']
            }, {
                type:'inputrange',
                name: 'csfilter',
                showname: '层数范围'
            }, {
                type:'inputrange',
                name: 'fileType',
                showname: '年龄范围'
            },{
                type:'select',
                name: 'patientAgeType',
                showname: '',
                data: [{val: '岁', idx: 'year'}, {val: '月', idx: 'month'}]
            },{
                type:'select',
                name: 'patientSex',
                showname: '性别',
                data: [{val: '男', idx: 'M'}, {val: '女', idx: 'F'}]
            },{
                type:'time_double',
                name: 'timefiltercont',
                showname: '入库日期'
            },{
                type:'input',
                name: 'keyword',
                showname: '关键字'
            },{
                type:'input',
                name: 'seriesInstanceUID',
                showname: '序列号'
            }
        ]
        this.radiomoreconfig=[
            {
                type:'checkbox',
                name: 'kernelCapital',
                showname: '选择重建Kernel首字母',
                datatype:'arr',
                data: ['H','B','C','S','T','K','I']
            }, {
                type:'inputrange',
                name: 'fileType',
                showname: 'Kernel数值范围'
            }, {
                type:'inputrange',
                name: 'chfilter',
                showname: '层厚区间(mm)'
            },{
                type:'inputrange',
                name: 'kvp',
                showname: '电压范围'
            }, {
                type:'checkbox',
                name: 'row',
                showname: '排数选择',
                datatype:'arr',
                data: [16,32,64,128,256]
            },{
                type:'select',
                name: 'isValid',
                showname: '序列是否有效',
                data: [{val: '是', idx: 1}, {val: '否', idx: 0}]
            },{
                type:'select',
                name: 'jpgValid',
                showname: 'JPG化是否成功',
                data: [{val: '是', idx: 1}, {val: '否', idx: 0}]
            },{
                type:'time_double',
                name: 'timefiltercont1',
                showname: '检查时间'
            }
        ]
    }
}
module.exports = imagedataglmodel;