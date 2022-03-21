var utils = {
		//  时间格式转化
		dateFormat: function (date) {
			var time = date.split('-')
			if (utils.LANG == 'zh-CN') {
				return time[0] + '年' + time[1] + '月' + time[2] + '日'
			}else {
				return date
			}
			
		}

}

window.utils = utils








