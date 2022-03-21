class etl {
    constructor(biaoshi, time, nodee) {
        this.nowNode = {}
        let endNode = []
        let first = []
        this.num = 0
        this.biaoshi = biaoshi
        this.time = time
        this.nodee = nodee
        this.caonim(this.biaoshi[0], 0)
        endNode = this.getrel()
        return { rel: endNode, currentlist: this.getstud(endNode), allnode: this.todoNodelist(endNode) }

    }
    getrel() {
        let endNode = []
        for (var i = 0; i < this.biaoshi.length; i++) {
            let node = this.nowNode[this.biaoshi[i]]
            for (var j in node) {
                let endpush = node[j]
                let tempa = []
                for (var w = 0; w < endpush.length; w++) {
                    if (w == 0) {
                        let one = {
                            id: endpush[0].basisNoduleId,
                            compareStatus: endpush[0].compareStatus,
                            z: endpush[0].coordZ,
                            y: endpush[0].coordY,
                            x: endpush[0].coordX,
                            diameter: endpush[0].diameter,
                            p: endpush[0].prob,
                            borderSymptom: endpush[0].borderSymptom,
                            boundary: endpush[0].boundary,
                            densityType: endpush[0].densityType,
                            sid: this.biaoshi[0]
                        }
                        let two = {
                            id: endpush[0].targetNoduleId,
                            z: endpush[0].layerNumber,
                            y: endpush[0].oldCoordY,
                            x: endpush[0].oldCoordX,
                            diameter: endpush[0].oldDiameter,
                            sid: this.biaoshi[1],
                            borderSymptom: endpush[0].oldBorderSymptom,
                            boundary: endpush[0].oldBoundary,
                            densityType: endpush[0].oldDensityType
                        }
                        tempa.push(one, two)
                    } else {
                        let www = {
                            id: endpush[w].targetNoduleId,
                            z: endpush[w].layerNumber,
                            y: endpush[w].oldCoordY,
                            x: endpush[w].oldCoordX,
                            diameter: endpush[w].oldDiameter,
                            sid: this.biaoshi[w + 1],
                            borderSymptom: endpush[0].oldBorderSymptom,
                            boundary: endpush[0].oldBoundary,
                            densityType: endpush[0].oldDensityType
                        }
                        tempa.push(www)
                    }
                }
                endNode.push(tempa)
            }
        }
        return endNode
    }
    getstud(value) {
        let arrayA = []
        for (var i = 0; i < value.length; i++) {
            let tempnode = value[i][0]
            let taggingType
            let opai
            let display = 0
            switch (tempnode.compareStatus) {
                case 4:
                    if (tempnode.srcProb == null) {
                        opai = 0
                        taggingType = 1
                    } else {
                        opai = 1
                        taggingType = 2
                    }
                    display = 4
                    break
                case 6:
                    taggingType = 1
                    opai = 0
                    break
                default:
                    taggingType = 2
                    opai = 1
                    break
            }
            let tudu = {
                id: i,
                length: tempnode.diameter * 1,
                probMean: (tempnode.p * 1).toFixed(2),
                taggingType: taggingType,
                opai: opai,
                numNo: !tempnode.id ? "消失结节" : (i + 1),
                orgin: (opai == 0 ? "人工标注" : "智能检测"),
                display: display
            }
            arrayA.push(tudu)
        }
        return arrayA
    }
    todoNodelist(value) {
        let nodelist = {}
        for (var i = 0; i < value.length; i++) {
            let tempnode = value[i]
            for (var j = 0; j < tempnode.length; j++) {
                if (!nodelist[this.biaoshi[j]]) {
                    nodelist[this.biaoshi[j]] = {}
                }
                if (tempnode[j].id) {
                    if (!nodelist[this.biaoshi[j]][tempnode[j].z]) {
                        nodelist[this.biaoshi[j]][tempnode[j].z] = []
                    }
                    nodelist[this.biaoshi[j]][tempnode[j].z].push(tempnode[j])
                }
            }
        }
        return nodelist
    }
    //计算公式 递归完成多次匹配
    caonim(id, num, comparse) {
        let time = this.time
        let biaoshi = this.biaoshi
        let st = null
        let length = 0
        for (var w = 0; w < time.length; w++) {
            if (time[w].base == id) {
                if (st == null) {
                    st = w
                } else {
                    st = st < w ? st : w
                }
                length++
            }
        }
        if (!comparse) {
            this.normal(st, length)
        } else {
            var tempA = this.returnnewdon(comparse, id)
            this.caoyouc(st, length, tempA)
        }
        this.num = this.num + 1
        if (this.num < biaoshi.length - 1) {
            this.caonim(biaoshi[num], this.num, this.nowNode[id + 'null'])
        } else {
            if (JSON.stringify(comparse) != "{}") {
                var tempA = this.returnendcom(comparse)
                this.caoyouc2(st, length, tempA)
            }
        }
    }

    returnendcom(comparse) {
        let tempA = {}
        for (var i in comparse) {
            for (var j = 0; j < comparse[i].length; j++) {
                tempA[comparse[i][j].targetNoduleId] = comparse[i][j]
            }
            delete comparse[i]
        }
        return tempA
    }

    returnnewdon(comparse, id) {
        let tempA = {}
        for (var w in comparse) {
            if (w == 'null_' + id) {
                for (var n = 0; n < comparse[w].length; n++) {
                    tempA[comparse[w][n].targetNoduleId] = comparse[w][n]
                }
                delete comparse[w]
            }
        }
        return tempA
    }

    caoyouc2(st, length, tempA) {
        let time = this.time
        for (var i = st; i < st + length; i++) {
            let temp = this.nodee[i]
            for (var j = 0; j < temp.length; j++) {
                if (temp[j].targetNoduleId && tempA[temp[j].targetNoduleId]) {
                    if (!this.nowNode[time[i].com]) {
                        this.nowNode[time[i].com] = {}
                    }
                    if (!this.nowNode[time[i].com][temp[j].targetNoduleId]) {
                        this.nowNode[time[i].com][temp[j].targetNoduleId] = [tempA[temp[j].targetNoduleId]]
                    }
                    this.nowNode[time[i].com][temp[j].targetNoduleId].push(temp[j])
                }
            }
        }
    }

    caoyouc(st, length, tempA) {
        let time = this.time
        for (var i = st; i < st + length; i++) {
            let temp = this.nodee[i]
            for (var j = 0; j < temp.length; j++) {
                if (temp[j].basisNoduleId && tempA[temp[j].basisNoduleId]) {
                    if (!this.nowNode[time[i].base]) {
                        this.nowNode[time[i].base] = {}
                    }
                    if (!this.nowNode[time[i].base][temp[j].basisNoduleId]) {
                        this.nowNode[time[i].base][temp[j].basisNoduleId] = [tempA[temp[j].basisNoduleId]]
                    }
                    this.nowNode[time[i].base][temp[j].basisNoduleId].push(temp[j])
                }
            }
        }
    }

    normal(st, length) {
        let time = this.time
        for (var i = st; i < st + length; i++) {
            let temp = this.nodee[i]
            for (var j = 0; j < temp.length; j++) {
                if (temp[j].basisNoduleId) {
                    if (!this.nowNode[time[i].base]) {
                        this.nowNode[time[i].base] = {}
                    }
                    if (!this.nowNode[time[i].base][temp[j].basisNoduleId]) {
                        this.nowNode[time[i].base][temp[j].basisNoduleId] = []
                    }
                    this.nowNode[time[i].base][temp[j].basisNoduleId].push(temp[j])
                } else {
                    if (!this.nowNode[time[i].base + 'null']) {
                        this.nowNode[time[i].base + 'null'] = {}
                    }
                    if (!this.nowNode[time[i].base + 'null']["null_" + time[i].com]) {
                        this.nowNode[time[i].base + 'null']["null_" + time[i].com] = []
                    }
                    this.nowNode[time[i].base + 'null']["null_" + time[i].com].push(temp[j])
                }
            }
        }
    }

}

module.exports = etl;