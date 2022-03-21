//矩阵常用计算，经过计算以后返回一个矩阵对象
//包含的内容
/*
AStart返回A*矩阵，A*为代数余子式组成的矩阵，返回一个新的矩阵对象
AInverse返回A逆矩阵，返回一个新的矩阵对象
rankA返回A的秩
transpose返回AT矩阵，AT为矩阵的转置，返回一个新的矩阵对象
shape返回矩阵的行列信息
add矩阵的加法计算。可以是个数字也可以是两个矩阵相加，返回一个新的矩阵对象
multiply矩阵的乘法计算。可以是个数字也可以是两个矩阵相乘，返回一个新的矩阵对象
*/
class Metix {
    constructor(data, row, col) {
        this.orgin = Metix.makeMetix(data, 'row', row, col)
        this.row = row
        this.col = col
    }

    //a*
    AStart() {
        let newA = []
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                //console.log(Metix.modA(this.orgin,i, j))
                newA.push(Metix.modA(this.orgin, i, j))
            }
        }
        return new Metix(newA, this.row, this.col)
    }

    //a-1
    AInverse() {
        let data = Metix.rankA(this.orgin, this.row, this.col)
        if (data) {
            let newA = []
            // console.log()
            let temp = this.AStart().transpose().orgin
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                   // console.log(temp[i][j])
                    newA.push(temp[i][j] / data)
                }
            }
            return new Metix(newA, this.row, this.col)
        } else {
            return null
        }
    }

    //|a|
    rankA() {
        return Metix.rankA(this.orgin, this.row, this.col)
    }

    //at
    transpose() {
        let newA = []
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                newA.push(this.orgin[j][i])
            }
        }
        return new Metix(newA, this.col, this.row)
    }
    shape() {
        return {
            row: this.row,
            col: this.col
        }
    }
    add(value) {
        let newA = []
        switch (typeof value) {
            case "object":
                for (let i = 0; i < this.row; i++) {
                    for (let j = 0; j < this.col; j++) {
                        newA[i].push(this.orgin[i][j] + (value[i][j] ? value[i][j] : 0))
                    }
                }
                break
            case "number":
                for (let i = 0; i < this.row; i++) {
                    for (let j = 0; j < this.col; j++) {
                        newA[i].push(this.orgin[i][j] + value)
                    }
                }
                break
        }
        return new Metix(newA, this.row, this.col)
    }
    multiply(value) {
        let aa = []
        switch (typeof value) {
            case "object":
                //console.log(this.orgin,value)
                let newA = Metix.metixMultiply(this.orgin, value)
                for (let i = 0; i < newA.length; i++) {
                    for (let j = 0; j < newA[i].length; j++) {
                        aa.push(newA[i][j])
                    }
                }
                return new Metix(aa, newA.length, newA[0].length)
                break
            case "number":
                for (let i = 0; i < this.row; i++) {
                    for (let j = 0; j < this.col; j++) {
                        aa.push(this.orgin[i][j] * value)
                    }
                }
                return new Metix(aa, this.row, this.col)
                break
        }
    }
    static modA(value, rr, rc) {
        let newA = []
        for (let i = 0; i < value.length; i++) {
            if (i != rr) {
                newA.push([])
                for (let j = 0; j < value[i].length; j++) {
                    if (j != rc) {
                        newA[newA.length - 1].push(value[i][j])
                    }
                }
            }
        }

        let randk = Math.pow(-1,(rr*1+rc*1))*Metix.rankA(newA, value.length - 1, value[0].length - 1)
        //console.log(randk, rr, rc, newA)
        return randk
    }
    static rankA(ctA, row, col) {
        let leftNum = 0
        if (row == 1 && col == 1) {
            return ctA[0][0]
        }
        if (row == 2 && col == 2) {
            return ctA[0][0] * ctA[1][1] - ctA[0][1] * ctA[1][0]
        }
        for (let i = 0; i < col; i++) {
            let num = 1
            for (let j = 0; j < row; j++) {
                let qianz = ((j + i > col - 1) ? (j + i - col) : (j + i))
                num = num * ctA[j][qianz]
            }
            leftNum += num
        }
        let rightNum = 0
        for (let i = col - 1; i >= 0; i--) {
            let num2 = 1
            for (let j = 0; j < row; j++) {
                let qianz1 = (i - j < 0 ? (col + i - j) : i - j)
                num2 = num2 * ctA[j][qianz1]
            }
            rightNum += num2
        }
       // console.log(ctA, rightNum, leftNum)
        return leftNum - rightNum
    }
    static makeMetix(value, type, row, col) {
        let rA = []
        if (type == 'row') {
            for (let i = 0; i < row; i++) {
                rA[i] = []
                for (let j = 0; j < col; j++) {
                    rA[i].push(value[i * col + j])
                }
            }
        } else {
            for (let i = 0; i < col; i++) {
                rA[i] = []
                for (let j = 0; j < row; j++) {
                    rA[i].push(value[i + j * col])
                }
            }
        }
        return rA
    }
    static metixMultiply(mA, mB) {
        if (typeof mA[0] != 'object' && typeof mB[0] != 'object') {
            return []
        }
        let rA = []
        for (let i = 0; i < mA.length; i++) {
            rA[i] = []
            for (let j = 0; j < mB.length; j++) {
                rA[i].push(Metix.Multiply(mA[i], mB[j]))
            }
        }
        return rA
    }
    static Multiply(mA, mB) {
        //console.log(mA,mB)
        if (mA.length != mB.length) {
            return null
        }
        let num = 0
        for (let i = 0; i < mA.length; i++) {
            num += mA[i] * mB[i]
        }
        //console.log(num)
        return num
    }
}

window.Metix = window.Metix || Metix
module.exports = window.Metix;
