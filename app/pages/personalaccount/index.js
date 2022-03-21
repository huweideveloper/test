import './index.less'
import api from './api.js'
import commonApi from '@/api/common.api'
import SysNotice from '@/components/sys-notice'
import {
  permissionsShow
} from '../../directives/directives';

class personalaccount extends Interstellar.pagesBase {

  

  complete() {
    // 隐藏左边菜单
    this.styleModel(1)


    const app = this.app
    const useinfo = JSON.parse(app.local.get('all'))
    console.log(app);
    setTimeout(()=>{
      console.log(this.app.userResource);
    },1000)

    const userResource = app.userResource;

    new Vue({
      el: '#personalaccount',
      data() {
        return {
          systemName: '',
          app,
          useinfo,
          currentList: [],
          completedList: [],
          downloadData: {},
          show: false,
        }
      },
      components: {
        SysNotice
      },
      provide: {
        sysNotice: app.constmap.SYS_NOTICE
      },
      mounted() {
        this.init();
        this.initLanguageData()
        this.setDownloadData()
        this.queryCurrentList()
        this.queryCompletedList()
      },
      filters: {
        filterAuditStatus(val) {
          if (typeof val === 'number') {
            const auditStatusList = ['待审核', '', '审核通过', '审核未通过'] //（0-待审核，2-审核通过，3-审核未通过）
            return auditStatusList[val]
          }
        }
      },
      methods: {
        async init(){
          const showList = await permissionsShow(["ethic$$stat", "group&&stat", "label$$stat"]);
          this.show =  showList.some(isShow=> isShow);
        },
        gotoUserStatPage(){
          this.app.changePage('userStat', 
          // {
          //   taskId,
          //   type: isView ? 'view' : 'editor'
          // }
          )
        },
        initLanguageData() {
          this.systemName = this.app.languageMode.getTranslate(this.app.language, 'personalaccount', 'systemName')
        },
        // 进行中的任务
        async queryCurrentList() {
          const res = await api.taskCurrentList({
            userId: this.useinfo.userId
          })
          this.currentList = res.data
        },
        // 历史任务列表
        async queryCompletedList() {
          const res = await api.taskCompleted({
            keyword: '',
            page: 1,
            pageSize: 10,
            userId: this.useinfo.userId
          })
          this.completedList = res.data
        },
        // 点击任务
        handleClickTask(taskId, isView) {
          this.app.changePage('taskdetail', {
            taskId,
            type: isView ? 'view' : 'editor'
          })
        },
        // 领取新任务
        handleAddTask() {
          this.app.changePage('alltasklist')
        },
        // 设置下载数据
        setDownloadData() {
          this.downloadData = Tool.configRemarkFormat(this.app.constmap['C_VERSION']) || {}
        },
        // 点击下载地址
        async handleDownload() {
          const res = await commonApi.dictChildQuery({ value: null }) // 重新获取下载地址
          res.data &&
            res.data.map(item => {
              this.app.constmap[item.value] = item // 数据存到this.app.constmap
            })
          this.setDownloadData() // 重新设置下载数据
          const isHttps = window.location.origin.includes('https')
          if (isHttps) {
            // 兼容https请求http下载接口
            window.open('http://' + window.location.host + `/#!/downloadpage/${encodeURIComponent(this.downloadData.download_path)}`, '_blank') // 下载
          } else {
            window.open(this.downloadData.download_path, '_blank') // 下载
          }

        }
      }
    })
  }
}

module.exports = personalaccount
