class loginmodel extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.proseriesdata = {page:1,pageSize:10,isselected:'no'}
    }
}
module.exports = loginmodel;