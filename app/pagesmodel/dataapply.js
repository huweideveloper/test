class dataapply extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.condition =[
            [{ "type": "texts", "name": "projectName", "showname": "所属项目", "datatype": "obj", "key": "name", "out": true }],
            [{ "type": "dropdown", "name": "bodyPart", "showname": "请选择部位", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['BODY_PART']), "key": "bodyPart", "out": true }],
            [{ "type": "dropdown", "name": "priority", "showname": "请选择优先级", "datatype": "arr", "data": ['P0','P1','P2','P3','P4'], "key": "status", "out": true }],
            [{ "type": "texts", "name": "modality", "showname": "数据类型", "datatype": "obj", "key": "datatype", "out": true }],
            [{ "type": "texts", "name": "keywords", "showname": "搜索关键字", "datatype": "obj", "key": "keyword", "out": true }],
        ]
        this.tableconfig = {
            icon: {
                "id": { name: '<span>申请ID</span>', type: 'text', code: 'date', w: '13%', ww: '13%', n: "40" },
                "projectName": { name: '<span>用于项目</span>', type: 'text', code: 'checkid', w: '12%', ww: '12%' },
                "hospitalRequirement": { name: '<span>数据来源医院</span>', type: 'text', code: 'pid', w: '12%', ww: '12%', },
                "modalityRequirement": { name: '<span>数据类型</span>', type: 'text', code: 'pname', w: '6%', ww: '6%' },
                "bodyPart": { name: '<span>部位</span>', type: 'text', code: 'pname', w: '4%', ww: '4%' },
                "keywordsRequirement": { name: '<span>搜索关键字</span>', type: 'text', code: 'psex', w: '13%', ww: '13%' },
                "priority": { name: '<span>数据获取优先级</span>', type: 'text', code: 'age', w: '10%', ww: '10%' },
                "numRequirement": { name: '<span>所需数量</span>', type: 'text', code: 'shebei', w: '10%', ww: '10%' },
                "numGive": { name: '<span>已获取数量</span>', type: 'text', code: 'handler', w: '10%', ww: '10%', },
                "requestPerson": { name: '<span>创建人</span>', type: 'text', code: 'handler', w: '10%', ww: '10%', },
            },
            actionulwidth:200,
            minwidth:2000,
            type:'center',
            actionicon:{
                "operation": { name: '<span data-i18n="action" data-name="操作">操作</span>', type: 'action',code:'action', w: '100%', ww: '100%' }
            }
        }
        this.listicon={
            action:{//待发布
                config: { dis: 'inline', link: 'noLink',content: [{text:'编辑',key:'edit'},{text:'查看详情',key:'view'},{text:'设置优先级',key:'setpriority'},{text:'创建获取记录',key:'createcode'}] }
            }
        }
        this.apiData={page:1,pageSize:10}
    }
}
module.exports = dataapply;