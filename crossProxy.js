
var liveServer = require("live-server");
 
var params = {
    proxy:[['/aaa','http://bzapi.dev.proxima-ai.com']]
}
liveServer.start(params)
console.log("启动成功")