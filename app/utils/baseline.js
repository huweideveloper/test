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
        if(!data) return this

        data.referent.imageOrientationPatient = BaseLine.backImageOrientationPatient(data.referent.imageOrientationPatient)
        data.convert.imageOrientationPatient = BaseLine.backImageOrientationPatient(data.convert.imageOrientationPatient)
        //两套序列平行返回
        
        let referent = BaseLine.makeMetix(data.referent)
        //console.log(referent, 'referent')
        let convert = BaseLine.makeMetix(data.convert)
        //console.log(convert, 'convert')
        let change = new Metix([data.referent.x, data.referent.y, 1], 3, 1).transpose().orgin
        let nowXYZ = referent.multiply(change)
        /*if (data.convert.imageOrientationPatient.toString() == data.referent.imageOrientationPatient.toString()) {
            return convert.AInverse().multiply(nowXYZ.transpose().orgin)
        }*/
        // console.log(nowXYZ, 'nowXYZ')
        let convertF = BaseLine.getPoint(data.convert)
        // console.log(convertF)
        let dis = Math.abs(convertF.a * nowXYZ.orgin[0][0] + convertF.b * nowXYZ.orgin[1][0] + convertF.c * nowXYZ.orgin[2][0]+convertF.d) / Math.pow((convertF.a * convertF.a + convertF.b * convertF.b + convertF.c * convertF.c), 0.5)
        return { nowXYZ: nowXYZ, dis: dis, convertF: convertF, convert: convert }
        //console.log(convert.AInverse(),'AInverse')
        //let endpoint = convert.AInverse().multiply(nowXYZ.transpose().orgin)
        //console.log(endpoint)
        //return endpoint

    }
    getSagPoint(data) {
        if(!data.convert.AInverse()){
            let temp
            let endAll
            if(data.nowXYZ.orgin[0][0]==0){
                temp=new Metix([data.convert.orgin[1][0],data.convert.orgin[1][1],data.convert.orgin[2][0],data.convert.orgin[2][1]], 2, 2)
                endAll=temp.AInverse().multiply([
                    [data.nowXYZ.orgin[1][0]-data.convert.orgin[1][2],data.nowXYZ.orgin[2][0]-data.convert.orgin[2][2]]
                ])
            }
            if(data.nowXYZ.orgin[1][0]==0){
                temp=new Metix([data.convert.orgin[0][0],data.convert.orgin[0][1],data.convert.orgin[2][0],data.convert.orgin[2][1]], 2, 2)
                endAll=temp.AInverse().multiply([
                    [data.nowXYZ.orgin[0][0]-data.convert.orgin[0][2],data.nowXYZ.orgin[2][0]-data.convert.orgin[2][2]]
                ])
            }
            if(data.nowXYZ.orgin[2][0]==0){
                temp=new Metix([data.convert.orgin[0][0],data.convert.orgin[0][1],data.convert.orgin[1][0],data.convert.orgin[1][1]], 2, 2)
                endAll=temp.AInverse().multiply([
                    [data.nowXYZ.orgin[0][0]-data.convert.orgin[0][2],data.nowXYZ.orgin[1][0]-data.convert.orgin[1][2]]
                ])
            }
            if(endAll){
                let x= endAll.orgin[0][0]
                let y=endAll.orgin[1][0]
                return {x:x,y:y}
            }else {
                return null
            }

        }
        if (Math.floor(data.dis) == 0) {
            let orgin = data.convert.AInverse().multiply(data.nowXYZ.transpose().orgin)
            return { x: orgin.orgin[0] / orgin.orgin[2], y: orgin.orgin[1] / orgin.orgin[2] }
        } else {
            let allpoint = data.convertF.pointAll
            let pointA1 = BaseLine.getXYZ(allpoint.lt)
            let pointA2 = BaseLine.getXYZ(allpoint.rt)
            let pointA3 = BaseLine.getXYZ(allpoint.lb)
            let newMetix = new Metix([pointA2.x - pointA1.x, pointA2.y - pointA1.y, pointA2.z - pointA1.z, pointA3.x - pointA1.x, pointA3.y - pointA1.y, pointA3.z - pointA1.z, data.convertF.a/data.convertF.d, data.convertF.b/data.convertF.d, data.convertF.c/data.convertF.d], 3, 3)
            let x4 = data.nowXYZ.orgin[0][0]
            let y4 = data.nowXYZ.orgin[1][0]
            let z4 = data.nowXYZ.orgin[2][0]
            let x5 = x4 * (pointA2.x - pointA1.x) + y4 * (pointA2.y - pointA1.y) + z4 * (pointA2.z - pointA1.z)
            let y5 = x4 * (pointA3.x - pointA1.x) + y4 * (pointA3.y - pointA1.y) + z4 * (pointA3.z - pointA1.z)
            let nowXYZ = new Metix([x5, y5, -1], 3, 1)
            let endpoint =newMetix.AInverse().multiply(nowXYZ.transpose().orgin)
            let orgin = data.convert.AInverse().multiply(endpoint.transpose().orgin)
            // console.log(orgin)
            return { x: orgin.orgin[0] / orgin.orgin[2], y: orgin.orgin[1] / orgin.orgin[2] }
        }
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
    static backImageOrientationPatient(value) {
        let imageOrientationPatient = value.split(',')
        for (let i = 0; i < imageOrientationPatient.length; i++) {
            imageOrientationPatient[i] = Math.floor(imageOrientationPatient[i] * 2000) / 2000
        }

        return imageOrientationPatient
    }
    static makeMetix(value) {
        let iop = value.imageOrientationPatient
        let ipp = value.imagePositionPatient.split(',')
        let sp = value.pixelSpacing.split(',')
        return new Metix([iop[0] * sp[0], iop[3] * sp[0], ipp[0], iop[1] * sp[0], iop[4] * sp[0], ipp[1], iop[2] * sp[0], iop[5] * sp[0], ipp[2]], 3, 3)
    }

}

module.exports = BaseLine;
// let data = {
//     referent: {
//         imageOrientationPatient: "1,0,0,0,1,0",
//         imagePositionPatient: "-178.689453125,-335.189453125,113.5",
//         pixelSpacing: "0.62109375,0.62109375",
//         x: 10,
//         y: 10,
//         z: 1,
//     },
//     convert: {
//         imageOrientationPatient: "1,0,0,0,1,0",
//         imagePositionPatient: "-178.689453125,-335.189453125,113.5",
//         pixelSpacing: "0.62109375,0.62109375",
//         width: 512,
//         height: 512
//     }
// }
// console.log(new BaseLine(data))
