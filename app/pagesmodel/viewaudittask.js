//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class viewaudittask extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.taskid = {}
        this.userlist={}
        this.querylist={id: parseInt(this.app.parpam['id']),page: 1, pageSize: 10,reset:true}
    }
}
module.exports = viewaudittask;
