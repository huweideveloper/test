var model = {
    keyArr: {},
    set: function(key, value) {
       //if(keyArr[key]){
        model.keyArr[key]=value
       
    },
    get: function(key) {
       // var value
        if(model.keyArr[key]){
            return model.keyArr[key]
        }else{
            return null
        }
    },
    del: function(key) {
        model.keyArr[key]=null
    },
    clearAll: function() {
        model.keyArr = []
    }
}
module.exports = model;
