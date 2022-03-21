function eventMo() {
    var event = {}
    event._event = {}
    event._id = 0
    event._dispatch = function(name, params) {
        var nowmpdel = name.split('.')
        var now = event._event
        for (var i = 0; i < nowmpdel.length; i++) {
            if (!now[nowmpdel[i]]) {
                //console.log('fun not find',nowmpdel[i])
            } else {
                now = now[nowmpdel[i]]
            }
            //console.log(now.fun,'nowfun',name)
            if (i == nowmpdel.length - 1) {
                if (typeof now.fun === 'function') {
                    now.fun(params)
                } else {
                    // console.log('no function',now.fun)
                }
            }
        }
    }
    event._addEvent = function(name, callback) {
        var nowmpdel = name.split('.')
        var now = event._event
        for (var i = 0; i < nowmpdel.length; i++) {
            if (!now[nowmpdel[i]]) {
                now[nowmpdel[i]] = {}
            }
            now = now[nowmpdel[i]]
            if (i == nowmpdel.length - 1) {
                now.fun = callback
                event._id += 1
                now.id = event._id
                now.name = name
            }
        }
        return now
    }
    event._delEvent = function(name) {
        var nowmpdel = value.split('.')
        var now = event._event
        for (var i = 0; i < nowmpdel.length; i++) {
            if (i == nowmpdel.length - 1) {
                delete now[nowmpdel[i]]
            }
            now = now[nowmpdel[i]]
        }
    }
    return event
}
window.Interstellar = window.Interstellar || {}
window.Interstellar.event = window.Interstellar.event || eventMo
module.exports = eventMo;