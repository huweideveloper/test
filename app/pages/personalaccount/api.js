import axios from '@utils/request'

const urlDict = {
  task_completed: '/user/task/completed',
  task_currentList: '/user/task/currentList'
}
const api = {
  baseUrl() {
    return `${this.app.domain1}v1`
  },
  taskCompleted(value) {
    return axios.post(this.baseUrl() + urlDict.task_completed, value)
  },
  taskCurrentList(value) {
    return axios.post(this.baseUrl() + urlDict.task_currentList, value)
  }
}
module.exports = api
