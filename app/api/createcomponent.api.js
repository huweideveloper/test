const urlDict = {
  getdetails: '/formComponent/read',
  create: '/formComponent/create',
  update: '/formComponent/update',
  searchlabel: '/tag/search',
  createlabel: '/tag/create'
}
var api = {
    getdetails: function(value) {
      return this.HttpRequest.POST(urlDict.getdetails, value)
    },
    create: function(value) {
      return this.HttpRequest.POST(urlDict.create, value)
    },
    update: function(value) {
      return this.HttpRequest.POST(urlDict.update, value)
    },
    searchlabel: function(value) {
      return this.HttpRequest.POST(urlDict.searchlabel, value)
    },
    createlabel: function(value) {
      return this.HttpRequest.POST(urlDict.createlabel, value)
    }
}
module.exports = api;
