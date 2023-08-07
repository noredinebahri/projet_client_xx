import {Component, EventEmitter, Output} from '@angular/core';
import {TaskStatus} from '@task/model/task';

@Component({
  selector: 'psm-task-action-message',
  templateUrl: './task-action-message.component.html',
  styleUrls: ['./task-action-message.component.scss'],
  exportAs: 'taskActionMessage'
})
export class TaskActionMessageComponent {
  @Output()
  readonly undoStatusChangeRequest = new EventEmitter<void>();

  taskNumbers: string[] = [];
  taskStatus: TaskStatus | undefined;

  showInfoOnStatusChangeSuccess = false;
  showInfoOnUndoSuccess = false;

  showOneOnStatusChangeSuccess(newTaskStatus: TaskStatus, changedTaskNumbers: string[]) {
    this.close();
    this.taskStatus = newTaskStatus;
    this.taskNumbers = changedTaskNumbers;
    this.showInfoOnStatusChangeSuccess = true;
  }

  showOneOnUndoStatusChangeSuccess(changedTaskNumbers: string[]) {
    this.close();
    this.taskNumbers = changedTaskNumbers;
    this.showInfoOnUndoSuccess = true;
  }

  close() {
    this.closeInfoOnStatusChangeSuccess();
    this.closeInfoOnUndoStatusChangeSuccess();
  }

  closeInfoOnStatusChangeSuccess() {
    this.showInfoOnStatusChangeSuccess = false;
    this.taskStatus = undefined;
    this.taskNumbers = [];
  }

  closeInfoOnUndoStatusChangeSuccess() {
    this.showInfoOnUndoSuccess = false;
  }

  notifyOnUndoStatusChangeRequest() {
    this.close();
    this.undoStatusChangeRequest.next();
  }
}
