const urlDict = {
  querycomponent: '/component/query',
  getcomponentdetail: '/component/read',
  createproject: '/project/create',
  projectdetail: '/project/basic/read',
  getimage: '/series/search',
  gethospital: '/hospital/search',
  getmodality: '/series/modality/all',
  isrepeat: '/project/name/exist'
}
var api = {
    querycomponent: function(value) {
      return this.HttpRequest.POST(urlDict.querycomponent, value)
    },
    getcomponentdetail: function(value) {
      return this.HttpRequest.POST(urlDict.getcomponentdetail, value)
    },
    createproject: function(value) {
      return this.HttpRequest.POST(urlDict.createproject, value)
    },
    projectdetail: function(value) {
      return this.HttpRequest.POST(urlDict.projectdetail, value)
    },
    getimage: function(value) {
      return this.HttpRequest.POST(urlDict.getimage, value)
    },
    gethospital: function(value) {
      return this.HttpRequest.POST(urlDict.gethospital, value)
    },
    getmodality: function(value) {
      return this.HttpRequest.POST(urlDict.getmodality, value)
    },
    isrepeat: function(value) {
      return this.HttpRequest.POST(urlDict.isrepeat, value)
    }
}
module.exports = api;
