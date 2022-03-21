class imagedatagl extends Interstellar.pagesBase {
    complete() {
        let that = this;
        that.app.menu.refreshmenu()
        this.apidata = {page:1,pageSize:10,category:'RADIOLOGY'};
        this.yymcdata = []
        that.imagetype='radio'
        this.action={
            view: { dis: 'inline', link: 'noLink',content: '查看详情'}
        }
        //this.bodypart=[{idx:'LUNG',val:'肺部'},{idx:'RIB',val:'肋骨'},{idx:'KNEE_JOINT',val:'膝关节'},{idx:'COXA_JOINT',val:'髋关节'},{idx:'HAND',val:'手'},{idx:'FOOT',val:'足'},{idx:'SKULL_BRAIN',val:'颅脑'},{idx:'HEART',val:'心脏'},{val:'眼底',idx:'EYEGROUND'}]
        this.bodypart=Tool.configxlkformat(that.app.constmap['BODY_PART'])
        that.hospital=[];
        that.duoxuanobj={};
        this.render();
        this.setTitle_radio();
        this.resize();
        this.dom.find('.topchoose a').on('click',function () {
            if(!ES.selctorDoc(this).hasClass('choosed')){
                that.dom.find('.topchoose a').removeClass('choosed');
                ES.selctorDoc(this).addClass('choosed')
                if(ES.selctorDoc(this).hasClass('fsk')){
                    that.imagetype='radio'
                }else{
                    that.imagetype='other'
                }
                that.toggleimagetype()
            }
        })
        this.dom.find('.filterarea input').on('change', function() {
            if(ES.selctorDoc(this).attr('check')=='num'){
                that.apidata[ES.selctorDoc(this).attr('class')] = parseFloat(ES.selctorDoc(this).val());
            }else {
                that.apidata[ES.selctorDoc(this).attr('class')] = ES.selctorDoc(this).val();
            }
        })
        this.dom.find('.sjandjl .liinput').on('change', function() {
            that.resetjctj();
        })
        this.dom.find('.exportlink').on('click', function() {
            if(that.nodata){
                that.app.alert.show({
                    title: ' ',
                    msg: '未查询到对应数据，不支持导出！',
                    close: true
                })
            }else{
                delete that.apidata.pageSize;
                delete that.apidata.page;
                let sting1=encodeURI(JSON.stringify(that.apidata))
                Tool.downfile(that.app.domain+'v1/series/export?data='+sting1,that.app)
            }

        })
        this.dom.find('.searchbtn').on('click', function() {
            that.apidata.page=1;
            that.setMain(true)
        })
        this.dom.find('.icon-bianji').on('click',function () {
            let json={
                page:1,
                pageSize:10
            }
            that.app.loading.show()
            that.api.getpaishu(json).done(function (res) {
                that.app.loading.hide()
                if(res.data.list.length==0||res.data.list==null){
                    that.app.alert.show({
                        title: ' ',
                        msg: '无机器型号需要补充排数！',
                        close: true
                    })
                }else{
                    let psbc=require("../modal/paishuxuanze/paishuxuanze")
                    that.pslist=that.app.loadModal(psbc,{adv:true},res.data)
                    that.pslist.event._addEvent('paishuxuanze.save',function (val) {
                        let json1={
                            model:val.id,
                            row:val.val
                        }
                        that.app.loading.show()
                        that.api.updatepaishu(json1).done(function (res) {
                            that.app.loading.hide()
                            if(res.code==0){
                                that.getpaishu({
                                    page:1,
                                    pageSize:10
                                },true)
                            }else{
                                alert('补充失败')
                            }
                        })
                    })
                    that.pslist.event._addEvent('paishuxuanze.pagenumber',function (val) {
                        that.getpaishu({
                            page:val.page,
                            pageSize:10
                        },false)
                    })
                    that.pslist.event._addEvent('paishuxuanze.pagesize',function (val) {
                        that.getpaishu({
                            page:1,
                            pageSize:val.pagesize
                        },true)
                    })
                }
            })

        })
    }
    toggleimagetype(){
        let that=this;
        for(let i in that.duoxuanobj){
            that.duoxuanobj[i].reset()
        }
        for(let i in that.singleobj){
            that.singleobj[i].reset()
        }
        that.apidata={page:1,pageSize:10}
        that.dom.find('.showData .Timers').html('请选择时间')
        that.dom.find('input').val('')
        if(that.imagetype=='radio'){
            //that.duoxuanobj['modality'].renderHtml([{val:'CT',idx:'CT'},{val:'CR',idx:'CR'},{val:'DX',idx:'DX'}])
            that.apidata.category='RADIOLOGY'
            that.dom.find('.radioonly').removeClass('hide')
            this.setTitle_radio();
        }else{
            //that.duoxuanobj['modality'].renderHtml([{val:'眼底相机',idx:'EFC'}])
            that.apidata.category='OTHER'
            that.dom.find('.radioonly').addClass('hide')
            this.setTitle_other();
        }
    }
    getpaishu(value,value2){
        let that=this;
        that.app.loading.show()
        that.api.getpaishu(value).done(function (res) {
            that.app.loading.hide()
            if(res.code==0){
                that.pslist.setMain(value2,res.data);
            }else{
            }
        })
    }
    getxlvalue(type){
        let that=this;
        let json1={};
        json1['name']=that.apidata['key']==undefined?'':that.apidata['key']
        that.duoxuanobj[type].loading(true)
        that.api[type](json1).done(function (value) {
            that.duoxuanobj[type].loading(false)
            let temparr=[];
            value.data.list.forEach(function (val,idx) {
                if(val['name']){
                    let obj={}
                    obj.idx=val['code'];
                    obj.val=val['name'];
                    temparr.push(obj)
                }else{
                    temparr.push(val)
                }
            })
            that.duoxuanobj[type].setData(temparr)
        })
    }
    render() {
        let that = this;
        let duoxuanconfig = [{
            name: 'hospitalCode',
            showname: '医院名称',
            datatype:'obj',
            input:true,
            data: that.hospital,
            key:'name'
        }, {
            name: 'bodyPart',
            showname: '部位',
            datatype:'obj',
            data:Tool.configxlkformat(that.app.constmap['BODY_PART'])
        }, {
            name: 'modality',
            showname: '检查设备',
            datatype:'obj',
            data: Tool.configxlkformat(that.app.constmap['MODALITY'])
        }, {
            name: 'fileType',
            showname: '文件类型',
            datatype:'arr',
            data: ['DCM','JPG']
        }, {
            name: 'kernelCapital',
            showname: '选择重建Kernel首字母',
            datatype:'arr',
            data: ['H','B','C','S','T','K','I']
        }, {
            name: 'row',
            showname: '排数选择',
            datatype:'arr',
            data: [16,32,64,128,256]
        }]
        let andor = [{ val: '并且', idx: 'AND' }, { val: '或者', idx: 'OR' }]
        let contains = [{ val: '包含', idx: 'CONTAIN' }, { val: '不包含', idx: 'NOT_CONTAIN' }]
        let firstselect = { val: '请选择', idx: '' }
        let singleconfig=[{
            name: 'patientSex',
            showname: '性别',
            data: [{val: '男', idx: 'M'}, {val: '女', idx: 'F'}]
        },{
            name: 'patientAgeType',
            showname: '年龄范围',
            data: [{val: '岁', idx: 'year'}, {val: '月', idx: 'month'}]
        },{
            name: 'isValid',
            showname: '序列是否有效',
            data: [{val: '是', idx: 1}, {val: '否', idx: 0}]
        },{
            name: 'jpgValid',
            showname: 'JPG化是否成功',
            data: [{val: '是', idx: 1}, {val: '否', idx: 0}]
        }]
        that.singleobj={}
        require.ensure("../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../moduleslibs/dropdown1/drop.js")
            singleconfig.forEach(function (val,idx) {
                that.singleobj[val.name]=that.app.loadModule(dropdown, that.dom.find('.'+val.name), {
                    className:'xlk',
                    firstSelect:{val:val.showname,idx:''},
                    data:val.data
                })
                that.singleobj[val.name].event._addEvent('option.click', function(value) {
                    that.apidata[val.name] = value.idx
                })
                that.singleobj[val.name].event._addEvent('dropDown.clear', function(value) {
                    that.apidata[val.name] = ''
                })
            })
            that.apidata.patientAgeType='year'
            that.singleobj['patientAgeType'].event._addEvent('dropDown.clear', function(value) {
                that.apidata.patientAgeType = 'year';
            })
            that.singleobj['isValid'].event._addEvent('option.click', function(value) {
                that.apidata.valid = value.idx==1?true:false;
            })
            that.dom.find('.isValid .option[data-idx="1"]').click()
            that.singleobj['isValid'].event._addEvent('dropDown.clear', function(value) {
                that.apidata.valid = '';
            })
            that.singleobj['jpgValid'].event._addEvent('option.click', function(value) {
                that.apidata.jpgValid = value.idx==1?true:false;
            })
            that.singleobj['jpgValid'].event._addEvent('dropDown.clear', function(value) {
                that.apidata.jpgValid = '';
            })
            let name = [];
            let inputs = []
            that.dom.find('.bhxlk').dom.forEach(function(val, idx) {
                let obj = {};
                inputs[idx] = that.app.loadModule(dropdown, val, {
                    className: 'xlk bh' + idx,
                    data: contains
                })
                inputs[idx].event._addEvent('option.click', function(value) {
                    name.push(value)
                    that.resetjctj();
                })
                inputs[idx].event._addEvent('dropDown.clear', function() {
                    name.push('')
                    that.resetjctj();
                })
                that.resetjctj();
            })
            that.dom.find('.andor').dom.forEach(function(val, idx) {
                let obj = {};
                inputs[idx] = that.app.loadModule(dropdown, val, {
                    className: 'xlk andor' + idx,
                    data: andor
                })
                inputs[idx].event._addEvent('option.click', function(value) {
                    name.push(value)
                    that.resetjctj();
                })
                inputs[idx].event._addEvent('dropDown.clear', function(value) {
                    name.push('')
                    that.resetjctj();
                })
                that.resetjctj();
            })
        })
        require.ensure("../moduleslibs/duoxuanxlk/duoxuanxlk.js", function() {
            let dropdown = require("../moduleslibs/duoxuanxlk/duoxuanxlk.js")
            duoxuanconfig.forEach(function(val, idx) {
                let myname = that.string_to_name(val.name)
                console.log(myname, 'myname')
                myname = that.app.loadModule(dropdown, that.dom.find('.' + val.name), {
                    showname: val.showname,
                    data: val.data,
                    datatype:val.datatype,
                    input:val.input
                })
                myname.event._addEvent('duoxuan.select', function(value) {
                    that.apidata[val.name] = value.name
                    console.log(that.apidata, 'apidata')
                })
                myname.event._addEvent('duoxuanxlk.clear', function(value) {
                    that.apidata[val.name] = ''
                })
                that.duoxuanobj[val.name]=myname
                that.duoxuanobj['hospitalCode'].event._addEvent('duoxuanxlk.clear', function(value) {
                    that.apidata['hospitalCode'] = ''
                    that.apidata['key'] = ''
                    that.getxlvalue('hospitalCode')
                    console.log(that.apidata, 'apidata')
                })
                that.duoxuanobj['hospitalCode'].event._addEvent('duoxuan.input',function (value) {
                    that.apidata['key']=value.data
                    console.log(that.apidata)
                    setTimeout(function() {
                        console.log('heheheheda',value.data)
                        that.getxlvalue('hospitalCode')
                    }, 1500)
                })
            })
            that.getxlvalue('hospitalCode');
        })
        require.ensure('../moduleslibs/times_double/times.js', function() {
            let calendar = require('../moduleslibs/times_double/times.js')
            let todayTime = new Date()
            let Month = todayTime.getMonth() + 1 < 10 ? '0' + (todayTime.getMonth() + 1) : (todayTime.getMonth() + 1)
            let today = todayTime.getFullYear() + '-' + Month + '-' + todayTime.getDate()
            that.startTime = that.app.loadModule(calendar, that.dom.find('.timefiltercont'), { titleShow: false, defaultword: '请选择时间' })
            that.startTime.event._addEvent('times1.day', function(value) {
                console.log(value,'valuetime')
                that.apidata.studyDateBegin = value.st?value.st+" 00:00:00":''
                that.apidata.studyDateEnd = value.et?value.et+" 23:59:59":''
                console.log(that.apidata)
            })
            that.startTime.event._addEvent('times.dele', function(value) {
                if(value.dom.hasClass('day_left')){
                    that.apidata.studyDateBegin = ''
                }else{
                    that.apidata.studyDateEnd = '';
                }
            })
            that.startTime1 = that.app.loadModule(calendar, that.dom.find('.timefiltercont1'), { titleShow: false, defaultword: '请选择时间' })
            that.startTime1.event._addEvent('times1.day', function(value) {
                that.apidata.importDateBegin = value.st?value.st+" 00:00:00":''
                that.apidata.importDateEnd = value.et?value.et+" 23:59:59":''
                console.log(that.apidata)
            })
            that.startTime1.event._addEvent('times.dele', function(value) {
                if(value.dom.hasClass('day_left')){
                    that.apidata.importDateBegin = ''
                }else{
                    that.apidata.importDateEnd = '';
                }
            })
        })
    }
    setTitle_radio() {
        let obj = {}
        let that = this;
        obj=that.model.radiotable
        obj.tablewidth=ES.selctorDoc('.imagedatagl').box().clientWidth-140;
        that.tableevent(obj)
    }
    setTitle_other() {
        let obj = {}
        let that = this;
        obj= that.model.othertable
        obj.tablewidth=ES.selctorDoc('.imagedatagl').box().clientWidth-140;
        that.tableevent(obj)
    }
    tableevent(obj){
        let that=this
        require.ensure("../moduleslibs/table_group/table_group", function() {
            that.myScroll=null;
            that.myScroll1=null;
            let cont_table = require("../moduleslibs/table_group/table_group")
            that.table = that.app.loadModule(cont_table, that.dom.find('.datatable'), {
                id: 'datatable',
                header: obj
            });
            that.table.event._addEvent('table.pagenumber', function(value) {
                that.apidata.page = parseInt(value);
                that.table.changenum(that.apidata.page);
                that.setMain();
            });
            that.table.event._addEvent('table.pagesize', function(value) {
                that.apidata.pageSize=value.num;
                that.apidata.page=1;
                that.setMain(true);
            });
            that.table.event._addEvent('table.action', function(value) {
                let url1 = window.location.href;
                let url = url1.split('#')[0] + '#!/seriesdetail/' + value.id;
                let link = document.createElement('a');
                link.target = "_blank";
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
               //that.app.changePage('seriesdetail',{seriesId:value.id})
            });
            that.dom.find('.list-content').removeClass('hide');
            that.initscroll();
            that.inittable();
            that.setMain(true);
        })
    }
    setMain(value) {
        let that=this;
        let data2=[]
        that.table.showloading()
        that.api.queryseries(that.apidata).done(function (res) {
            if(res.code==0){
                if(res.data.list.length>0){
                    that.nodata=false;
                    res.data.list.forEach(function (val,idx) {
                        for(let i in val){
                            val[i]=val[i]==null?'':val[i]
                        }
                        val.finding=val.finding==null?'':val.finding;
                        val.conclusion=val.conclusion==null?'':val.conclusion;
                        val.modality=val.modality=='EFC'?'眼底相机':val.modality;
                        val.valid=val.valid?'是':'否';
                        switch (val.patientSex){
                            case 'M':
                                val.patientSex='男';
                                break;
                            case 'F':
                                val.patientSex='女'
                                break;
                            default:
                                val.patientSex=''
                        }
                        that.bodypart.forEach(function (a,b) {
                            if(a.idx==val.bodyPart){
                                val.bodyPart=a.val;
                            }
                        })
                        let obj={}
                        obj.id=val.seriesInstanceUID;
                        obj.operation=that.action
                        data2.push(obj)
                    })
                    that.table.setData(res.data.list,data2);
                    if(value){
                        that.table.getTotal(res.data.pages,7,res.data.total)
                    }
                }else{
                    that.table.noData();
                    that.nodata=true;
                }
                that.initscroll();
            }else{
                that.table.noData();
            }
        })
    }
    resetjctj() {
        let that = this;
        that.apidata.conditions = [];
        let obj1 = {
            join: ''
        }
        obj1.items = [];
        that.dom.find('.sj .sjli').dom.forEach(function(val, idx) {
            obj1.items.push(that.bianlili(val,'finding'))
        })
        that.apidata.conditions.push(obj1)
        let obj2 = {
            join: that.dom.find('.middle .nowname').attr('data-idx')
        }
        obj2.items = [];
        that.dom.find('.jl .jlli').dom.forEach(function(val, idx) {
            obj2.items.push(that.bianlili(val,'conclusion'))
        })
        that.apidata.conditions.push(obj2);
    }
    bianlili(val,value) {
        let that = this;
        let tempobj = {}
        if (val.find('.andor').dom) {
            tempobj.join = val.find('.andor .nowname').attr('data-idx')
        } else {
            tempobj.join = ''
        }
        tempobj['key'] = value
        tempobj.value = val.find('.liinput').val()
        tempobj.operator = val.find('.bhxlk .nowname').attr('data-idx')
        return tempobj;
    }
    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.imagedatagl').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
    }
    inittable() {
        if (this.myScroll1) {
            this.myScroll1.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        ES.selctorDoc('.maintable').attr('id', rid)
        this.myScroll1 = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            scrollX: true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
    }
    resize() {
        let ch = ES.selctorDoc(window).box().clientHeight
        let cw = ES.selctorDoc(window).box().clientWidth - 240
        ES.selctorDoc('.imagedatagl').css({ 'height': ch - 100,'width':cw });
        ES.selctorDoc('.datatable').css({ 'width': cw });
    }
    string_to_name(string) {
        let _name = 'var ' + string;
        eval(_name);
        return _name;
    }

}
module.exports = imagedatagl;
