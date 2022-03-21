var api = {
    //透传接口
    sys_transfer(value) {
      return this.HttpRequest.POST('/sys/transfer', value)
    },
    //项目读取
    annoitem_project_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/annoitem/project/read',
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //任务读取
    project_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/project/read',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //序列详情
    series_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain + 'v1/series/read',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //序列图片地址
    image_query: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain + 'v1/image/query',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    
    //获取下一个序列
    series_get: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/user/series/get',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //****************为每一个序列创建一个标注结果集合*********************
    series_result_create: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/create',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    series_result_read: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/project/series/result/read',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    series_result_submit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/submit',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    series_result_query: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/query',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    magicToolRead(data) {
        return this.HttpRequest.POST('/anno/iar/read', data)
    },
    series_result_item_edit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/item/edit',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //****************为每一个序列创建一个标注结果集合*********************
    //****************单个标注结果*********************
    image_result_create: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/image_result/create',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    //通用mask保存接口
    anno_iar_read: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/iar/read',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    audit_imganno_audit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/imganno/audit',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    audit_annoitem_update: function(value) {
        var deferred = ES.Deferred()
        console.log('wwwwww')
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/annoitem/update',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            console.log(response)
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    series_audit_submit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/series/audit/submit',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    },
    series_result_next: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/project/series/result/searchresult/next',
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            questring: value
        }).then(function(response) {
            if (!api.app.apiresult(response)) {
                return
            }
            deferred.resolve(response);
        }, function() {
            deferred.reject(true);
        });
        return deferred
    }
    //****************单个标注结果*********************
    //组件结果上传
}
module.exports = api;