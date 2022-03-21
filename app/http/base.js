

import http from './http';
import {
    getSessionStorage
} from "../utils/storage";
//权限
function permissionsResource(model){
    return http.post("/aaa/v1/base/user/resource", model)
}

//公共数据
function getCommonData(){
    return http.post("/aaa/v1/dict/child/query", { value: null }) 
}

function getChildren(key, array){
    const index = array.findIndex(item=> item.value === key);
    const children = index > -1 ? array[index].children : [];
    return children;
}

async function getCommonDataByKey(keys){
    const array = getSessionStorage("commonData") || await getCommonData();
    const list = Array.isArray(keys) ? keys.map( key => getChildren(key, array)) : getChildren(keys, array);
    return list;
}



export {
    permissionsResource,
    getCommonData,
    getCommonDataByKey
}

