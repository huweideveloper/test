class getdatamanage extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.sddjkas={}

        this.condition =[
            [{ "type": "texts", "name": "projectName", "showname": "所属项目", "datatype": "obj", "key": "name", "out": true }],
            [{ "type": "dropdown", "name": "bodyPart", "showname": "请选择部位", "datatype": "obj", "data": Tool.configxlkformat(app.constmap['BODY_PART']), "key": "bodyPart", "out": true }],
            [{ "type": "dropdown", "name": "status", "showname": "状态", "datatype": "obj", "data": [{val:'数据已获取',idx:'0'},{val:'数据已交付',idx:'1'},{val:'数据已上传',idx:'2'},{val:'数据已入库',idx:'3'}], "key": "status", "out": true }],
            [{ "type": "texts", "name": "keywords", "showname": "搜索关键字", "datatype": "obj", "key": "keyword", "out": true }],
            [{ "type": "dropdown", "name": "modality", "showname": "请选择检查设备", "datatype": "obj", "data": Tool.configxlkformat(app.constmap.MODALITY), "key": "modality", "out": true }],
        ]
        this.tableconfig = {
            icon: {
                "requestId": { name: '<span>申请ID</span>', type: 'text', code: 'date', w: '10%', ww: '10%', n: "40" },
                "projectName": { name: '<span>用于项目</span>', type: 'text', code: 'checkid', w: '10%', ww: '10%' },
                "hospitalCode": { name: '<span>来源医院</span>', type: 'text', code: 'pid', w: '10%', ww: '10%', },
                "modality": { name: '<span>检查设备</span>', type: 'text', code: 'pid', w: '6%', ww: '6%', },
                "bodyPart": { name: '<span>部位</span>', type: 'text', code: 'pname', w: '4%', ww: '4%' },
                "keywords": { name: '<span>实际搜索关键字</span>', type: 'text', code: 'pname', w: '10%', ww: '10%' },
                "capacity": { name: '<span>数据拷贝总量</span>', type: 'text', code: 'psex', w: '10%', ww: '10%' },
                "status": { name: '<span>状态</span>', type: 'text', code: 'age', w: '10%', ww: '10%' },
                "copyTime": { name: '<span>拷贝时间</span>', type: 'text', code: 'shebei', w: '10%', ww: '10%' },
                "createBy": { name: '<span>创建人</span>', type: 'text', code: 'handler', w: '10%', ww: '10%', },
                "taskId": { name: '<span>入库任务编号</span>', type: 'link', code: 'handler', w: '10%', ww: '10%', },
            },
            actionicon: {
                "operation": { name: '<span>操作</span>', type: 'action', code: 'action', w: '100%', ww: '100%' }
            },
            actionulwidth:200,
            minwidth:2000,
            type: 'center',
        }
        this.listicon={
            action:{
                config: { dis: 'inline', link: 'noLink',content: [{text:'编辑',key:'edit'},{text:'查看详情',key:'view'},{text:'确认收到数据',key:'confirm'}] }
            },
            action1:{
                config: { dis: 'inline', link: 'noLink',content: [{text:'查看详情',key:'view'},{text:'完成上传',key:'upload'}] }
            },
            action2:{
                config: { dis: 'inline', link: 'noLink',content: [{text:'查看详情',key:'view'},{text:'完成入库',key:'done'}] }
            },
            action3:{
                config: { dis: 'inline', link: 'noLink',content: [{text:'查看详情',key:'view'}] }
            }
        }
        this.apiData={page:1,pageSize:10}
    }

    setdjak(value){

    }

}
module.exports = getdatamanage;
