var DrawRadar = {
    //雷达图
    drawRapezoid: function(nowOption) {
        //console.log(nowOption)
        //var nowOption = optionMatch(BaseOption, option)
        var r = nowOption.width > nowOption.height ? nowOption.height : nowOption.width
        var pathStr = ''
        var yuandian = nowOption.paper.set()

        //svgBG.drawR(svgLib, nowOption)
        var newV = nowOption.data.toString().split(',')
        var newdata = newV.sort(function NumDescSort(a, b) {
            return b * 1 - a * 1;
        })
        var max = newdata[0]
        var jg = (nowOption.height - nowOption.top - 30) / (nowOption.x.length - 1)
        var stk = nowOption.data[0] != 0 ? (nowOption.data[0] / max) * ((nowOption.width - 140) * 0.8) : 10
        var lastinfo = { st: (nowOption.width - stk) / 2, w: stk, y: nowOption.top }
        for (var j = 0; j < nowOption.x.length; j++) {
            if (j != 0) {
                //console.log(nowOption.data[j - 1])
                var w = nowOption.data[j - 1] != 0 ? Math.pow(nowOption.data[j] / nowOption.data[j - 1], 0.5) * lastinfo.w : Math.pow(10, 0.5)
                if (nowOption.data[j] == 0) {
                    w = 10
                }
                //console.log(w)
                var path = ''
                var st = (nowOption.width - w) / 2

                path = 'M' + lastinfo.st + ',' + lastinfo.y + 'L' + (lastinfo.st + lastinfo.w) + ',' + lastinfo.y
                path += "L" + (st + w) + ',' + (nowOption.top + jg * j) + 'L' + st + ',' + (nowOption.top + jg * j)
                var area = nowOption.paper.path(path).attr({
                    'fill': nowOption.color[j - 1] ? nowOption.color[j - 1] : '#5eb0be',
                    "stroke-width": 0,
                    'cursor':'pointer'
                }).data({
                    "index": j
                }).mouseover(function(e) {
                    nowOption.mouseover({
                        'pos': this.getBBox(),
                        'index': this.data('index'),
                        'mousepos': {
                            x: e.offsetX || e.screenX,
                            y: e.offsetY || e.offsetY
                        }
                    })
                }).mouseout(function() {
                    nowOption.mouseout()
                })
                yuandian.push(area)
                lastinfo = { st: st, w: w, y: nowOption.top + jg * j }
            }
            var textC = true
            if (nowOption.x.length > nowOption.xSetInterval * 1.2) {
                var nowshowpos = Math.ceil(nowOption.x.length / nowOption.xSetInterval)
                if (j % nowshowpos != 0) {
                    textC = false
                }
            }
            if (textC && nowOption.weidu) {
                nowOption.paper.rect(nowOption.width / 2, (nowOption.top + jg * j), nowOption.width / 2, 1).attr({
                    'fill': nowOption.lineColor,
                    'stroke-width': 0
                })
                nowOption.paper.text(nowOption.width, nowOption.top + jg * j - 6, nowOption.formatKdX(nowOption.data[j], j)).attr({
                    font: nowOption.font,
                    fill: '#666',
                    'text-anchor': 'end'
                });
            }
            if (textC && j != 0 && nowOption.weidu) {
                nowOption.paper.rect(0, (nowOption.top + jg * j - jg / 2), nowOption.width / 2, 1).attr({
                    'fill': nowOption.lineColor,
                    'stroke-width': 0
                })
                var nowOptiondata = nowOption.data[j - 1] != 0 ? nowOption.data[j] / nowOption.data[j - 1] : '--'
                nowOption.paper.text(0, nowOption.top + jg * j - jg / 2 - 6, nowOption.formatKdY(nowOptiondata, j)).attr({
                    font: nowOption.font,
                    fill: '#666',
                   // fill: nowOption.color[j] ? nowOption.color[j] : '#5eb0be',
                    'text-anchor': 'start'
                });
            }
        }
        yuandian.toFront()
    }
}

module.exports = DrawRadar;