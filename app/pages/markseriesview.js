//import {firstName, lastName, year} from 'http://172.16.100.221:44444/footer/footer.js';
//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class markseriesview extends MarkBase {
    constructor(app, api, dom, model) {
        super(app, api, dom, model)
        this.conclusion = ''
    }
    //接口调用，获取信息 =============================给书婷
    baseApi() {
        this.apiload()
    }
    //这里接口调用获取信息,数据批次信息 =============================给书婷
    apiload() {
        this.app.loading.show()
        this.api.series_review_task_read({ id: this.app.parpam['taskId'] }).done((value) => {
            this.app.loading.hide()
            this.model.setData('projectInfo', value.data)
            this.conclusion = value.data.conclusion
            this.suitable = '' + value.data.suitable
            this.dom.find('.task-name span').eq(1).html('适用项目：' + value.data.title)
            this.dom.find('.dicommenu .btn').addClass('hide')
        })

    }
    seriesInfo() {
        let sid = this.model.series_result_id.studyInstanceUid
        if (this.model.seriesInfo[sid].imgs && this.model.seriesInfo[sid].info) {
            this.cornerstoneStart() //cornerstone初始化
            this.listInit()
        }
    }
    //关闭菜单功能，生成病症的选项
    annotationIteminit() {
        this.model.frompage = { id: this.app.parpam['taskId'], page: this.app.parpam['sid'], pageSize: 1 }
        // //这个接口获取序列列表，上面的uid应该是可以不用的，然后sid代表的是第几页 =============================给书婷
        this.app.loading.show()
        this.api.series_review_task_series_search(this.model.frompage).done((value) => {
            this.app.loading.hide()
            if (value.data.list.length != 0) {
                this.series_get(value.data.list[0])
                this.totalseries = value.data.total
                this.dom.find('.shownum .total').html(this.totalseries)
                this.dom.find('.shownum .now').html(this.app.parpam['sid'])
            } else {
                //当拿不到序列数据的时候自动帮忙跳回去原来的页面，下面的链接需要改
                window.location.href =  window.location.origin + '/#!/cleardata/' + this.app.parpam['taskId']
                //this.app.changePage('ytjtaskdetail', { taskid: this.app.parpam['taskId'] })
            }
        })
    }
    //获取需要标注的序列
    series_get(sid) {
        if (this.cornerstoneContorl) {
            this.cornerstoneContorl.close()
        }
        if (this.dicommenu) {
            this.dicommenu.resetAll()
        }
        //let temp1={seriesInstanceUid:sid}
        console.log(sid)
        let temp = { studyInstanceUid: sid, seriesInstanceUids: [{ seriesAnnotationResultId: 30, seriesInstanceUid: sid }] }
        if (!this.model.taskInfo.studyAnno) {
            temp.studyInstanceUid = temp.seriesInstanceUids[0].seriesInstanceUid
        }
        this.model.setData('series_result_id', temp)
        this.model.seriesResult[30] = {
            data: {
                "auditId": null,
                "annotationItemResultList": [],
                "seriesInstanceUid": sid,
                "submitTime": null,
                "imageAnnotationResultList": [],
                "id": sid,
                "algVersionId": null,
                "userId": "",
                "projectId": 1,
                "taskId": 1,
                "status": 1
            }
        }
        this.model.setData('seriesResult', this.model.seriesResult)
        //这里的接口应该需要 =============================给书婷
        // this.api.series_result_search({
        //     type: 'TASK',
        //     id: this.app.parpam['taskId'],
        //     seriesInstanceUid: sid, // this.app.parpam['sid'],
        //     userId: this.app.parpam['uid']
        // }).done((value) => {
        //console.log(value.data,'==============')
        //这里显示当前是第几个和总计多少个 =============================给书婷
        // if (value.data.list[0].discardCode) {
        //     let str = ''
        //     str += value.data.list[0].discardReason ? value.data.list[0].discardReason : ""
        //     this.dom.find('.discard_info').html('<span>100/1000</span>')
        // }
        // if (value.data.list.length != 0) {
        //     let temp = { seriesAnnotationResultId: value.data.list[0].id, seriesInstanceUid: value.data.list[0].seriesInstanceUid }
        //     this.model.setData('series_result_id', temp)
        // } else {
        //     this.dom.find('.back-icon').click()
        // }
        // })
    }
    //这里的接口应该需要,只是会变换 =============================给书婷
    //标注基础信息准备完成，进入这一轮标注的起始点
    result_get_fromback() {
        //console.log()
        // this.api.series_result_read({ id: this.model.series_result_id.seriesAnnotationResultId }).done((value) => {
        //     this.model.setData('seriesResult', value)
        // })

    }
    //************************标注相关*************************
    //影像区加载
    cornerstoneContorlOther() {
        let that = this

        //对于图片上面的影像标注操作
        this.cornerstoneContorl.event._addEvent('ctcornerstone.addNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNode', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.deleteNode', function(value) {})
        //获取整个序列的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.Allthing', function(value) {
            //这里需要增加接口 =============================给书婷
        })
        //获取某一个病症的征象信息
        this.cornerstoneContorl.event._addEvent('ctcornerstone.editNodeItem', function(value) {})
        this.cornerstoneContorl.event._addEvent('ctcornerstone.brushfirstload', function(value) {})
    }
    //************************弹框区*************************
    //弹窗加载
    modalLoad() {
        let progressClass = require("../modal/progress/progress.js")
        this.progress = this.app.loadModal(progressClass, { adv: true })
        this.progress.hide()
    }
    discaseToDone(value, dom) {
        this.api.series_discard({
            projectId: this.app.parpam.projectId,
            seriesInstanceUid: this.model.seriesInfo.info.data.seriesInstanceUID,
            discardReason: value
        }).done((value) => {
            this.series_submit()
            //this.submitSeries()
            if (dom) {
                dom.close()
            }
        })
    }
    //************************弹框区*************************
    //提交整个序列事件
    btnEvent() {
        let that = this;
        //这里的返回信息需要增加 =============================给书婷
        this.dom.find('.back-icon').on('click', () => {
            if (this.app.parpam['type'] != "viewer") {
                window.location.href =  window.location.origin + '/#!/cleardata/' + this.app.parpam['taskId']
                window.location.reload()
                // this.app.changePage('ytjtaskdetail', { taskid: this.app.parpam['taskId'] })
                return
            } else {
                window.location.href =  window.location.origin + '/#!/cleardata/' + this.app.parpam['taskId'] + '/' + this.app.parpam['rid']
                window.location.reload()
                //this.app.changePage('taskdetail', { taskId: this.app.parpam['taskId'], type: this.app.parpam['rid'] })
                return
            }
        })
        this.dom.find('.cotrol-btn .btn-up').on('click', () => {
            if (this.app.parpam['sid'] * 1 == 1) {
                this.alerError('对不起前面没有序列了！')
                return
            }
            window.location.href =  window.location.origin + '/#!/markseriesview/' + this.app.parpam['taskId'] + '/view' + '/' + (this.app.parpam['sid'] * 1 - 1)
            window.location.reload()
        })
        this.dom.find('.jumpto').on('keydown', function() {
            if (event.keyCode === 13) {
                let temp = parseInt(ES.selctorDoc(this).val());
                if (temp < 1 || temp > that.totalseries || isNaN(temp)) {
                    that.alerError('没有该序列')
                    return
                }
                window.location.href =  window.location.origin + '/#!/markseriesview/' + that.app.parpam['taskId'] + '/view' + '/' + temp
                window.location.reload()
            }
        })
        this.dom.find('.cotrol-btn .btn-next').on('click', () => {
            console.log(that.totalseries, this.app.parpam['sid'] * 1)
            if (this.app.parpam['sid'] * 1 == this.totalseries) {
                this.alerError('对不起后面没有序列了！')
                return
            }
            window.location.href =  window.location.origin + '/#!/markseriesview/' + this.app.parpam['taskId'] + '/view' + '/' + (this.app.parpam['sid'] * 1 + 1)
            window.location.reload()
        })
        this.dom.find('.cotrol-btn .btn-allse').on('click', () => {
            let formsubmit = require("../modal/formsubmit/formsubmit")
            let config = [{ name: 'conclusion', type: 'input', title: '提交批次结论', value: that.conclusion, check: 'empty', remark: '本批次是否适合该项目可以在此填写' },
                { name: 'suitable', type: 'dropdown', title: '是否适合项目', value: that.suitable == true ? '1' : '0', 'check': 'empty', remark: '', data: [{ val: '是', idx: '1' }, { val: '否', idx: '0' }] }
            ]
            let editconclusion = this.app.loadModal(formsubmit, { adv: true }, { title: '批次结论', config: config })
            editconclusion.event._addEvent('formsubmit.submit', function(value) {
                let json = {
                    id: that.app.parpam['taskId'],
                    goal: that.model.projectInfo.goal,
                    title: that.model.projectInfo.title,
                    conclusion: value.conclusion,
                    suitable: value.suitable == 1 ? true : false
                }
                that.app.loading.show()
                that.api.series_review_task_update(json).done(function(res) {
                    that.app.loading.hide()
                    if (res.code == 0) {
                        editconclusion.close()
                        that.app.changePage('cleardata')
                    }
                })
            })
        })

    }
}
module.exports = markseriesview;
