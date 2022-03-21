
import http from './http';

function projectNameSearch(model){
    return http.post("/aaa/v1/project/name/page/search", model)
}

function groupSearch(model){
    return http.post("/aaa/v1/group/search", model)
}

function projectSearch(model){
    return http.post("/aaa/v1/project/search", model)
}

function projectStatusUpdate(model){
    return http.post("/aaa/v1/project/status/update", model)
}
function projectClone(model){
    return http.post("/aaa/v1/project/clone", model)
}

function projectExport(model){ 
    return http.get("/aaa/v1/alg/preprocess/result/export?"+model);
}


export {
    projectNameSearch,
    groupSearch,
    projectSearch,
    projectStatusUpdate,
    projectClone,
    projectExport
}

