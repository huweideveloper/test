import { generateRequestFn, generateGetRequestFn } from '@/api/common.api'

const urlDict = {
  // 第一步相关
  projectdetail: '/project/basic/read', // 查看项目信息
  isrepeat: '/project/name/exist', // 项目名称是否存在
}
const urlGetDict = {
  // 第二步相关
  queryAnnoList: '/image/anno/list' // 获取所有的病灶类型
}

const fn = generateRequestFn(urlDict)
const fn1 = generateGetRequestFn(urlGetDict)
export default { ...fn, ...fn1 }
