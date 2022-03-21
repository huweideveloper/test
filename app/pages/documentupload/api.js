import { domain1, generateRequestFn } from '@/api/common.api'

const urlDict = {
  queryFileListPage: '/anno/file/search', // 分页查询列表
  deleteBizFileById: '/anno/file/deleteBizFileById', // 删除
  uploadProjectBizFile: '/anno/file/projectBizFileUpload', // 上传
  updateJyBizFileResource: '/anno/file/updateJyBizFileResource', // 修改文档名称
}

const fn = {
  ...generateRequestFn(urlDict),
  // 返回上传文件地址
  fileUploadUrl: function(value) {
    return `${domain1}/v1${urlDict.uploadProjectBizFile}`
  },
  // 文件下载地址
  fileDownloadUrl: function(value) {
    return `${domain1}/v1/anno/file/attachment/downloadFiles`
  }
}
export default fn
