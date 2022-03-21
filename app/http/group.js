
import http from './http';

function intoGroupFilList() {
  return http.post("/config/v1/config/intoGroupFile/list");
}

function intoGroupFileQuery(model){
    return http.post("/config/v1/config/intoGroupFile/query", model);
}

function intoGroupFileUpdate(model){
    return http.post("/config/v1/config/intoGroupFile/update", model);
}

function statisticsUpdate(model){
    return http.post("/config/v1/config/intoGroup/statistics/update", model);
}

function statisticsQuery(){
    return http.post("/config/v1/config/intoGroup/statistics/query");
}

function statistics(model){
    return http.post("/search/v1/series_info/intoGroup/statistics", model)
}

function hospitalSearch(model){
    return http.post("/aaa/v1/dwh/hospital/search", model)
}


export {
    intoGroupFilList,
    intoGroupFileQuery,
    intoGroupFileUpdate,
    statisticsUpdate,
    statisticsQuery,
    statistics,
    hospitalSearch
}