function animationCSS() {
    let st
    let et
    let callbackTime
    let cssAnimation = {
        play: function(el, key, callback) {
            cssAnimation.stop(el)
            el.css({ "transitionProperty": "all", "MozTransitionProperty": "all", "WebkitTransitionProperty": "all", "OTransitionProperty": "all" })
            et = key.et
            el.css(returnCssPos(key.st.x, key.st.y, key.st.r, key.st.s, key.st.o))
            key.fun ? key.fun : "linear"
            el.css(returnCssTime(0, key.fun, 0))
            key.time = key.time ? key.time : 0.3
            key.delay = key.delay ? key.delay : 0
            el.css(returnCssPos(key.et.x, key.et.y, key.et.r, key.et.s, key.et.o))
            el.css(returnCssTime(key.time, key.fun, key.delay))
            if (typeof callback == "function") {
                let intervalT = (key.time + key.delay) * 1000
                callbackTime = setTimeout(function() {
                    callback()
                }, intervalT)
            }
        },
        clearTimeObj: function() {
                clearTimeout(callbackTime)
                callbackTime = null
        },
        stop: function(el) {
            if (callbackTime) {
                clearTimeout(callbackTime)
                callbackTime = null
            }
            el.css({ "transitionProperty": "none", "MozTransitionProperty": "none", "WebkitTransitionProperty": "none", "OTransitionProperty": "none" })
        },
        fadeIn: function(el, key, callback) {
            const obj2 = {}
            if (key) {
                Object.assign(obj2, key)
            }
            obj2.st = { o: 0 }
            obj2.et = { o: 1 }
            cssAnimation.play(el, obj2, callback)
            obj2.time = obj2.time ? obj2.time : 0.3
            obj2.delay = obj2.delay ? obj2.delay : 0
            let intervalT = (obj2.time + obj2.delay) * 1000
            setTimeout(function() {
                el.css({ 'opacity': '' })
            }, intervalT)
            el.show()
        },
        fadeOut: function(el, key, callback) {
            const obj2 = {}
            if (key) {
                Object.assign(obj2, key)
            }
            obj2.st = { o: 1 }
            obj2.et = { o: 0 }
            cssAnimation.play(el, obj2, callback)
            obj2.time = obj2.time ? obj2.time : 0.3
            obj2.delay = obj2.delay ? obj2.delay : 0
            let intervalT = (obj2.time + obj2.delay) * 1000
            setTimeout(function() {
                el.css({ 'opacity': '' })
                el.hide()
            }, intervalT)
            el.show()
        },
    }

    function returnCssTime(duration, fun, delay) {
        var tempObj = {}
        if (duration != null && duration != undefined) {
            tempObj["transitionDuration"] = duration + "s"
            tempObj["MozTransitionDuration"] = duration + "s"
            tempObj["WebkitTransitionDuration"] = duration + "s"
            tempObj["OTransitionDuration"] = duration + "s"
            tempObj["msTransitionDuration"] = duration + "s"
        }
        if (fun != null && fun != undefined) {
            tempObj["transitionTimingFunction"] = fun
            tempObj["MozTransitionTimingFunction"] = fun
            tempObj["WebkitTransitionTimingFunction"] = fun
            tempObj["OTransitionTimingFunction"] = fun
            tempObj["msTransitionTimingFunction"] = fun
        }
        if (delay != null && delay != undefined) {
            tempObj["transitionDelay"] = delay + "s"
            tempObj["MozTransitionDelay"] = delay + "s"
            tempObj["WebkitTransitionDelay"] = delay + "s"
            tempObj["OTransitionDelay"] = delay + "s"
            tempObj["msTransitionDelay"] = delay + "s"
        }
        return tempObj
    }

    function returnCssPos(x, y, r, s, o) {
        var tempObj = {}
        let xy = ''
        if ((x != null && x != undefined) || (y != null && y != undefined)) {
            if (typeof x != "string") {
                x = x ? (x + 'px') : '0px'
            }
            if (typeof y != "string") {
                y = y ? (y + 'px') : '0px'
            }
            xy = 'translate(' + x + "," + y + ')'
        }
        if (r != null && r != undefined) {
            xy = xy ? (xy + ' rotate(' + r + 'deg)') : ('rotate(' + r + 'deg)')
        }
        if (s != null && s != undefined) {
            xy = xy ? (xy + ' scale(' + s + ')') : ('scale(' + s + ')')
        }
        tempObj["transform"] = xy
        tempObj["MozTransform"] = xy
        tempObj["WebkitTransform"] = xy
        tempObj["OTransform"] = xy
        tempObj["msTransform"] = xy
        if (o != null && o != undefined) {
            tempObj['opacity'] = o
        }
        return tempObj
    }
    return cssAnimation
}

window.animation = window.animation || new animationCSS()
module.exports = window.animation;