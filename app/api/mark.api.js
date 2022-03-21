var api = {
    //透传接口
    sys_transfer(value) {
        return this.HttpRequest.POST('/sys/transfer', value)
    },
    dcm_cerebralHemorrhage: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
            //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/mpr/dcm/cerebralHemorrhage',
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
    series_result_act_record: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
            //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/anno/series_result/act/record',
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
    //项目基础信息
    alg_sar_reset_mask_image: function(value) {
        let st = api.app.tokentime()
        if (!st) {
            delete value.token
        }
        var deferred = ES.Deferred()
            //deferred.resolve({aa:'aa'});
        ES.ajax({
            url: api.app.domain1 + 'v1/alg/sar/reset_mask_image',
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

    //获取当前序列 
    series_result_search(value) {
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
    // image_process_create: function (value) {
    //   var deferred = ES.Deferred()
    //   ES.ajax({
    //     url: api.app.domain1 + 'v1/mask/magic_stick/create',
    //     type: "POST",
    //     dataType: "json",
    //     contentType: "application/json",
    //     questring: value
    //   }).then(function (response) {
    //     if (!api.app.apiresult(response)) {
    //       return
    //     }
    //     deferred.resolve(response);
    //   }, function () {
    //     deferred.reject(true);
    //   });
    //   return deferred
    // },
    // 魔法棒创建
    magicToolCerate(data) {
        return this.HttpRequest.POST('/mask/magic_stick/create', data)
    },
    // 魔法棒查看一个
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
    //魔法棒查看
    // image_process_read: function (value) {
    //   var deferred = ES.Deferred()
    //   ES.ajax({
    //     // url: api.app.domain + 'v1/image_process/read',
    //     url: api.app.domain1 + 'v1/anno/iar/read',
    //     type: "POST",
    //     dataType: "json",
    //     contentType: "application/json",
    //     questring: value
    //   }).then(function (response) {
    //     if (!api.app.apiresult(response)) {
    //       return
    //     }
    //     deferred.resolve(response);
    //   }, function () {
    //     deferred.reject(true);
    //   });
    //   return deferred
    // },
    //魔法棒删除
    image_process_delete: function(value) {
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
    //魔法棒接口
    image_process_item_edit: function(value) {
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
    }

}
module.exports = api;