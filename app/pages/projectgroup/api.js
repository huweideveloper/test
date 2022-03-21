import axios from '@utils/request'

const api = {
    baseUrl() {
      return `${this.app.domain1}v1`
    },
    createProjectGroup(data) {
      return axios.post(`${this.baseUrl()}/group/create`, data)
    },
    deleteProjectGroup(data) {
      return axios.post(`${this.baseUrl()}/group/delete`, data)
    },
    editProjectGroup(data) {
      return axios.post(`${this.baseUrl()}/group/edit`, data)
    },
    queryProjectGroupList(data) {
      return axios.post(`${this.baseUrl()}/group/search`, data)
    }
}

module.exports = api
