require('./uploadcatelog.less')
// var html = require('./tpl.html')

class uploadcatelog extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'uploadcatelog'
        this.flag = true;
        this.code=''
        this.data=value;
    }
    complete() {
        let that = this
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.dom.find('.cancel').on('click',function () {
            that.close();
        })
        this.dom.find('.upload').on('click',function () {
            that.dom.find('.inputLine').dom.forEach(function(val, idx) {
                val.find('.'+val.attr('redlabel')).removeClass('redborder')
                val.find('.required').remove();
                if(Tool.checkForm(ES.selctorDoc(val).dom,'red')!==''){
                    val.find('.'+val.attr('redlabel')).addClass('redborder')
                    val.find('.'+val.attr('redlabel')).after('<span class="required">'+Tool.checkForm(ES.selctorDoc(val).dom,'red')+'</span>')
                }
            })
            if(that.dom.find('.redborder').dom){
                return false
            }else{
                let json={
                    localPath:that.dom.find('.catelogname').val(),
                    hospitalCode:that.dom.find('.ssyy .nowname').attr('data-idx'),
                    bodyPart:that.dom.find('.bwxz .nowname').attr('data-idx'),
                    importType:that.dom.find('.importType .nowname').attr('data-idx'),
                    keyword:that.dom.find('.keyword').val()
                }
                if(that.data.type=='OTHER'||that.data.type=='PATHOLOGY'){
                    json.modality=that.dom.find('.modality .nowname').attr('data-idx')
                }
                that.event._dispatch('uploadcatelog.upload',{data:json})
            }
        })
        console.log(this.data,'this.data')
        this.render(this.data.type)
    }
    render(value){
        let that = this
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            that.yymc=that.app.loadModule(dropdown,that.dom.find('.ssyy'),{
                className: 'xlk',
                firstSelect: {
                    val: '请选择所属医院',
                    idx: ''
                },
                input:true,
                data: that.data.hospital,
                maxshownum:5
            })
            that.yymc.event._addEvent('drop.input', function(value) {
                // that.apidata['hospitalCode']=value.data
                setTimeout(function() {
                    that.event._dispatch('hospital.input',value.data)
                }, 1500)
            })
            that.yymc.event._addEvent('dropDown.clear', function(value) {
                that.event._dispatch('hospital.input','')
            })
            that.bwxz=that.app.loadModule(dropdown,that.dom.find('.bwxz'),{
                className: 'xlk',
                firstSelect: {
                    val: '部位选择',
                    idx: ''
                },
                data: that.data.body,
                maxshownum:5
            })
            that.importType=that.app.loadModule(dropdown,that.dom.find('.importType'),{
                className: 'xlk',
                firstSelect: {
                    val: '导入类型',
                    idx: ''
                },
                data: [{val:'JPG_SERIES',idx:'JPG_SERIES'},{val:'JPG_FOLDER',idx:'JPG_FOLDER'},{val:'DICOM',idx:'DICOM'}],
            })
            if(value=='OTHER'||value=='PATHOLOGY'){
                that.modality=that.app.loadModule(dropdown,that.dom.find('.modality'),{
                    className: 'xlk',
                    firstSelect: {
                        val: '检查设备',
                        idx: ''
                    },
                    datatype:'obj',
                    data: that.data.modality
                })
            }
            if(that.data.type=='OTHER'){
                that.bwxz.renderHtml([{val:'眼底',idx:'EYEGROUND'}])
                that.modality.renderHtml([{val:'眼底相机',idx:'EFC'}])
            }
            if(that.data.type=='PATHOLOGY'){
                that.modality.renderHtml([{val:'病理',idx:'PATHOLOGY'},{val:'HE染色',idx:'HES'},{val:'特殊染色',idx:'SS'},{val:'免疫组化',idx:'IC'},{val:'分子检测',idx:'MD'},{val:'冰冻检查',idx:'FS'}])
            }
        })
    }
    resetxlk(value){
        let that=this;
        console.log(value,'value')
        that.yymc.renderHtml(value);
    }
    initscrollmenu() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }

        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        this.dom.find('.paishuxuanze .maintable').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
            scrollbars: true,
            mouseWheel: true,
            scrollX:true,
            interactiveScrollbars: true,
            hideScrollbar: false,
            vScrollbar: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            disableMouse: true,
            disablePointer: true
        });
    }

}

//原型链一定要有的
module.exports = uploadcatelog;
