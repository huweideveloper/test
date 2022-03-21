
const isType = (value, type) => Object.prototype.toString.call(value) === "[object "+ type +"]";
const isString = value => isType(value, "String");
const isArray = value => isType(value, "Array");

const SETITEM = "setItem";
const GETITEM = "getItem";
const REMOVEITEM = "removeItem";

function storageSingle(storageType, handleType, key, values){
    if( handleType === GETITEM ) {
        const storageValue = window[storageType][handleType](key);
        return storageValue ? JSON.parse(storageValue) : values ;
    }
    window[storageType][handleType](key, JSON.stringify(values));
}
function storage(storageType, handleType, keys, values){
    if( isString(keys) ) return storageSingle(storageType, handleType, keys, values);
    if( isArray(keys) ){
        return keys.map((key,index)=> {
            const value = isArray(values) ? values[index] : values;
            return storageSingle(storageType, handleType, key, value);
        })
    }
}
/**
 * setLocalStorage("name", "zhangsan")                          //zhangsan
 * setSessionStorage(["name", "age"], ["zhangsan", "18"])       //zhangsan 18
 * getLocalStorage("name")                                      //zhangsan
 * getSessionStorage(["name", "age"])                           //["zhangsan", "18"]
 * getLocalStorage("nationality", "china")                      //china (nationality is undefined, return default value)
 */
const setLocalStorage = (keys, values) => storage("localStorage", SETITEM, keys, values); 
const setSessionStorage = (keys, values) => storage("sessionStorage", SETITEM, keys, values);
const getLocalStorage = (keys, defaultValue) => storage("localStorage", GETITEM, keys, defaultValue);
const getSessionStorage = (keys, defaultValue) => storage("sessionStorage", GETITEM, keys, defaultValue);
const removeLocalStorage = (keys) => storage("localStorage", REMOVEITEM, keys);
const removeSessionStorage = (keys) => storage("sessionStorage", REMOVEITEM, keys);

export {
    setLocalStorage,
    setSessionStorage,
    getLocalStorage,
    getSessionStorage,
    removeLocalStorage,
    removeSessionStorage,
}