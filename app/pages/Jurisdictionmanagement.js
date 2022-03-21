class Jurisdictionmanagement extends DataBase {
    complete() {
        let that = this;
        this.resize()
        this.model.tableconfig.tablewidth = ES.selctorDoc('.Jurisdictionmanagement').box().clientWidth - 320
        this.pageResourceList = []
        this.tablelist = []
        that.menu = null
        that.resource()
        this.dom.find('.searchCont').on('blur', function() {
            ES.selctorDoc(this).attr('placeholder', '搜索')
            let value = ES.selctorDoc(this).val();
            that.model.apiData.name = value
            that.menuquery()
        })
        require.ensure('../moduleslibs/Jurisdictionmenutree/Jurisdictionmenutree', function() {
            that.menu = require('../moduleslibs/Jurisdictionmenutree/Jurisdictionmenutree.js')
            that.menuquery()
        })
        this.checklist = require('../modal/checkList/checkList')
    }

    //查询全部成员/管理员小组成员
    async menuquery() {
        let that = this
        this.app.loading.show()
        let res = await this.api.query(this.model.apiData)
        this.app.loading.hide()
        if (res.code == 0) {
            // that.tablelist = JSON.parse(JSON.stringify(res.data.permissionPoList))
          that.tablelist = res.data.permissionPoList
            if (res.data.permissionPoList.length > 0) {
                let obj = {}
                let objpage = {}
                let newmenuList = []
                res.data.permissionPoList.map((val) => {
                    obj = {
                        pid: val.id,
                        name: val.name
                    }
                    newmenuList.push(obj)
                })
                objpage.root = newmenuList
                this.loadmenu(objpage)
            }
        }
        // console.log(that.tablelist,'ddd')
    }

    //所有资源
    async resource() {
        let res = await this.api.resourceall()
        if (res.code == 0) {
            this.resouAll = res.data.pageResourceList
        }
    }

    //单条
    async search(value) {
        let that = this;
        this.tablecont.showloading()
            // console.log(that.tablelist,'ccc')
        console.log(this.tablelist, this.searchList)
        this.tablelist.map(item => {
            if (item.id == value.id) {
                this.searchList = item.pageResourceList
                let arr = []
                if (this.searchList.length > 0) {
                    this.searchList.map((val) => {
                        if (val.parentId == '0') {
                            arr.push(val)
                            val.content = ''
                            val.childs = []
                        } else {
                            arr.map(ic => {
                                if (ic.id == val.parentId) {
                                    ic.content = ic.content ? (ic.content + ',' + val.name) : val.name
                                    ic.childs.push(val)
                                }
                            })
                        }
                    })
                    this.tablecont.setData(arr)
                } else {
                    this.dom.find('.maintable  .dataNone').removeClass('hide')
                    this.dom.find('.maintable  .load').addClass('hide')
                    this.dom.find('.dataNone').html('暂无内容')
                }
                this.dom.find('.pageset').addClass('hide')
                this.dom.find('.pagination ').addClass('hide')
                this.dom.find('.dataNone').html('暂无内容')
            }
        })
    }

    loadmenu(val) {
        let that = this;
        that.menu1 = that.app.loadModule(that.menu, that.dom.find('.jurmenu'), this.resouAll)
        that.menu1.event._addEvent('menutree.creat', function(value) {
            that.checklist1 = that.app.loadModal(that.checklist, {
                adv: true
            }, {
                list: that.resouAll,
                type: 'add'
            })
            that.showlistmoudal(value)
        })
        that.menu1.event._addEvent('menutree.edit', function(value) {
            that.checklist1 = that.app.loadModal(that.checklist, {
                adv: true
            }, {
                list: that.resouAll,
                type: 'edit',
                list1: that.perList,
                name: value.name
            })
            that.showlistmoudal(value)
        })
        that.menu1.event._addEvent('navFirst.choosed', function(value) {
            that.loadproissonlist('group', '', value)
            that.dom.find('.top_right').html(value.name)
            that.read(value.id)

            that.perList = []
        })
        that.menu1.event._addEvent('menutree.confirm', function(value) {
            that.deletepermisstion({
                id: Number(value)
            })
        })
        that.menu1.changeMenu(val)
    }
    showlistmoudal(val) {
        let that = this;
        that.checklist1.event._addEvent('checkList.info', function(value) {
            that.volidateName(value, '')
        })
        that.checklist1.event._addEvent('checkList.edit', function(value) {
            value.id = val.id
            if (value.name == '') {
                that.update(value)
            } else {
                that.volidateName(value, 'edit')
            }
        })
    }
    async creat(val) {
        let that = this;
        let res = await that.api.permissioncreate(val)
        if (res.code == 0) {
            that.checklist1.close()
            that.menuquery()
        }
    }

    async update(val) {
        let that = this;
        console.log(val, 989)
        let res = await that.api.permissionupdate(val)
        if (res.code == 0) {
            that.checklist1.close()
            that.menuquery()
        }
    }

    async read(val) {
        let that = this;
        let res = await this.api.permissionread({
            id: val
        })
        if (res.code == 0) {
            that.perList = res.data.pageResourceList
        }
    }

    //校验名称不能重复
    async volidateName(value, type) {
        let that = this;
        // console.log(value, type, 9)
        let res = await that.api.volidatename({
            name: value.name
        })
        if (res.code == 0) {
            if (type == 'edit') {
                that.update(value)
            } else {
                that.creat(value)
            }
        } else {
            that.checklist1.dom.find('.inputBox').after('<span class="required">' + res.msg + '</span>')
            that.checklist1.dom.find('.inputBox').addClass('redborder')
        }
    }

    //删除权限
    async deletepermisstion(val) {
        let that = this;
        let res = await this.api.permissiondelete(val)
        if (res.code == 0) {
            that.menuquery()
        }

    }

    initscroll() {
        if (this.myScroll) {
            this.myScroll.refresh()
            return
        }
        var rid = 'aaa_' + Math.floor(new Date().getTime() * Math.random())
        ES.selctorDoc('.scrolltable').attr('id', rid)
        this.myScroll = new IScroll('#' + rid, {
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
        let cw = ES.selctorDoc(window).box().clientWidth - 240
        let ch = ES.selctorDoc(window).box().clientHeight - 100
        ES.selctorDoc('.Jurisdictionmanagement').css({
            'height': ch,
            'width': cw
        })
        ES.selctorDoc('.Jur_right').css({
            'width': cw - 180
        });
        ES.selctorDoc('.scrolltable').css({
            'height': ch - 200
        });
        ES.selctorDoc('.jurmenu').css({
            'height': ch - 32
        });
    }
}

module.exports = Jurisdictionmanagement;