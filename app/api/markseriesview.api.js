var api = {
    //透传接口
    sys_transfer(value) {
      return this.HttpRequest.POST('/sys/transfer', value)
    },
      //查询copd的值
      queryCopdVal(iarId) {
        return this.HttpRequest.POST('/anno/image_result/getSegThresholdByIarId', iarId)
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
    //任务读取
    series_review_task_read: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
        //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain + 'v1/series_review_task/read',
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
            url: api.app.domain1 + 'v1/project/series/discard',
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
    series_review_task_series_search: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain + 'v1/series_review_task/series/search',
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
    },//魔法棒接口
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
    magicToolRead(data) {
        return this.HttpRequest.POST('/anno/iar/read', data)
    },
    //魔法棒批量查看
    image_process_batch_read: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain1 + 'v1/image_process/batch_read',
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
    series_review_task_update: function(value) {
        var deferred = ES.Deferred()
        ES.ajax({
            url: api.app.domain + 'v1/series_review_task/update',
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


}
module.exports = api;