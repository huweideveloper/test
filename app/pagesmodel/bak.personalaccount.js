//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class PersonAlAccountModel extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        //taskInfo任务详情
        //userInfo用户信息
        //sequencesInfo序列信息
        this.data = { pageSize: 10, page: 1,keyword:"" }
       
    }
}
module.exports = PersonAlAccountModel;
