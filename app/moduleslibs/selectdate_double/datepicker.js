// Map dependencies from above array.
function datapicker(opt) {
    // Default View.
    var DatePicker = {
        data: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        row: 0,
        model: opt.model,
        /*
         * model
         * 1. monday ... sunday
         * 2. sunday monday ... sa
         */
        dataArray: [],
        //data='2014-1'
        init: function(data) {
            var temp = data.split('-')
            if (Math.floor(temp[0] % 4) == 0) {
                this.data[1] = 29
            } else {
                this.data[1] = 28
            }
            this.dataArray = []
            var tempT = []
            var hang = 0
                //var nowDate = new Date().getFullYear() + "-" + (1 * new Date().getMonth() + 1) + "-" + new Date().getDate()
            var nowDate = data
            if (nowDate.split('-')[2] * 1) {
                nowDate = nowDate.split('-')[0] + '-' + nowDate.split('-')[1] * 1 + '-' + nowDate.split('-')[2] * 1
            } else {
                nowDate = nowDate.split('-')[0] + '-' + nowDate.split('-')[1] * 1
            }
            //console.log(nowDate)
            for (var i = 0; i < this.data[(temp[1] - 1)]; i++) {
                var tempData = new Date(temp[0], (temp[1] - 1) * 1, (i * 1 + 1))
                this.dataArray[i] = {}
                this.dataArray[i].nowDay = false
                if (nowDate == temp[0] + "-" + temp[1] * 1 + '-' + (i * 1 + 1)) {
                    //console.log('temp', nowDate);
                    this.dataArray[i].nowDay = true
                }
                if (this.model == '1') {
                    // console.log('aaaa')
                    this.dataArray[i].week = tempData.getDay() == 0 ? 7 : tempData.getDay()
                    if (Number(tempData.getDay()) == 1 && i != 0) {
                        hang++
                    }
                } else {
                    this.dataArray[i].week = tempData.getDay()
                    if (Number(tempData.getDay()) == 0 && i != 0) {
                        hang++
                    }
                }
                this.dataArray[i].day = tempData.getDate()

                this.dataArray[i].row = hang
            }
            if (this.model == '1') {

            } else {
                var qibutotal = 0
                qibutotal = hang == 3 ? 7 : 0
                    //console.log(this.dataArray[0],'dsjakjadjjdksljdklj')
                qibutotal += (this.dataArray[0].week == 0 ? 7 : this.dataArray[0].week)
                var firstyaer = temp[1] - 2 < 0 ? temp[0] - 1 : temp[0]
                var firstMouth = temp[1] - 2 < 0 ? 11 : temp[1] - 2
                var xin = []
                for (var j = 0; j < qibutotal; j++) {
                    xin[j] = {}
                    var tempData = new Date(firstyaer, firstMouth, this.data[firstMouth] - (qibutotal - 1) + j)
                    xin[j].week = tempData.getDay()
                    xin[j].day = tempData.getDate()
                        //this.data[(temp[1] - 1)]
                }
                var end = []
                var endyaer = temp[1] >= 12 ? temp[0] + 1 : temp[0]
                var endMouth = temp[1] >= 12 ? 1 : temp[1]
                var qibutotal1 = 42 - qibutotal - this.dataArray.length
                    //qibutotal1 = hang ==4 ? 7 : 0
                    //qibutotal1 += 6 - this.dataArray[this.dataArray.length-1].week
                for (var k = 0; k < qibutotal1; k++) {
                    end[k] = {}
                    var tempData1 = new Date(endyaer, endMouth, (k + 1))
                    end[k].week = tempData1.getDay()
                    end[k].day = tempData1.getDate()
                        //this.data[(temp[1] - 1)]
                }
            }
            //console.log(end)
            var newDataArry = []
            newDataArry = newDataArry.concat(xin, this.dataArray, end)
            this.dataArray = newDataArry
            this.row = hang
        },
        changeData: function(data) {
            this.init(data)
        },
        getDatePicker: function() {
            return {
                data: this.dataArray,
                row: this.row
            }
        }
    }
    DatePicker.init(opt.data)
        // Return the module for AMD compliance.
    return DatePicker;

};
module.exports = datapicker;