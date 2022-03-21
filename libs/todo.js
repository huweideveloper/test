;(function() {
  var wordcode = "v0.1"
  var libversion = "v1.0"
  var storage = window.localStorage
  var languageaa = false
  //if (storage.getItem('language_version') != wordcode) {
  ajax({
    url: "language_v1.0.json?t=" + new Date().getTime(),
    type: "get",
    dataType: "json",
    success: function(response) {
      storage.setItem("language", JSON.stringify(response))
      languageaa = true
      addMian()
    }
  })
  storage.setItem("language_version", wordcode)
  //}

  var lib_obj = {
    cornerstone: {
      key: "cornerstone",
      url: "/libs/cornerstone/cornerstone.min.js",
      name: "cornerstone",
      st: false
    },
    cornerstoneMath: {
      key: "cornerstoneMath",
      url: "/libs/cornerstone/cornerstoneMath.min6.js",
      name: "cornerstoneMath",
      st: false
    },
    cornerstoneTools: {
      key: "cornerstoneTools",
      url: "/libs/cornerstone/untitled.js",
      name: "cornerstoneTools",
      st: false
    },
    dicomParser: {
      key: "dicomParser",
      url: "/libs/cornerstone/dicomParser.min.js",
      name: "dicomParser",
      st: false
    },
    cornerstoneWADOImageLoader: {
      key: "cornerstoneWADOImageLoader",
      url: "/libs/cornerstone/cornerstoneWADOImageLoader.js",
      name: "cornerstoneWADOImageLoader",
      st: false
    }
  }
  if (getBroswer().broswer == "IE") {
    var oScript = document.createElement("script")
    oScript.type = "text/javascript"
    oScript.src = lib_obj["dicomParser"].url
    document.body.appendChild(oScript)
    delete lib_obj["dicomParser"]
  }
  if (storage.getItem("lib_version") != libversion) {
    for (var i in lib_obj) {
      addLib(lib_obj[i])
    }
    storage.setItem("lib_version", libversion)
  } else {
    for (var i in lib_obj) {
      if (!storage.getItem(lib_obj[i].name)) {
        addLib(lib_obj[i])
      } else {
        lib_obj[i].st = true
        eval(storage.getItem(lib_obj[i].name))
        addMian()
      }
    }
  }

  function ajax(options) {
    var xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP")
    var opt = {
      type: options.type || "get",
      url: options.url || "",
      async: options.async == false ? false : true,
      dataType: options.dataType || "json",
      questring: JSON.stringify(options.questring) || "",
      contentType: options.contentType || "application/x-www-form-urlencoded",
      callback: options.success
    }
    xhr.open(opt.type, opt.url, opt.async)
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText) {
            if (opt.dataType === "json") {
              var data = JSON.parse(xhr.responseText)
            } else {
              var data = xhr.responseText
            }
            opt.callback(data) //resolve(data);
          } else {
            //reject(new Error('no data'));
          }
        } else {
          //reject(new Error(xhr.status || 'Server is fail.'));
        }
      }
    }
    xhr.onerror = function() {
      //reject(new Error(xhr.status || 'Server is fail.'));
    }
    xhr.setRequestHeader("Content-type", opt.contentType)
    xhr.send(opt.questring)
  }

  function addLib(value) {
    var jsname = value.name
    ajax({
      url: value.url,
      type: "get",
      dataType: "text",
      success: function(response) {
        storage.setItem(jsname, response)
        lib_obj[jsname].st = true
        eval(response)
        addMian()
      }
    })
  }

  function addMian() {
    for (var i in lib_obj) {
      if (!lib_obj[i].st) {
        return
      }
    }
    if (!languageaa) {
      return
    }
    var oScript = document.createElement("script")
    oScript.type = "text/javascript"
    oScript.src = "dev/main.js?" + new Date().getTime()
    document.body.appendChild(oScript)
  }

  function getBroswer() {
    var sys = {}
    var ua = navigator.userAgent.toLowerCase()
    var s
    ;(s = ua.match(/edge\/([\d.]+)/))
      ? (sys.edge = s[1])
      : (s = ua.match(/rv:([\d.]+)\) like gecko/))
      ? (sys.ie = s[1])
      : (s = ua.match(/msie ([\d.]+)/))
      ? (sys.ie = s[1])
      : (s = ua.match(/firefox\/([\d.]+)/))
      ? (sys.firefox = s[1])
      : (s = ua.match(/chrome\/([\d.]+)/))
      ? (sys.chrome = s[1])
      : (s = ua.match(/opera.([\d.]+)/))
      ? (sys.opera = s[1])
      : (s = ua.match(/version\/([\d.]+).*safari/))
      ? (sys.safari = s[1])
      : 0
    if (sys.edge) return { broswer: "Edge", version: sys.edge }
    if (sys.ie) return { broswer: "IE", version: sys.ie }
    if (sys.firefox) return { broswer: "Firefox", version: sys.firefox }
    if (sys.chrome) return { broswer: "Chrome", version: sys.chrome }
    if (sys.opera) return { broswer: "Opera", version: sys.opera }
    if (sys.safari) return { broswer: "Safari", version: sys.safari }
    return { broswer: "", version: "0" }
  }
})()
