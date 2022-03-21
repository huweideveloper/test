function tesEvent() {
    var tsu = { endpath: [] }
    var map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
        [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1]
    ]
    var fx = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
   
    var path = {}

    tsu.astar = function(st, et, mapInfo, lx) {
        var mapNow = []
        if (!mapInfo) {
            for (var i = 0; i < map.length; i++) {
                mapNow[i] = []
                for (var j = 0; j < map[i].length; j++) {
                    mapNow[i][j] = { info: map[i][j], used: false }
                }
            }
        } else {
            mapNow = mapInfo
        }
        if (lx) {
            path[st[0]] = null
            var stpos = st[0].split('$')
            mapNow[stpos[0]][stpos[1]].used = true
        }
        var nextSt = []
        for (var m = 0; m < st.length; m++) {
            var stpos = st[m].split('$')
                //console.log(stpos)
            for (var w = 0; w < 4; w++) {
                var px = stpos[1] * 1 + fx[w].x
                var py = stpos[0] * 1 + fx[w].y
                    //console.log(py,px)
                if (px >= 0 && px < map[0].length && py >= 0 && py < map.length) {
                    if (mapNow[py][px].info != 0 && !mapNow[py][px].used) {
                        mapNow[py][px].used = true
                        path[py + '$' + px] = st[m]
                        nextSt.push(py + '$' + px)
                    }
                }
            }
        }
        if (nextSt.length == 0) {
            //console.log('妈的没路了')
            return []
        }
        var str = ',' + nextSt.toString() + ','

        var net = ',' + et + ','
        var parent = et
            //console.log(str.lastIndexOf(net),str,net)
        if (str.lastIndexOf(net) != -1) {
            //console.log('找到了')
            tsu.endpath = []
            tsu.endpath = [et]
            do {
                parent = path[parent]
                if (parent) {
                    tsu.endpath.splice(0,0,parent)
                }
            }
            while (parent)
            	tsu.endpath.pop()
        }
        if (tsu.endpath.length == 0) {
            tsu.astar(nextSt, et, mapNow, false)
        }

    }
    return tsu
}
module.exports = tesEvent;