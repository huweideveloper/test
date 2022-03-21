function tipLib(el, idw) {
    var tip = {
        el: el,
        id: el + '-tip' + "-" + idw,
        dom: null
    }
    var screen = {}
    var info = {}
    var svg = null
    init()
    tip.clear = function() {
        tip.dom.remove()
    }
    tip.html = function(value) {
        var neiBufun = function() {}
        var callback = {
            resolve: function() {},
            done: function(value) {
                if (typeof value == 'function') {
                    callback.resolve = value
                }
            }
        }
        tip.dom.removeAttribute('style')
        if (!svg) {
            svg = document.getElementById(tip.el).getElementsByTagName('svg')[0] || document.getElementById(tip.el).getElementsByTagName('div')[0]
            screen = {
                w: svg.getAttribute('width') * 1,
                h: svg.getAttribute('height') * 1 - 40
            }
        }
        tip.dom.innerHTML = '<div id="' + tip.id + '-content">' + value + '</div>'
        var imgs = tip.dom.getElementsByTagName('img')
        /*if (imgs.length != 0) {
            var num = 0
            for (var i = 0; i < imgs.length; i++) {
                var url = imgs[i].getAttribute('src')
                var newImage = new Image()
                newImage.onload = function() {
                    num++
                    if (num == imgs.length) {
                        drawBg()
                        callback.resolve()

                    }
                }
                newImage.src = url
            }
        } else {
            drawBg()
            callback.resolve()

        }*/
        drawBg()
        callback.resolve()
        return callback
    }
    tip.show = function(pos, align) {
        // console.log(tip.id)
        if (pos.x + 30 + info.width > 0 && pos.x + info.width < screen.w) {
            document.getElementById(tip.id).style.left = pos.x + 30 + 'px'
        } else {
            document.getElementById(tip.id).style.left = pos.x - info.width - 30 + 'px'
        }
        if (!align) {
            if (pos.y > 0 && pos.y + info.height < screen.h) {
                document.getElementById(tip.id).style.top = pos.y + 10 + 'px'
            } else {
                document.getElementById(tip.id).style.top = pos.y - info.height - 10 + 'px'
            }
        } else {
            switch (align) {
                case 'center':
                    document.getElementById(tip.id).style.top = (screen.h - info.height) / 2 + 'px'
                    break
                case 'top':
                    document.getElementById(tip.id).style.top = 0 + 'px'
                    break
                case 'bottom':
                    document.getElementById(tip.id).style.top = screen.h - info.height + 'px'
                    break
            }
        }
        document.getElementById(tip.id).style.display = 'block'
    }
    tip.hide = function() {
        document.getElementById(tip.id).style.display = 'none'
    }
    tip.getInfo = function() {
        return info
    }

    //----私有
    function init() {
        var creatElement = document.createElement('div')
        creatElement.setAttribute('id', tip.id)
        creatElement.setAttribute('class', 'tip')
        document.getElementById(tip.el).appendChild(creatElement)
        tip.dom = document.getElementById(tip.id)

    }

    function drawBg() {
        var mg = {
            t: 5,
            l: 8
        }
        var dom = document.getElementById(tip.id + '-content')
        tip.dom.removeAttribute('style')
        tip.dom.style.display = 'block'
        tip.dom.style.height = dom.offsetHeight + mg.t * 2 + 'px'
        tip.dom.style.width = dom.offsetWidth + mg.l * 2 + 'px'
        dom.style.marginTop = mg.t + "px"
        dom.style.marginLeft = mg.l + "px"
        info = {
            height: dom.offsetHeight + mg.t * 2,
            width: dom.offsetWidth + mg.l * 2
        }
        tip.dom.style.display = 'none'
    }
    return tip
}

module.exports = tipLib;