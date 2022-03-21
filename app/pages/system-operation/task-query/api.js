import { generateRequestFn, domain1 } from '@/api/common.api'
import axios from '@utils/request'

const urlDict = {
}
const fn = generateRequestFn(urlDict)

// 根据序列号查询任务，返回文件
fn.exportTaskBySeriesList = (data = {}, params = {}) => {
  return axios.post(`${domain1}/v1/task/series/query/export`, data, { params, responseType: 'blob' })
}

export default fn
