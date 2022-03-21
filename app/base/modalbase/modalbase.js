class menu{
	constructor() {
        require("./modalbase.less");
		this.html=require("./tpl.html")
	}
	btnInitview (obj) {
        //console.log(that)
        //var obj = this
        obj.dom.find('.btn-cancel, .modal-close').on('click', function() {
            obj.close();
            obj.event._dispatch("folders.cancel")
        });
    }
}
//原型链一定要有的
module.exports = menu;