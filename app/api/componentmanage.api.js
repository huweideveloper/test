const urlDict = {
  querylist: '/formComponent/search',
  getdetails: '/formComponent/read',
  create: '/formComponent/create',
  update: '/formComponent/update',
  searchlabel: '/tag/search',
  createlabel: '/tag/create',
  formComponent_clone: '/formComponent/clone',
  formComponent_correction: '/ops/formComponent/correction',
}
var api = {
    querylist: function(value) {
      return this.HttpRequest.POST(urlDict.querylist, value)
    },
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
    },
    formComponent_clone: function(value) {
      return this.HttpRequest.POST(urlDict.formComponent_clone, value)
    },
    formComponent_correction: function(value) {
      return this.HttpRequest.POST(urlDict.formComponent_correction, value)
    }

}
module.exports = api;
