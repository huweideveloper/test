onmessage = function(event) {
    console.log(event.data)
    let color = event.data.color
    let width = event.data.width
    let height = event.data.height
    let fillSt = event.data.fillSt
    let data=event.data.imgData.data
    let clone = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < data.length / 4; i++) {
        if (data[i * 4 + 3] != 0) {
            data[i * 4] = color[0]
            data[i * 4 + 1] = color[1]
            data[i * 4 + 2] = color[2]
            if (fillSt == false) {
                let boud = fourpd(i, clone, width, height)
                    //console.log(boud)
                if (boud) {
                    data[i * 4 + 3] = color[3]
                } else {
                    data[i * 4 + 3] = 0
                }
            } else {
                data[i * 4 + 3] = color[3]
            }
        }
    }
    clone = null
    postMessage({
        imgData: event.data.imgData
    })
    event.data.imgData = null

    function fourpd(point, imageData, width, height) {
        let up = Math.floor((point - width) / width)
        let right = (point % width) == (width - 1) ? null : (point + 1)
        let left = (point % width) == 0 ? null : point - 1
        let down = Math.floor((point + width) / width)
        let num = 0
            //console.log(up, right, left, down)
        if (up >= 0) {
            if (imageData[(point - width) * 4 + 3] != 0) {
                num++
            }
        }
        if (down < height) {
            if (imageData[(point + width) * 4 + 3] != 0) {
                num++
            }
        }
        if (right != null) {
            if (imageData[right * 4 + 3] != 0) {
                num++
            }
        }
        if (left != null) {
            if (imageData[left * 4 + 3] != 0) {
                num++
            }
        }
        //console.log(num)
        return (num == 4 ? false : true)
    }
    //postMessage(result);
};