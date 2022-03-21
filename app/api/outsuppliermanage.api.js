const urlDict = {
  querysupplierlist: '/vendor/search',
  createsupplier: '/vendor/register',
  editsupplier: '/vendor/update',
  viewsupplier: '/vendor/read',
  createuser: '/user/register'
}
var api = {
    querysupplierlist: function(value) {
      return this.HttpRequest.POST(urlDict.querysupplierlist, value)
    },
    createsupplier: function(value) {
      return this.HttpRequest.POST(urlDict.createsupplier, value)
    },
    editsupplier: function(value) {
      return this.HttpRequest.POST(urlDict.editsupplier, value)
    },
    viewsupplier: function(value) {
      return this.HttpRequest.POST(urlDict.viewsupplier, value)
    },
    createuser: function(value) {
      return this.HttpRequest.POST(urlDict.createuser, value)
    }
}
module.exports = api;
