export const domain1 = '/aaa'
import axios from '@utils/request'

const urlDict = {
  queryProjectBasicInfo: '/project/basic/read', // 查询项目基本信息
  groupSearch: '/group/search', // 项目群组
  dictChildQuery: '/dict/child/query', // 获取query接口获取基础数据
  querySysInfo: '/sys/info', // 查询任务配置信息
  queryVendorList: '/vendor/query', // 查询集团列表（所属单位）

  projectNamePageSearch: '/project/name/page/search', // 根据名称查询项目
  taskNamePageSearch: '/task/name/page/search', // 根据任务名称查询任务/page
  queryFormComponentList: '/formComponent/search',
  queryDoctorList: '/user/task/user/list', // 查询医生列表
  queryFileList: '/anno/file/queryList',  // 查询所有说明文档
}
const commonApi = generateRequestFn(urlDict)

// 根据枚举查询列表
commonApi.queryTypeEnumList = (params) => {
  return axios.post(`${domain1}/v1` + '/common/queryTypeEnumList', {}, { params })
}
export default commonApi

// 创建接口调用方法Post请求
export function generateRequestFn(urlDict) {
  const api = {}
  for (const key in urlDict) {
    api[key] = function(data, params) {
      return axios.post(`${domain1}/v1` + urlDict[key], data, { params })
    }
  }
  return api
}

// 创建接口调用方法Get请求
export function generateGetRequestFn(urlDict) {
  const api = {}
  for (const key in urlDict) {
    api[key] = function(data, params) {
      return axios.get(`${domain1}/v1` + urlDict[key], data, { params })
    }
  }
  return api
}

// 数据类型下拉列表
export const seriesImgFileTypeList = [
  { val: "非原始数据", idx: 1 },
  { val: "原始数据", idx: 2 },
  { val: "MPR", idx: 3 },
  { val: "动脉瘤", idx: 4 },
  { val: "肝肿瘤", idx: 5 },
  { val: "冠脉分割", idx: 6 },
  { val: "冠脉狭窄", idx: 7 },
  { val: "冠脉命名", idx: 8 }, // 也叫MASK跑算法
  { val: "随访配准", idx: 9 }, // 只有标注项目才有，算法项目没有这项
  { val: "脑血管分割", idx: 10 },
  { val: "冠脉斑块分割", idx: 11 },
  { val: "脑中线", idx: 12 },
  { val: "脑动脉瘤", idx: 13 },
  { val: "肺气道", idx: 14 },
  { val: "C端病理大图", idx: 15 },
  { val: "冠脉分岔点", idx: 16 },
  { val: "肋骨分割", idx: 17 }
]
