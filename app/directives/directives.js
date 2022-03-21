

// HttpRequest.POST('/base/user/resource', {
//     id: JSON.parse(window.localStorage.all).userId
//   }).

import {
    permissionsResource
} from '../http/base';
import {
    getSessionStorage,
    setSessionStorage
} from '../utils/storage';


//获取权限列表
async function getPermissionsResourceList(){
    const list = getSessionStorage("resourceList");
    if( list ) return list;
    const model = {
        id: localStorage.all ? JSON.parse(localStorage.all).userId : ''
    }
    const { pageResourceList } = await permissionsResource(model);
    if( pageResourceList ){
        setSessionStorage("resourceList", pageResourceList);
    }
    return pageResourceList || [];
}

//判断是否有权限
async function permissionsShow(types){
    const list = await getPermissionsResourceList();
    if( Array.isArray(types) ){
        return types.map(type=> Boolean(list.find(item=> item.type === type)))
    }
    return Boolean(list.find(item=> item.type === types));
}

//权限控制
async function permissions(){
    return  {
        inserted: async function (el, binding) {
            const isShow = await permissionsShow(binding.value || binding.expression);
            if( !isShow ){
                el.style.display = "none";
            }
        }
    }
}


export {
    permissions,
    permissionsShow
}