

// _selft _blank
function open(path, name = '_self'){
    if( path === undefined ) return;
    window.open(`${window.location.origin}/#!/${path}`, name)
}

//解析url上的参数
function getUrlParams(key, origin = location.href){
    let result = {}
    const matchArray = origin.match(/[\w]+=([\w]*)/g)
    if( Array.isArray(matchArray) ){
        matchArray.forEach(item=>{
            const data = item.match(/[\w]+/g)
            if( data ){
                const [key, value] = data
                result[key] =  value && value !== 'undefined' ? value : ''
            }
        })
    }
    if( key ){
        return result.hasOwnProperty(key) ?  result[key] : ''
    }
    return result
}

export {
    open,
    getUrlParams
}