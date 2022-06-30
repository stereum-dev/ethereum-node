import { NodeConnection } from "./NodeConnection"

export class TaskManager {
    constructor() {
        this.nodeConnection = new NodeConnection()
        this.tasks = []                 //all tasks
        this.polishedTasks = []         //all tasks prepared for displaying
        this.finishedPlaybooks = []     //finished playbook tasks
        this.finishedUpdates = []       //finished update tasks
        this.finishedOtherTasks = []    //all other finished tasks
        this.otherSubTasks = []         //subtasks of all other tasks
    }
    async getTasks() {
        return this.polishedTasks
    }
    async clearTasks() {
        this.tasks = []
        this.polishedTasks = []
        this.finishedPlaybooks = []
        this.finishedUpdates = []
        this.finishedOtherTasks = []
        this.otherSubTasks = []
    }
    async updateTasks() {
        let tasks = await this.queryLogs()
        this.polishedTasks = tasks.map((task, id) => {
            return { id: id, name: task.name, status: task.status ? task.status : null, showDropDown: false, subTasks: task.subTasks }
        })
    }
    async queryLogs() {
        let tasks = this.tasks
        if (tasks) {
            for (let task of tasks) {
                if (task.ref && !task.status) {
                    if (this.finishedPlaybooks.includes(task.ref)) {
                        task.status = 'success'
                    }
                    let logs = ""
                    try {
                        logs = await this.nodeConnection.playbookStatus(task.ref)
                    } catch (err){}
                        let buffer = logs.split('\n\n')
                    buffer.pop()
                    task.subTasks = []

                    for (let subtask of buffer) {
                        let obj = {
                            name: (/^TASK: (.*)/gm).exec(subtask)[1],
                            action: (/^ACTION: (.*)/gm).exec(subtask)[1],
                            status: (/^CATEGORY: (.*)/gm).exec(subtask)[1],
                        }
                        if (!obj.name) {
                            obj.name = obj.action
                        }
                        if (obj.status === 'FAILED') {
                            task.status = 'failed'
                        }
                        task.subTasks.push(obj)
                    }
                }else if(task.updateRunRef && !task.status){
                    task.subTasks = []
                    if(this.finishedUpdates.map(update => update.updateRunRef).includes(task.updateRunRef)){
                        task.status = "success"
                        let logs = this.finishedUpdates.find(update => update.updateRunRef === task.updateRunRef).logs
                        let buffer1 = logs.stdout.split('\n\n')
                        buffer1.pop()
                        let subtasks = buffer1.filter(t => t.includes("TASK") && !t.includes("TASK [Include role]"))
                        for (let subtask of subtasks){
                            let obj = {
                                name: (/\[(.*)\]/).exec(subtask)[1],
                                action: (/\n.*(^.*?)$/m).exec(subtask)[1],
                                status: (/\n.*(^.*?): /gm).exec(subtask)[1],
                            }
                            switch(obj.status){
                                case "ok":
                                    obj.status = "OK"
                                    break;
                                case "changed":
                                    obj.status = "OK"
                                    break;
                                case "included":
                                    obj.status = "OK"
                                    break;
                                case "skipping":
                                    obj.status = "SKIPPED"
                                    break;
                                case "fatal":
                                    obj.status = "FAILED"
                                    task.status = "failed"
                                    break;
                                default:
                                    obj.name = `${obj.name}\n${obj.action}\n${obj.status}`
                                    obj.status = "FAILED"
                                    break;
                            }
                            task.subTasks.push(obj)
                        }
                    }
                } else if(task.otherRunRef && !task.status){
                    task.subTasks = this.otherSubTasks.filter(subTask => subTask.otherRunRef === task.otherRunRef)
                    .map(subTask => {
                        return {
                        name: subTask.name,
                        action: subTask.name,
                        status: subTask.status ? 'OK' : 'FAILED',
                      }
                    })

                    if(this.finishedOtherTasks.map(other => other.otherRunRef).includes(task.otherRunRef)){
                        if(task.subTasks.some(task => task.status === 'FAILED')){
                            task.status = "failed"
                        }else {
                            task.status = "success"
                        }
                    }
                }
            }
            return tasks
        }
        return []
    }
}