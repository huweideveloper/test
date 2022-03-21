require('./uploadcleardata.less')
// var html = require('./tpl.html')

class uploadcleardata extends Interstellar.modalBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name = 'uploadcleardata'
        this.flag = true;
        this.code=''
        this.data=value;
    }
    complete() {
        let that = this
        if(that.api.type=='edit'){
            that.dom.find('.title').val(that.api.data.title)
            that.dom.find('.remark').val(that.api.data.goal)
            that.dom.find('.toparea .title').html('编辑清洗数据任务')
        }
        this.dom.find('.icon-guanbi').on('click',function () {
            that.close();
        })
        this.dom.find('.cancel').on('click',function () {
            that.close();
        })
        this.dom.find('.choosefile').on('click',function () {
            that.dom.find('.file').click();
        })
        that.dom.find('.file').on('change',function () {
            console.log(ES.selctorDoc(this).val())
            that.dom.find('.catelogname').val(ES.selctorDoc(this).val())
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
                    title:that.dom.find('.title').val(),
                    goal:that.dom.find('.remark').val()
                }
                that.event._dispatch('uploadcleardata.upload',{data:json})
            }
        })

    }
    uploadfile(value){
        let that=this;
        let filePath = ES.selctorDoc("#file").val();
        let fileType = that.getFileType(filePath);
        console.log(value)
        if ("csv" != fileType) {
            ES.selctorDoc("#choosefile").val("");
            that.app.alert.show({
                title: '',
                template: '<span style="font-size: 18px;margin-left:20px;">格式错误，上传失败。</span>',
                close: false,
                sure: function() {
                    that.app.alert.hide();
                    that.dom.find('.file').remove();
                    that.dom.find('.imagedata').append('<input class="file" type="file" id="file" name="file"/>')
                    that.binduploadevent();
                }
            })
        }else {
            $.ajaxFileUpload({
                url: that.app.domain+'v1/series_review_task/import',
                secureuri: false,
                dataType: "JSON",
                timeout: 60000,
                async: false,
                data: {
                    id: value,
                    accessToken:window.localStorage.accessToken
                },
                type: 'post',
                fileElementId: 'file',
                success: function (data, status, e) {
                    console.log(data, 'data', status, e)
                    console.log(data.match(/{.+}/g))
                    let jsonArr = JSON.parse(data.match(/{.+}/g)[0])
                    if (jsonArr.code == 0) {
                        console.log('success')
                        that.close();
                        that.event._dispatch('uploadcleardata.uploadsuccess')
                    } else {
                        that.app.alert.show({
                            title: '',
                            template: '<span style="font-size: 18px;margin-left:20px;">上传失败</span>',
                            sure: false,
                            close: true,
                            footer: true
                        })
                    }
                    that.dom.find('.file').remove();
                    that.dom.find('.imagedata').append('<input class="file" type="file" id="file" name="file"/>')
                    that.binduploadevent();
                    that.getseries();
                }
            });
        }
    }
    getFileType(filePath) {
        var startIndex = filePath.lastIndexOf(".");
        if (startIndex != -1)
            return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
        else return "";
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
module.exports = uploadcleardata;
