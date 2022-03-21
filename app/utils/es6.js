var es6 = {
  Deferred: function() {
    var promiseS = {}
    var tempPromise
    var callBackFun
    promiseS.resolve = function(value) {
      tempPromise = new Promise(function(resolve, reject) {
        if (value) {
          resolve(value)
        }
      })
      tempPromise.then(function(value) {
        doneBackFun(value)
      })
    }
    promiseS.reject = function(err) {
      tempPromise = new Promise(function(resolve, reject) {
        if (err) {
          reject(err)
        }
      })
      tempPromise.then(function(value) {
        doneBackFun(value)
      })
    }
    promiseS.then = promiseS.done = function(callback) {
      callBackFun = callback
    }

    function doneBackFun(param) {
      if (typeof callBackFun == "function") {
        callBackFun(param)
        tempPromise = null
      }
    }
    return promiseS
  },
  /*
    垃圾代码，新需求不要用，http请求请使用http.js文件
  */
  ajax: function(options) {
    var xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP")
    var opt = {
      type: options.type || "get",
      url: options.url || "",

      async: options.async == false ? false : true,
      dataType: options.dataType || "json",
      questring: options.questring || "",
      contentType: options.contentType || "application/x-www-form-urlencoded"
    }
    var str = ""
    if (
      opt.contentType.lastIndexOf("application/x-www-form-urlencoded") != -1
    ) {
      for (let i in options.questring) {
        str += i + "=" + options.questring[i] + "&"
      }
      opt.questring = str.replace(/&$/g, "")
    }
    if (options.type == "get" || options.type == "GET") {
      if (typeof opt.questring == "string") {
        if (opt.questring) {
          opt.questring = opt.questring
            .replace(/{/g, "")
            .replace(/}/g, "")
            .replace(/:/g, "=")
          opt.url = opt.url + "?" + opt.questring
        }
      } else {
        for (let i in options.questring) {
          str += i + "=" + options.questring[i] + "&"
        }
        opt.url = opt.url + "?" + str.replace(/&$/g, "")
      }
    } else {
      if (opt.questring) {
        opt.questring = JSON.stringify(opt.questring)
      }
    }

    return new Promise((resolve, reject) => {
      xhr.open(opt.type, opt.url, opt.async)
      xhr.onreadystatechange = function() {
        // loadingHide
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (xhr.responseText) {
              if (opt.dataType === "json") {
                var data = JSON.parse(xhr.responseText)
              } else {
                var data = xhr.responseText
              }
              // if (afterAjxIntercept(data))
              resolve(data)
            } else {
              reject(new Error("no data"))
            }
          } else {
            reject(new Error(xhr.status || "Server is fail."))
          }
        }
      }
      xhr.onerror = function() {
        // loadingHide
        reject(new Error(xhr.status || "Server is fail."))
      }
      if (window.localStorage.accessToken) {
        xhr.setRequestHeader("accessToken", window.localStorage.accessToken)
      }
      xhr.setRequestHeader("Content-type", opt.contentType)
      xhr.send(opt.questring)
    })
  },

  getBroswer: function() {
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
    if (sys.edge)
      return {
        broswer: "Edge",
        version: sys.edge
      }
    if (sys.ie)
      return {
        broswer: "IE",
        version: sys.ie
      }
    if (sys.firefox)
      return {
        broswer: "Firefox",
        version: sys.firefox
      }
    if (sys.chrome)
      return {
        broswer: "Chrome",
        version: sys.chrome
      }
    if (sys.opera)
      return {
        broswer: "Opera",
        version: sys.opera
      }
    if (sys.safari)
      return {
        broswer: "Safari",
        version: sys.safari
      }
    return {
      broswer: "",
      version: "0"
    }
  },
  eventPool: [],
  screenWH: function() {
    return {
      screenwidth: window.screen.width,
      screenheight: window.screen.height
    }
  },
  selctorDoc: function(selctor, parent) {
    var domname = selctor
    var eventA = {}
    var query = {}

    function findDom(name, doc) {
      if (doc) {
        return doc.querySelectorAll(name)
      } else {
        return []
      }
    }

    function parentE(element) {
      return element.parentNode
    }

    function addEvent(element, e, fn) {
      if (typeof fn == "function" && element) {
        let hascodeD = hashCode(element.outerHTML)
        //console.log(element)
        ES.eventPool.push({
          e: element,
          type: e,
          fn: fn
        })
        if (element.addEventListener) {
          element.addEventListener(e, fn, false)
        } else {
          element.attachEvent("on" + e, fn)
        }
      }
    }

    function removeEvent(element, e) {
      //console.log(element,e,eventPool)
      if (element) {
        for (var j = 0; j < ES.eventPool.length; j++) {
          //console.log(eventPool[j],e,"=================")
          if (ES.eventPool[j]) {
            if (ES.eventPool[j].e == element && ES.eventPool[j].type == e) {
              //console.log(element,e,"=================")
              if (element.addEventListener) {
                element.removeEventListener(
                  ES.eventPool[j].type,
                  ES.eventPool[j].fn,
                  false
                )
              } else {
                element.detachEvent(
                  "on" + ES.eventPool[j].type,
                  ES.eventPool[j].fn
                )
              }
              ES.eventPool[j] = null
            }
          }
        }
        ES.eventPool.filter(d => d)
      }
    }

    function setAllBox(element) {
      var tempNode = element
      if (tempNode == window) {
        tempNode = document.documentElement
      }
      if (tempNode == document) {
        tempNode = document.body
      }
      if (element) {
        return {
          clientWidth: tempNode.clientWidth, //元素的可见高度
          clientHeight: tempNode.clientHeight, //元素的可见宽度
          offsetHeight: tempNode.offsetHeight, //元素的高度
          offsetWidth: tempNode.offsetWidth, //元素的宽度
          offsetLeft: tempNode.offsetLeft, //元素的水平偏移位置
          offsetParent: tempNode.offsetParent, //元素的偏移容器
          offsetTop: tempNode.offsetTop, //元素的垂直偏移位置
          scrollHeight: tempNode.scrollHeight, //元素的整体高度
          scrollLeft: tempNode.scrollLeft, //元素左边缘与视图之间的距离
          scrollTop: tempNode.scrollTop, //元素上边缘与视图之间的距离
          scrollWidth: tempNode.scrollWidth //元素的整体宽度
        }
      } else {
        return {
          clientWidth: 0, //元素的可见高度
          clientHeight: 0, //元素的可见宽度
          offsetHeight: 0, //元素的高度
          offsetWidth: 0, //元素的宽度
          offsetLeft: 0, //元素的水平偏移位置
          offsetParent: 0, //元素的偏移容器
          offsetTop: 0, //元素的垂直偏移位置
          scrollHeight: 0, //元素的整体高度
          scrollLeft: 0, //元素左边缘与视图之间的距离
          scrollTop: 0, //元素上边缘与视图之间的距离
          scrollWidth: 0 //元素的整体宽度
        }
      }
    }
    //将html转化为hascode
    function hashCode(strKey) {
      if (!strKey) {
        return null
      }
      var hash = 0
      for (var i = 0; i < strKey.length; i++) {
        hash = hash * 31 + strKey.charCodeAt(i)
        hash = intValue(hash)
      }
      return hash
    }

    function intValue(num) {
      var MAX_VALUE = 0x7fffffff
      var MIN_VALUE = -0x80000000
      if (num > MAX_VALUE || num < MIN_VALUE) {
        return (num &= 0xffffffff)
      }
      return num
    }
    //-----------------
    function domCollect(dom) {
      if (dom == window) {
        return [
          {
            dom: dom.document.body
          }
        ]
      }
      if (dom == document) {
        return [
          {
            dom: dom
          }
        ]
      }
      // console.log(dom)
      if (!dom) {
        return [
          {
            dom: null
          }
        ]
      }
      if (dom.length == undefined || dom.length == null) {
        return [
          {
            dom: dom
          }
        ]
      }
      if (dom.toString().lastIndexOf("HTML") != -1) {
        return [
          {
            dom: dom
          }
        ]
      }

      return dom
    }

    function cloneNode(value) {
      if (typeof value == "string") {
        let tempDIV = document.createElement("div")
        tempDIV.innerHTML = value
        let cloneO = tempDIV.cloneNode(true).childNodes
        return [...cloneO]
      }
      return null
    }

    function changeToQueryObject(nodeList) {
      var tempArray = [...nodeList]
      var returnArray = []
      tempArray.map(function(item) {
        returnArray.push(ES.selctorDoc(item))
      })
      return returnArray
    }

    function deepClone(obj) {
      var proto = Object.getPrototypeOf(obj)
      return Object.assign({}, Object.create(proto), obj)
    }

    function translate(value) {
      if (typeof value == "string") {
        if (value.lastIndexOf("left") != -1) {
          return value.replace("-l", "L")
        }
        if (value.lastIndexOf("top") != -1) {
          return value.replace("-t", "T")
        }
        if (value.lastIndexOf("right") != -1) {
          return value.replace("-r", "R")
        }
        if (value.lastIndexOf("bottom") != -1) {
          return value.replace("-b", "B")
        }
        return value
      }
      return value
    }

    function getNextparent(dom, tempNode, className) {
      let pnode = parentE(dom)
      //console.log(pnode)
      if (pnode) {
        if (className) {
          if (ES.selctorDoc(pnode).hasClass(className)) {
            tempNode.push(ES.selctorDoc(pnode))
          }
        } else {
          tempNode.push(ES.selctorDoc(pnode))
        }
        getNextparent(ES.selctorDoc(pnode).dom, tempNode, className)
      }
    }
    //--------------------------------------------------------------
    //---------------------------共有函数---------------------------
    query.init = function(name, doc) {
      var array = []
      if (typeof domname === "string") {
        var nameArray = domname.split(" ")
        var parentDom = doc ? doc : document
        var dom = findDom(domname, parentDom)
        array = changeToQueryObject(dom)
        return array
      }
    }
    //---------------------------dom节点查找---------------------------
    query.find = function(name) {
      var tempNodeList
      var tempDom = domCollect(this.dom)
      tempDom.map(function(item) {
        var nodeList = findDom(name, item.dom)
        if (nodeList.length) {
          if (!tempNodeList) {
            tempNodeList = changeToQueryObject(nodeList)
          } else {
            tempNodeList = tempNodeList.concat(changeToQueryObject(nodeList))
          }
        }
      })
      var obj = deepClone(this)
      obj.dom = tempNodeList
      return obj
    }
    query.parent = function() {
      if (this.dom == document || this.dom == window) {
      } else {
        let tempNode = []
        let dom = domCollect(this.dom)
        dom.map(function(item) {
          let pnode = parentE(item.dom)
          //console.log(pnode)
          if (pnode) {
            tempNode.push(ES.selctorDoc(pnode))
          }
        })
        var obj = deepClone(this)
        obj.dom = tempNode
        return obj
      }
    }
    query.parents = function(className) {
      if (this.dom == document || this.dom == window) {
      } else {
        let tempNode = []
        let dom = domCollect(this.dom)
        dom.map(function(item) {
          getNextparent(item.dom, tempNode, className)
        })
        /*dom.map(function(item) {
          let pnode = parentE(item.dom)
          //console.log(pnode)
          if (pnode) {
            tempNode.push(ES.selctorDoc(pnode))
          }
        })*/
        var obj = deepClone(this)
        obj.dom = tempNode
        return obj
      }
    }
    query.eq = function(index) {
      let dom = domCollect(this.dom)
      var obj = deepClone(this)
      if (index < 0) {
        obj.dom = [dom[dom.length + index]]
      } else {
        obj.dom = [dom[index]]
      }
      return obj
    }
    query.firstchildren = function(name) {
      var tempNodeList = []
      var tempDom = domCollect(this.dom)
      //console.log(tempDom)
      tempDom.map(function(item) {
        var nodeList = item.dom.querySelector(name)
        if (nodeList) {
          tempNodeList.push(ES.selctorDoc(nodeList))
        }
      })
      var obj = deepClone(this)
      obj.dom = tempNodeList
      return obj
    }
    //---------------------------属性---------------------------
    query.attr = function(attrName, value) {
      if (this.dom == document || this.dom == window) {
        var tempDom =
          this.dom == window ? this.dom.document.body : this.dom.body
        if (value != undefined && value != null) {
          tempDom.setAttribute(attrName, value)
        } else {
          return tempDom.getAttribute(attrName)
        }
      } else {
        var tempDom = domCollect(this.dom)
        if (value != undefined && value != null) {
          var tempDom = domCollect(this.dom)
          tempDom.map(function(item) {
            item.dom.setAttribute(attrName, value)
          })
        } else {
          const oneDom = tempDom[tempDom.length - 1].dom
          if (oneDom && typeof oneDom.getAttribute === "function") {
            return oneDom.getAttribute(attrName)
          }
        }
      }
    }
    query.removeAttr = function(attrName) {
      if (this.dom == document || this.dom == window) {
        var tempDom =
          this.dom == window ? this.dom.document.body : this.dom.body
        tempDom.removeAttribute(attrName)
      } else {
        let tempDom = domCollect(this.dom)
        tempDom.map(function(item) {
          item.dom.removeAttribute(attrName)
        })
      }
    }
    query.val = function(value) {
      if (this.dom != window && this.dom != document) {
        if (value != null && value != undefined) {
          if (this.dom.length) {
            this.dom.map(function(item) {
              item.dom.value = value
            })
          } else {
            this.dom.value = value
          }
        } else {
          let tempDom = domCollect(this.dom)
          var dom = tempDom[tempDom.length - 1].dom
          if (dom.selectedIndex || dom.selectedIndex == 0) {
            let index = dom.selectedIndex
            return dom.options[index].value
              ? dom.options[index].value
              : dom.options[index].text
          }
          return tempDom[tempDom.length - 1].dom.value
        }
      }
    }
    query.box = function() {
      if (this.dom != window && this.dom != document) {
        var dom = domCollect(this.dom)
        if (dom && dom[dom.length - 1]) {
          return setAllBox(dom[dom.length - 1].dom)
        } else {
          return setAllBox()
        }
      } else {
        return setAllBox(this.dom)
      }
    }
    query.hide = function() {
      var dom = domCollect(this.dom)
      dom.map(function(item) {
        if (item.dom) {
          item.dom.style.display = "none"
        }
      })
    }
    query.show = function() {
      var dom = domCollect(this.dom)
      dom.map(function(item) {
        if (item.dom) {
          item.dom.style.display = "block"
        }
      })
    }
    //---------------------------样式---------------------------
    query.addClass = function(className) {
      if (this.dom == document || this.dom == window) {
        var tempDom =
          this.dom == window ? this.dom.document.body : this.dom.body
        var nowName = tempdom.className ? tempdom.className : ""
        nowName += " " + className
        tempdom.setAttribute("class", nowName)
      } else {
        let tempDom = domCollect(this.dom)
        tempDom.map(function(item) {
          if (item.dom) {
            var nowName = item.dom.className ? item.dom.className : ""
            nowName = nowName ? nowName : ""
            nowName += " " + className
            item.dom.setAttribute("class", nowName)
          }
        })
      }
    }
    query.removeClass = function(className) {
      if (this.dom == document || this.dom == window) {
        var tempDom =
          this.dom == window ? this.dom.document.body : this.dom.body
        var nowName = tempDom.getAttribute("class")
          ? " " + tempDom.getAttribute("class") + " "
          : ""
        var patt1 = new RegExp(" " + className + " ", "g")
        nowName = nowName
          .replace(/ /g, "  ")
          .replace(patt1, " ")
          .replace(/  /g, " ")
        tempDom.setAttribute("class", nowName)
      } else {
        let tempDom = domCollect(this.dom)
        tempDom.map(function(item) {
          if (item.dom) {
            var nowName = item.dom.getAttribute("class")
              ? " " + item.dom.getAttribute("class") + " "
              : ""
            var patt1 = new RegExp(" " + className + " ", "g")
            nowName = nowName
              .replace(/ /g, "  ")
              .replace(patt1, " ")
              .replace(/  /g, " ")
            item.dom.setAttribute("class", nowName)
          }
        })
      }
    }
    query.hasClass = function(className) {
      let tempDom
      let nowName
      if (this.dom == document || this.dom == window) {
        tempDom = this.dom == window ? this.dom.document.body : this.dom.body
      } else {
        let tempDDom = domCollect(this.dom)
        tempDom = tempDDom[tempDDom.length - 1].dom
      }
      nowName = tempDom.className ? " " + tempDom.className + " " : ""
      if (nowName) {
        if (nowName.lastIndexOf(" " + className + " ") != -1) {
          return true
        }
      }
      return false
    }
    query.css = function(value) {
      if (typeof value == "object" && !value.length) {
        let dom = domCollect(this.dom)
        dom.map(function(item) {
          if (item.dom) {
            for (let i in value) {
              let data = value[i]
              if (typeof value[i] != "string" && i != "opacity") {
                data = value[i] + "px"
              }
              i = translate(i)
              //console.log(item.dom.style)
              if (item.dom.style[i] != null || item.dom.style[i] != undefined) {
                item.dom.style[i] = data
              }
            }
          }
        })
      }
    }
    //---------------------------事件操作---------------------------
    query.on = function(event, callFun) {
      if (this.dom == document || this.dom == window) {
        addEvent(this.dom, event, callFun)
      } else {
        // console.log(this)
        let tempDDom = domCollect(this.dom)
        tempDDom.map(function(item) {
          if (typeof callFun == "function") {
            addEvent(item.dom, event, callFun)
          }
        })
      }
    }
    query.off = function(event) {
      //console.log("here")
      if (this.dom == document || this.dom == window) {
        removeEvent(this.dom, event)
      } else {
        let tempDDom = domCollect(this.dom)
        tempDDom.map(function(item) {
          if (item.dom) {
            removeEvent(item.dom, event)
          }
        })
      }
      //console.log('there')
    }
    query.resize = function(callfun) {
      if (this.dom == window && typeof callfun == "function") {
        window.onresize = callfun
      }
    }
    query.hashchange = function(callfun) {
      if (this.dom == window && typeof callfun == "function") {
        window.onhashchange = callfun
      }
    }
    query.focus = function(callfun) {
      if (
        (this.dom != window || this.dom != document) &&
        typeof callfun == "function"
      ) {
        this.dom.map(function(item) {
          if (item.dom) {
            item.dom.onfocus = callfun
          }
        })
      }
    }
    query.blur = function(callfun) {
      if (
        (this.dom != window || this.dom != document) &&
        typeof callfun == "function"
      ) {
        this.dom.map(function(item) {
          if (item.dom) {
            item.dom.onblur = callfun
          }
        })
      }
    }
    query.change = function(callfun) {
      if (
        (this.dom != window || this.dom != document) &&
        typeof callfun == "function"
      ) {
        this.dom.map(function(item) {
          if (item.dom) {
            item.dom.onchange = callfun
          }
        })
      }
    }
    query.keydown = function(callfun) {
      if (
        (this.dom != window || this.dom != document) &&
        typeof callfun == "function"
      ) {
        this.dom.map(function(item) {
          if (item.dom) {
            item.dom.onkeydown = callfun
          }
        })
      }
    }
    query.click = function() {
      let dom = domCollect(this.dom)
      dom.map(function(item) {
        item.dom.click()
      })
    }
    query.dblclick = function() {
      let dom = domCollect(this.dom)
      dom.map(function(item) {
        item.dom.dblclick()
      })
    }
    //---------------------------节点操作---------------------------
    query.html = function(value) {
      if (value == undefined || value == null) {
        if (this.dom == document || this.dom == window) {
          var tempDom =
            this.dom == window ? this.dom.document.body : this.dom.body
          return tempDom.innerHTML
        } else {
          let tempDDom = domCollect(this.dom)
          if (tempDDom[tempDDom.length - 1].dom) {
            return tempDDom[tempDDom.length - 1].dom.innerHTML
          } else {
            return ""
          }
        }
      } else {
        if (this.dom == document || this.dom == window) {
          var tempDom =
            this.dom == window ? this.dom.document.body : this.dom.body
          tempDom.innerHTML = value
        } else {
          let tempDDom = domCollect(this.dom)
          tempDDom.map(function(item) {
            if (item.dom) {
              item.dom.innerHTML = value
            }
          })
          //return this.dom[this.dom.length - 1].dom.innerHTML
        }
      }
    }
    query.append = function(value) {
      if (value != undefined && value != null) {
        var dom = domCollect(this.dom)
        let nodelist = cloneNode(value)
        if (nodelist) {
          dom.map(function(item) {
            nodelist.map(function(vnode) {
              item.dom.appendChild(vnode)
            })
          })
        }
      }
    }
    query.prepend = function(value) {
      if (value != undefined && value != null) {
        let dom = domCollect(this.dom)
        let nodelist = cloneNode(value)
        if (nodelist) {
          dom.map(function(item) {
            for (let i = nodelist.length - 1; i >= 0; i--) {
              item.dom.insertBefore(nodelist[i], item.dom.childNodes[0])
            }
          })
        }
      }
    }
    query.before = function(value) {
      if (value != undefined && value != null) {
        let dom = domCollect(this.dom)
        let nodelist = cloneNode(value)
        if (nodelist) {
          //console.log(dom, nodelist, nodelist.length)
          dom.map(function(item) {
            nodelist.map(function(vnode) {
              item.dom.parentNode.insertBefore(vnode, item.dom)
            })
          })
        }
      }
    }
    query.after = function(value) {
      if (value != undefined && value != null) {
        let dom = domCollect(this.dom)
        let nodelist = cloneNode(value)
        if (nodelist) {
          console.log(dom, nodelist)
          dom.map(function(item) {
            for (let i = nodelist.length - 1; i >= 0; i--) {
              item.dom.parentNode.insertBefore(
                nodelist[i],
                item.dom.nextSibling
              )
            }
          })
        }
      }
    }
    query.remove = function() {
      let dom = domCollect(this.dom)
      dom.map(function(item) {
        if (item.dom) {
          item.dom.parentNode.removeChild(item.dom)
        }
      })
      this.dom = []
    }
    if (typeof domname === "string") {
      query.dom = query.init(domname, parent)
    } else {
      query.dom = selctor
      var otherAttr = setAllBox(query.dom)
      for (var i in otherAttr) {
        query[i] = otherAttr[i]
      }
    }
    //console.log(query)
    return query
  }
}

window.ES = window.ES || es6
module.exports = window.ES
