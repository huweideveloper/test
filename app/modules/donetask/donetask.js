require('./donetask.less')
// var html = require('./tpl.html')

class donetask extends Interstellar.moduleBase {
    constructor(app, dom, value, addMode) {
        super(app, dom, value, addMode)
        this.html = require('./tpl.html');
        this.name = 'donetask';
        //this.flag = true;
        //this.code = "";
    }
    complete() {

    }
    setData(value) {
        this.render(value)
    }
    render(value) {
        let that = this
        this.dom.find('.tasklilist').html('')
        let str = ''
        value.map((item) => {
            str += `<li taskId="` + item.id + `" pid="` + item.projectId + `">
            <label class="colortip"></label>
            <span class="taskname">` + item.name + `</span>
            <span class="taskdate">` + (item.startTime ? Tool.time(item.startTime, 'yyyy-mm-dd') : item.startTime) + `-` +
                (item.endTime ? Tool.time(item.endTime, 'yyyy-mm-dd') : item.endTime) + `</span>
        </li>`
        })
        this.dom.find('.tasklilist').html(str)
        this.dom.find('.tasklilist li').on('click', function() {
            that.event._dispatch('donetask.click', { taskId: ES.selctorDoc(this).attr('taskId'), projectId: ES.selctorDoc(this).attr('pid') })
        })
    }


}

//原型链一定要有的
module.exports = donetask;