class bindmodelbase {
    constructor(app) {
        //this.event
        this._event = new Interstellar.event()
        let _object = this
        let clone = {}
        setTimeout(function() {
            for (let i in _object) {
                if (i != '_event' && typeof _object[i] != "function"&& i != 'app') {
                    let temp = _object[i]
                    clone[i] = JSON.parse(JSON.stringify(temp))
                    if (i[0] === '_') {
                        Object.defineProperty(_object, i, {
                            get: function() {
                                return clone[i]
                            }
                        })
                    } else {
                        Object.defineProperty(_object, i, {
                            get: function() {
                                return clone[i]
                            },
                            set: function(value) {
                                clone[i] = value
                                eval('app.pagerclass.' + i + '()')
                            }
                        })
                    }
                }
            }
        }, 0)
    }
}

window.Interstellar = window.Interstellar || {}
window.Interstellar.bindmodelbase = window.Interstellar.bindmodelbase || bindmodelbase
module.exports = bindmodelbase;