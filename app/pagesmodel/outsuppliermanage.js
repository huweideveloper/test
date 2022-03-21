//这边基本上引入需要使用的资源less，api，需要使用的模块等等。

class outsuppliermanage extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.proseriesdata = {page:1,pageSize:10,isselected:'no'}
    }
}
module.exports = outsuppliermanage;