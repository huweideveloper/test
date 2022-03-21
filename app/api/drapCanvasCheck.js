var api = {

    //透传接口
    sys_transfer(value) {
      return this.HttpRequest.POST('/sys/transfer', value)
    },
    task_user_series_search: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/task/user/series/search',
            type: "post",
            dataType: "json",
            questring: value,
            contentType: "application/json",
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
    series_result_search: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/search',
            type: "post",
            dataType: "json",
            questring: value,
            contentType: "application/json",
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
    //项目基础信息
    project_basic_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/project/basic/read',
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
    //项目读取
    project_anno_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/project/anno/read',
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
    //项目序列列表
    project_series_search: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/project/series/search',
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
    task_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/task/read',
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
    //序列原始tag
    series_origin_detail: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain + 'v1/series/origin/detail',
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
    //缓存序列
    series_cache: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/user/series/cache',
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
            url: api.app.domain1 + 'v1/anno/series_result/read',
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
    image_result_update: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/image_result/update',
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
    image_result_delete: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/image_result/delete',
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
    //****************单个标注结果*********************
    //组件结果上传
    image_result_item_edit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/image_result/item/edit',
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
    //废片结果
    series_discard: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/discard',
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
    //魔法棒接口
    image_process_create: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain + 'v1/image_process/create',
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
    //魔法棒批量查看
    image_process_batch_read: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain + 'v1/image_process/batch_read',
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

    //魔法棒接口
    image_process_item_edit: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain + 'v1/image_process/item/edit',
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
    anno_iar_create: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/iar/create',
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
    anno_iar_update: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/iar/update',
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
    anno_iar_delete: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/iar/delete',
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
    series_result_yayAttributes: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/yayAttributes',
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
    annoitem_task_read: function(value) {
        console.log(value)
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/audit/annoitem/task/read',
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
    }
}
module.exports = api;