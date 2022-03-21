var sessionStorage = {
    keyArr: [],
    set: function(key, value, mode) {
        if (!sessionStorage.keyArr.search(key)) {
            sessionStorage.keyArr.push(key)
        }
        if (window.sessionStorage) {
            var storage = window.sessionStorage
            storage.setItem(key, value);
        }else{
            console.log('no')
        }
    },
    get: function(key) {
        var value
        var value1
        if (window.sessionStorage) {
            var storage = window.sessionStorage
            value = storage.getItem(key);
        }
        return value
    },
    del: function(key, mode) {
        if (window.sessionStorage) {
            var storage = window.sessionStorage
            storage.removeItem(key)
        } 
    },
    clearAll: function() {
        if (window.sessionStorage) {
            var storage = window.sessionStorage
            storage.clear()
        }
    }
}
module.exports = sessionStorage;
