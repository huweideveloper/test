var local = {
    keyArr: [],
    set: function(key, value, mode) {
        if (!local.keyArr.search(key)) {
            local.keyArr.push(key)
        }
        if (mode) {
            if (window.localStorage) {
                var storage = window.localStorage
                storage.setItem(key, value);
            }
            var Days = 365;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + value+ ";expires=" + exp.toGMTString()+ ';path=/';
            return
        }
        if (window.localStorage) {
            var storage = window.localStorage
            storage.setItem(key, value);
        } else {
            var Days = 365;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + value+ ";expires=" + exp.toGMTString()+ ';path=/';
        }
    },
    get: function(key) {
        var value
        var value1
        if (window.localStorage) {
            var storage = window.localStorage
            value = storage.getItem(key);
        }
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            value1 =arr[2];
        } else {
            value1 = null;
        }
        return value || value1
    },
    del: function(key, mode) {
        console.log(key)
        /*if (local.keyArr.search(key)) {
            var nst = local.keyArr.toString().replace(key, '')
            console.log(nst,'dsadlaskdlsdk')
            local.keyArr = nst.splie(',')
        }*/
        if (mode) {
            if (window.localStorage) {
                var storage = window.localStorage
                storage.removeItem(key)
            }
            var exp = new Date();
            exp.setTime(exp.getTime() - 1000);
            var cval = local.get(key);
            if (cval != null) {
                document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString()+ ';path=/';
            }
            return
        }
        if (window.localStorage) {
            var storage = window.localStorage
            storage.removeItem(key)
        } else {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1000);
            var cval = local.get(key);
            if (cval != null) {
                document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString()+ ';path=/';
            }
        }
    },
    clearAll: function() {
        if (window.localStorage) {
            var storage = window.localStorage
            storage.clear()
        } else {
            for (var i = 0; i < keyArr.length; i++) {
                local.del(local.keyArr[i])
            }
            local.keyArr = []
        }
    }
}
module.exports = local;
