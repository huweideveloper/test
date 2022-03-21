class modelBase {
    constructor(app) {
        this.app = app
        this._event = new Interstellar.event()
        setTimeout(() => {
            this.checkPrivate()
        }, 0)
    }
    //保护私有变量不被污染
    checkPrivate() {
        let _object = this
        let clone = {}
        for (let i in _object) {
            if (i != '_event' && typeof _object[i] != "function" && i != 'app') {
                let temp = _object[i]
                clone[i] = JSON.parse(JSON.stringify(temp))
                if (i[0] === '_') {
                    Object.defineProperty(_object, i, {
                        get: function() {
                            return clone[i]
                        },
                        set: function() {
                            console.error("private var can't change")
                        }
                    })
                }
            }
        }
    }
    //修改私有变量的值
    setPrivate(obj, propertys) {
        for (var i in propertys) {
            Object.defineProperty(obj, i, { value: propertys[i] })
        }
    }
    getData(key) {
        return this[key]
    }
    //根据参数
    setData(key, value) {
        if (key[0] === '_') {
            return
        } else {
            this[key] = value
            console.warn(`注意: 这里发布了${key}.change事件`);
            this._event._dispatch(key + '.change')
        }
        if (!this.app.pagerclass) {
            return
        }
        //在这里调用了其他函数，太难找了，真操蛋
        if( typeof this.app.pagerclass[key] === 'function' ){
            if (this.___auto) {
                console.warn(`注意: 这里调用了 this.app.pagerclass.${key}函数, this.app.pagerclass =`, this.app.pagerclass );
                this.app.pagerclass[key]();
            }
        }
        // if (typeof eval('this.app.pagerclass.' + key) === 'function') {
        //     if (this.___auto) {
        //         eval('this.app.pagerclass.' + key + '()')
        //     }
        // }
    }
    clear() {
        for (var i in this) {
            if (i[0] !== '_') {
                this[i] = null
            }
        }
    }
}



window.Interstellar = window.Interstellar || {}
window.Interstellar.modelBase = window.Interstellar.modelBase || modelBase
module.exports = modelBase;