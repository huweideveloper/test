class AllTaskListModel extends Interstellar.modelBase {
    constructor(app) {
        super(app)
        this.data = {"userId":JSON.parse(this.app.local.get('all')).userId ,"pageSize": 10, "page": 1, "currentTime": "", "name": "", "project_name": "", "assign_method": null, "status": "2", "projectId": null, "start_time": null, "end_time": null }
    }
}
module.exports = AllTaskListModel;