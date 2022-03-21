






import http from './http';

function fileQueryList(model){
    return http.post("/aaa/v1/anno/file/queryList", model)
}
function projectNameExist(model){
    return http.post("/aaa/v1/project/name/exist", model)
}
function projectDetail(model){
    return http.post("/aaa/v1/project/basic/read", model)
}







export {
    fileQueryList,
    projectNameExist,
    projectDetail
}

