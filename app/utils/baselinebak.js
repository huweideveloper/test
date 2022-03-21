//data对象，参考对象referent，转换对象 convert 
//参考对象包含 imageOrientationPatient,imagePositionPatient,pixelSpacing
//转换对象包含 imageOrientationPatient,imagePositionPatient,pixelSpacing,total,distance,width,height
//imageOrientationPatient两个坐标系的转换关系
//imagePositionPatient代表图片的左顶点的位置信息
//pixelSpacing代表图像像素和毫米的转换
/*makeMetix 将数组按照行或者列 数装换成二维数组,row代表行，col代表列，type代表是按照行还是列的模式，value是原始数组，
 原始数组为一维数组，数字的排序是按照矩阵的逐行进入\
 metixMultiply 为数组乘法，mA，mB代表两个数组，最后返回两数组相乘的结果,是一个二维数组，以逐行模式排序
 existsDraw是否有相交线，如果没有就算了
 rankA计算矩阵的秩，为了逆运算准备的

  */
class BaseLine {
    constructor(data) {
        // console.log(new Date().getTime())
        data.referent.imageOrientationPatient = BaseLine.backImageOrientationPatient(data.referent.imageOrientationPatient)
        data.convert.imageOrientationPatient = BaseLine.backImageOrientationPatient(data.convert.imageOrientationPatient)
        //两套序列平行返回
        if (data.convert.imageOrientationPatient.toString() == data.referent.imageOrientationPatient.toString()) {
            return []
        }
        let nowMetix = BaseLine.makeMetix(data.referent)

        let backMetix = nowMetix.AInverse()
        // console.log(backMetix,nowMetix.rankA(),nowMetix)
        let referent = BaseLine.getPoint(data.referent)
        let convert = BaseLine.getPoint(data.convert)

        /*if (referent.a * convert.a + referent.b * convert.b + referent.c * convert.c == 0) {
            return
        }*/
        // let a = referent.a - convert.a
        // let b = referent.b - convert.b
        // let c = referent.c - convert.c
        // let d = referent.d - convert.d

        let a = convert.a
        let b = convert.b
        let c = convert.c
        let d = convert.d

        let allline = BaseLine.getfourline(referent.pointAll)
        let pointA = []
        for (let i in allline) {
            pointA.push(BaseLine.getlineIntersection(allline[i], a, b, c, d))
        }
        let endA = []
        let orginXYZ = []
        // let mm = BaseLine.getMaxMin(convert.pointAll)
        let mm = BaseLine.getMaxMin(referent.pointAll)
        //console.log(mm)
        //console.log(pointA,'pointA',backMetix)
        for (let i = 0; i < pointA.length; i++) {
            let x
            let y
            if (!backMetix) {
                let temp
                let endAll
                if (pointA[i].x == 0) {
                    temp = new Metix([nowMetix.orgin[1][0], nowMetix.orgin[1][1], nowMetix.orgin[2][0], nowMetix.orgin[2][1]], 2, 2)
                    endAll = temp.AInverse().multiply([
                        [pointA[i].y - nowMetix.orgin[1][2], pointA[i].z - nowMetix.orgin[2][2]]
                    ])
                }
                if (pointA[i].y == 0) {
                    temp = new Metix([nowMetix.orgin[0][0], nowMetix.orgin[0][1], nowMetix.orgin[2][0], nowMetix.orgin[2][1]], 2, 2)
                    endAll = temp.AInverse().multiply([
                        [pointA[i].x - nowMetix.orgin[0][2], pointA[i].z - nowMetix.orgin[2][2]]
                    ])
                }
                if (pointA[i].z == 0) {
                    temp = new Metix([nowMetix.orgin[0][0], nowMetix.orgin[0][1], nowMetix.orgin[1][0], nowMetix.orgin[1][1]], 2, 2)
                    endAll = temp.AInverse().multiply([
                        [pointA[i].x - nowMetix.orgin[0][2], pointA[i].y - nowMetix.orgin[1][2]]
                    ])
                }
                // console.log(endAll,pointA[i])
                if (endAll) {
                    endA.push({ x: endAll.orgin[0][0], y: endAll.orgin[1][0] })
                    orginXYZ.push({ x: pointA[i].x, y: pointA[i].y, z: pointA[i].z })
                }

                // console.log(endAll)
            } else {
                let backxy = backMetix.multiply([
                    [pointA[i].x, pointA[i].y, pointA[i].z]
                ])
                x = Math.round(backxy.orgin[0] / backxy.orgin[2])
                y = Math.round(backxy.orgin[1] / backxy.orgin[2])
                //console.log(x,y,backxy)         
            }
            if (x >= 0 && x <= data.referent.width && y >= 0 && y <= data.referent.height) {
                endA.push({ x: x, y: y })
                orginXYZ.push({ x: pointA[i].x, y: pointA[i].y, z: pointA[i].z })
            }

        }
        if (endA.length == 2) {
            let orginMaxx = Math.max(orginXYZ[0].x, orginXYZ[1].x)
            let orginMinx = Math.min(orginXYZ[0].x, orginXYZ[1].x)
            let orginMaxy = Math.max(orginXYZ[0].y, orginXYZ[1].y)
            let orginMiny = Math.min(orginXYZ[0].y, orginXYZ[1].y)
            let orginMaxz = Math.max(orginXYZ[0].z, orginXYZ[1].z)
            let orginMinz = Math.min(orginXYZ[0].z, orginXYZ[1].z)
            if (orginMaxx < mm.x.min || orginMinx > mm.x.max) {
                return []
            }
            if (orginMaxy < mm.y.min || orginMiny > mm.y.max) {
                return []
            }
            if (orginMaxz < mm.z.min || orginMinz > mm.z.max) {
                return []
            }
            return endA
        } else {
            return []
        }
        // console.log(referent, convert)
    }
    static getMaxMin(value) {
        let pointA1 = BaseLine.getXYZ(value.lt)
        let pointA2 = BaseLine.getXYZ(value.rt)
        let pointA3 = BaseLine.getXYZ(value.lb)
        let pointA4 = BaseLine.getXYZ(value.rb)
        let obj = {}
        for (var i in pointA1) {
            obj[i] = {}
            obj[i].max = Math.max(pointA1[i], pointA2[i], pointA3[i], pointA4[i])
            obj[i].min = Math.min(pointA1[i], pointA2[i], pointA3[i], pointA4[i])
        }
        return obj
    }
    static getlineIntersection(line, a, b, c, d) {
        let x1 = line.x[0]
        let x2 = line.x[1]
        let y1 = line.y[0]
        let y2 = line.y[1]
        let z1 = line.z[0]
        let z2 = line.z[1]
        let t = (a * x1 + b * y1 + c * z1 + d) / (a * x2 + b * y2 + c * z2)
        let x = x1 - x2 * t
        let y = y1 - y2 * t
        let z = z1 - z2 * t
        return { x: x, y: y, z: z }
    }
    static getfourline(value) {
        let pointA1 = BaseLine.getXYZ(value.lt)
        let pointA2 = BaseLine.getXYZ(value.rt)
        let pointA3 = BaseLine.getXYZ(value.lb)
        let pointA4 = BaseLine.getXYZ(value.rb)
        let line1 = BaseLine.getlineEquation(pointA1, pointA2)
        let line2 = BaseLine.getlineEquation(pointA2, pointA4)
        let line3 = BaseLine.getlineEquation(pointA4, pointA3)
        let line4 = BaseLine.getlineEquation(pointA3, pointA1)
        return { l1: line1, l2: line2, l3: line3, l4: line4 }
    }
    static getlineEquation(value, value1) {
        return { x: [value.x, value1.x - value.x], y: [value.y, value1.y - value.y], z: [value.z, value1.z - value.z] }
    }
    static getPoint(value) {
        let metixAll = BaseLine.makeMetix(value)
        //console.log(metixAll)
        let point1 = [
            [0, 0, 1]
        ]
        let point2 = [
            [value.width, 0, 1]
        ]
        let point3 = [
            [value.width, value.height, 1]
        ]
        let point4 = [
            [0, value.height, 1]
        ]
        let pointAll = { lt: metixAll.multiply(point1).orgin, rt: metixAll.multiply(point2).orgin, lb: metixAll.multiply(point4).orgin, rb: metixAll.multiply(point3).orgin }
        // console.log(pointAll)
        let pointA1 = BaseLine.getXYZ(pointAll.lt)
        let pointA2 = BaseLine.getXYZ(pointAll.rt)
        let pointA3 = BaseLine.getXYZ(pointAll.lb)
        let a = pointA1.y * (pointA2.z - pointA3.z) + pointA2.y * (pointA3.z - pointA1.z) + pointA3.y * (pointA1.z - pointA2.z)
        let b = pointA1.z * (pointA2.x - pointA3.x) + pointA2.z * (pointA3.x - pointA1.x) + pointA3.z * (pointA1.x - pointA2.x)
        let c = pointA1.x * (pointA2.y - pointA3.y) + pointA2.x * (pointA3.y - pointA1.y) + pointA3.x * (pointA1.y - pointA2.y)
        let d = -pointA1.x * (pointA2.y * pointA3.z - pointA3.y * pointA2.z) - pointA2.x * (pointA3.y * pointA1.z - pointA1.y * pointA3.z) - pointA3.x * (pointA1.y * pointA2.z - pointA2.y * pointA1.z)
        return { a: a, b: b, c: c, d: d, pointAll: pointAll }
    }
    static getXYZ(value) {
        return { x: value[0][0], y: value[1][0], z: value[2][0] }
    }
    static makeMetix(value) {
        let iop = value.imageOrientationPatient
        let ipp = value.imagePositionPatient.split(',')
        let sp = value.pixelSpacing.split(',')
        return new Metix([iop[0] * sp[0], iop[3] * sp[0], ipp[0], iop[1] * sp[0], iop[4] * sp[0], ipp[1], iop[2] * sp[0], iop[5] * sp[0], ipp[2]], 3, 3)
    }

    static backImageOrientationPatient(value) {
        let imageOrientationPatient = value.split(',')
        for (let i = 0; i < imageOrientationPatient.length; i++) {
            imageOrientationPatient[i] = Math.floor(imageOrientationPatient[i] * 2000) / 2000
        }

        return imageOrientationPatient
    }

}
module.exports = BaseLine;
// let data = {
//     referent: {
//         imageOrientationPatient: "1, -0, 0, 0, 0, -1",
//         imagePositionPatient: "-265.000,0.000,60.000",
//         pixelSpacing: "0.545455,0.596847",
//         width: 660,
//         height: 888,
//     },
//     convert: {
//         imageOrientationPatient:'1, 0, 0, 0, 1, 0',
//         imagePositionPatient: "-183.800,-190.000,43.000",
//         pixelSpacing: "0.742188,0.742188",
//         width: 512,
//         height: 512
//     }
// }
/*let data = {
    referent: {
        imageOrientationPatient: "0.67233121643055,0.74025045451727,-9.935707e-009,0.02191119899741,-0.019900822643,-0.9995618323129",
        imagePositionPatient: "-68.262459611871,-80.653947034019,151.60720667862",
        pixelSpacing: "0.6875,0.6875",
        width: 320,
        height: 320,
    },
    convert: {
        imageOrientationPatient: "2.506e-012,1,-2.05088e-010,0.01221696318555,-2.05103e-010,-0.9999253701205",
        imagePositionPatient: "-28.008708762154,-130.06024071991,165.21970708543",
        pixelSpacing: "0.48828125,0.48828125",
        width: 512,
        height: 512,
        direction: 2,
        distance: -5,
        total: 56
    }
}*/
// console.log(new BaseLine(data))