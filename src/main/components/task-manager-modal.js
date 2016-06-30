import moment               from 'moment';
import {inject, observable} from 'aurelia-framework';
import {TaskManager}        from '../../shared/task-manager';
import {DialogController}   from 'aurelia-dialog';

@inject(DialogController, TaskManager)
export class TaskManagerModal {
  @observable selectedTask = {};

  constructor(dialogController, taskManager) {
    this.dialogController = dialogController;
    this.taskManager = taskManager;
  }

  attached() {
    if (this.taskManager.allTasks.length > 0) {
      this.selectedTask = this.taskManager.allTasks[0];
    }
    this.interval = setInterval(() => this.updateElapsed(), 1000);
  }

  selectedTaskChanged() {
    this.updateElapsed();
  }

  updateElapsed() {
    if (this.selectedTask && !this.selectedTask.finished) {
      let endDate;
      if (this.selectedTask.end) {
        endDate = this.selectedTask.end;
      } else {
        endDate = new Date();
      }
      this.selectedTask.elapsed = `${moment(endDate).diff(this.selectedTask.start, 'seconds')} seconds`;
    }
  }

  detached() {
    clearInterval(this.interval);
  }
}
