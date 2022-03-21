function svgHot(option) {
    var svgLib = {};
    svgLib.option = optionMatch({
        width: 300,
        height: 300,
        el: 'svg',
        paper: null,
        path: null,
        image: null,
        cr: null,
        donghua: true,
        wwww: null,
        'font': '100 12px "Microsoft Yahei","黑体","宋体","Helvetica", "Arial Unicode MS", Arial, sans-serif',
        'fontColor': '#4c4c4c',
        'lineColor': "#e7ebed"
    }, option)
    svgLib.option.paper = Raphael(document.getElementById(svgLib.option.el), svgLib.option.width, svgLib.option.height)

    svgLib.changeView = function(obj) {
        svgLib.option.paper.setSize(obj.w, obj.h);
        var info = {};
        if (obj.w / obj.h > 1899 / 991) {
            info.l = Math.floor((obj.w - obj.h * 1899 / 991) / 2)
            info.t = 0
        } else {
            info.l = 0
            info.t = Math.floor((obj.h - 991 * obj.w / 1899) / 2)
        }
        return info;
    }
    var pointnum = 1
    var jsdsd = 0
    svgLib.drawOtherMap = function() {
        var now = -Math.floor((svgLib.option.width - 1899 * svgLib.option.height / 991) / 2 * 991 / svgLib.option.height)
        if (1899 / 991 > svgLib.option.width / svgLib.option.height) {
            now = -Math.floor((svgLib.option.height - 991 * svgLib.option.width / 1899) / 2 * 1899 / svgLib.option.width)
            svgLib.option.paper.setViewBox(0, now, 1899, 991)
        } else {
            svgLib.option.paper.setViewBox(now, 0, 1899, 991)
        }
        var option = svgLib.option
        var pathA = []
            // console.log(option.cr)
        option.paper.image(option.image, 0, 0, 1899, 991)
        if (option.cr[0].x == option.cr[1].x && option.cr[0].y == option.cr[1].y) {
            if (option.cr[1].y < 500) {
                option.paper.image(option.cr[0].pic, option.cr[0].x, option.cr[0].y + 20, 40, 40)
                option.paper.image(option.cr[1].pic, option.cr[1].x, option.cr[1].y - 20, 40, 40)
            } else {
                option.paper.image(option.cr[0].pic, option.cr[0].x + 20, option.cr[0].y, 40, 40)
                option.paper.image(option.cr[1].pic, option.cr[1].x - 20, option.cr[1].y, 40, 40)
            }
        } else {
            option.paper.image(option.cr[0].pic, option.cr[0].x, option.cr[0].y, 40, 40)
            option.paper.image(option.cr[1].pic, option.cr[1].x, option.cr[1].y, 40, 40)
        }

       // console.log(option.path,'=====')
       // if (option.path.length!=0) {
        if (option.path) {
            var cano = []
                //var colorL=[ '#ff390b', '#ff390b', '#ff390b ', '#1eff00', '#1eff00 ','#ff390b']
            var colorL = ['#ff390b ', '#f6ff00', '#1eff00', '#ff390b ', '#ff390b', '#ff390b ', '#ff390b']

            for (var i = 0; i < option.path.length; i++) {
                /*var color = '#51FF00'
                if (i < 2) {
                    color = 'blue'
                }*/
                var path = option.paper.path(option.path[i]).attr({
                    'stroke': colorL[i],
                    'stroke-width': 4,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-opacity': 0.7

                })
                path.glow({ color: '#666', width: 15, opacity: 0.6 })
                var l = path.getTotalLength()
                var tt = "along" + i
                cano.push({ p: path, len: l })
            }
            option.paper.customAttributes.along = function(a) {
                var str = String(Math.floor(a))
                var xul = str.substr(0, str.length - 1) * 1
                var now = a - xul * 10
                    // console.log(now,xul)
                if (cano.length) {
                    var p = cano[xul].p.getPointAtLength(now * cano[xul].len)
                        //console.log(p,path)
                    return { transform: "t" + [p.x, p.y] }
                }
            }
        }
        if (svgLib.option.wwww) {
            clearTimeout(svgLib.option.wwww)
        }

        /* for (j = 0; j < option.path.length; j++) {
             var num = Math.floor(j % option.path.length)
                 //if (num == 1) {
             var et = String(num) + String(1 - Math.floor(num % 2))
                 //console.log(st)
             var st = String(num) + String(Math.floor(num % 2))
                 //} else {
                 // var et = String(num) + String(Math.floor(num % 2))
                 //console.log(st)
                 // var st = String(num) + String(1 - Math.floor(num % 2))
                 //}
             var an1 = Raphael.animation({ 'along': et }, 50000)
             var c = option.paper.circle(0, 0, 10).attr({ 'along': st }).attr({ 'fill': 'r#fff-rgba(255,255,255,0)', 'stroke-width': 0 })
             c.animate(an1)

         }*/
        //if(svgLib)
        setTimeout(poiot, Math.floor(Math.random() * 2000))
    }

    function poiot() {
        //console.log(document.getElementById(svgLib.option.el))
        //console.log('aaa')
        if (!document.getElementById(svgLib.option.el)) {
            clearTimeout(svgLib.option.wwww)
            return
        }
        //console.log('bbb')
        var num = Math.floor(pointnum % option.path.length)
            // if (num ==1) {
        var et = String(num) + String(1 - Math.floor(num % 2))
            //console.log(st)
        var st = String(num) + String(Math.floor(num % 2))
            //console.log('aaaaa')
        var delayTime = Math.floor(Math.random() * 2000) + 500
        var an1 = Raphael.animation({ 'along': et }, 50000)
        var c = svgLib.option.paper.circle(0, 0, 10).attr({ 'along': st }).attr({ 'fill': 'r#fff-rgba(255,255,255,0)', 'stroke-width': 0 })
        c.animate(an1)
            //pointnum++
        jsdsd++
        //if (pointnum < 4) {
        if (jsdsd < 3) {
            svgLib.option.wwww = setTimeout(poiot, delayTime)
        } else {
            jsdsd = 0
            svgLib.option.wwww = setTimeout(poiot, 65000)
        }
        //}
    }


    //--------------------------private------------------------
    //object浅层clone
    function optionMatch(option, matchOption) {
        for (var k in option) {
            if (matchOption[k]) {
                option[k] = matchOption[k]
            }
        }
        return option
    }
    return svgLib;
}
module.exports = svgHot;
