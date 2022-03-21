require("./audituser.less");
class audituser extends Interstellar.modalBase {

    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html')
        this.name='audituser';
        this.data1 = []   //  科室信息
        this.data2 = []   //  小组信息
    }

    //var endData = []
    complete() {
        let that=this;
        that.initscroll();
        this.initView();
        require.ensure("../../moduleslibs/dropdown1/drop.js", function() {
            let dropdown = require("../../moduleslibs/dropdown1/drop.js")
            let patientSex = that.app.loadModule(dropdown, that.dom.find('.jzdw'), {
                className:'xlk',
                firstSelect: { val: 'all', idx: '' },
                data: [{ val: 'all', idx: '' },{ val: 'all', idx: 'M' }, { val: 'all', idx: 'F' }]
            })
            let department = that.app.loadModule(dropdown, that.dom.find('.zj'), {
                className:'xlk',
                firstSelect: { val: '112', idx: ''},
                data: [{ val: 'all', idx: '' },{ val: 'all', idx: 'M' }, { val: 'all', idx: 'F' }]
            })

            //that.groupInfo(that.app.selectedOrg.id)
            let usergroup = that.app.loadModule(dropdown, that.dom.find('.userstatus'), {
                className:'xlk',
                firstSelect: { val: 'all', idx: '' },
                data: [{ val: 'all', idx: '' },{ val: 'all', idx: 'M' }, { val: 'all', idx: 'F' }]
            })
            patientSex.event._addEvent('option.click', function (value) {
                if (value.idx) {
                    that.clear('.sex')
                }
            })
            that.dom.find(".icon").attr('src','/images/page/login_down.png')
            that.dom.find('.pass').on('click',function () {
                that.app.alert.show({
                    title: ' ',
                    msg: '确认审核通过？',
                    close: true,
                    sure: function() {
                        that.submitFinish(data)
                    }
                })
            })
            that.dom.find('.refuse').on('click',function () {
                let refusemodal=require("../../modal/refusereason/refusereason.js")
                that.app.loadModal(refusemodal,{adv:true})
            })
            // //通过父亲结点遍历儿子结点
            department.event._addEvent('option.click', function(value) {
                // let dep=value.idx;
                // console.log(value,'value',menudata1[dep])
                // if(menudata1[dep]){
                //     data2=[{ val: all, idx: '' }]
                //     menudata1[dep].forEach( function(val1, i) {
                //         let obj={};
                //         obj.val=val1.name;
                //         obj.idx=val1.id;
                //         data2.push(obj)
                //     })
                // }else{
                //     data2=[{ val: all, idx: '' }]
                // }
                that.groupInfo(value.idx)
                usergroup.render({
                    firstSelect: { val: all, idx: '' },
                    data: that.data2
                })

            })
        })
    }
    initView () {
        let that=this;
        this.dom.find('.btn-confirm').on('click', function() {
            let bool=true;
            that.dom.find('.verify-hint').remove();
            that.dom.find('.inputLine').dom.forEach(function (val,idx) {
                Tool.checkForm(ES.selctorDoc(val).dom)
            })

            if (!that.dom.find('.choosed').dom && !that.dom.find('.function .verify-hint').dom) {
                that.dom.find('.function').append('<span class="verify-hint">'+that.app.languageMode.getTranslate(that.app.language, 'addUser', 'qxzqx')+'</span>')
            }else if(!reg.test(that.dom.find('.password').val())&&!that.dom.find('.verify-hint').dom){
                that.dom.find('.confirmpas').parent().append('<span class="verify-hint">'+that.app.languageMode.getTranslate(that.app.language, 'addUser', 'mmgz')+'</span>')
            }else if(that.dom.find('.password').val()!==that.dom.find('.confirmpas').val()&&!that.dom.find('.verify-hint').dom){
                that.dom.find('.confirmpas').parent().append('<span class="verify-hint">'+that.app.languageMode.getTranslate(that.app.language, 'addUser', 'lcbyz')+'</span>')
            }else if(!that.dom.find('.verify-hint').dom){
                var code=that.dom.find('.code').val();
                var name=that.dom.find('.name').val();
                var sex=that.dom.find('.sex .selected1').find('span').attr('data-idx');
                var mobile=that.dom.find('.mobile').val();
                var groupId=that.dom.find('.depart .selected1').find('span').attr('data-idx');
                if(that.dom.find('.groupId .selected1').find('span').attr('data-idx')!==''){
                    groupId=that.dom.find('.groupId .selected1').find('span').attr('data-idx');
                }
                var title=that.dom.find('.title .selected1').find('span').attr('data-idx');
                var password=that.dom.find('.password').val();
                var role=that.dom.find('.choosed').parent().attr("id");
                var data = {}
                data.code =code;
                data.name =name;
                data.sex =sex;
                data.mobile =mobile;
                data.groupId =groupId;
                data.title =title;
                data.password =password;
                data.role=role;
                that.event._dispatch('addUser.info', data)
            }
        })
        this.dom.find('.icon-guanbi').on('click', function() {
            that.close()
        })
        this.dom.find('.btn-cancel').on('click', function() {
            that.close()
        })
        that.dom.find('.function i').on('click',function () {
            ES.selctorDoc('.function i').removeClass('choosed')
            that.dom.find('.function').find('.verify-hint').remove()
            if(ES.selctorDoc(this).hasClass('choosed')){
                ES.selctorDoc(this).removeClass('choosed')
            }else{
                ES.selctorDoc(this).addClass('choosed')
            }
        })

        this.dom.find('.inputBox[check]').on('blur', function(){
            if(ES.selctorDoc(this).val().trim()){
                ES.selctorDoc(this).parent().find('.verify-hint').remove()
            }
        })
    }

    clear(className){    //   当下拉框选择后，清除红字提示
        this.dom.find(className).parent().find('.verify-hint').remove()
    }
    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        ES.selctorDoc('.audituser .modal-body').attr('id', rid)
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

}
//原型链一定要有的
module.exports = audituser;