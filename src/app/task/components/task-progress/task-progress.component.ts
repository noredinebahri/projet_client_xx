import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TaskComment, TaskDetails} from '@task/model/task';

@Component({
  selector: 'psm-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss']
})
export class TaskProgressComponent {
  @Input()
  taskDetails: TaskDetails | undefined | null;

  @Output() commentChange = new EventEmitter<TaskComment>();

  taskHasComments(): boolean {
    return (this.taskDetails?.comments?.length ?? 0) > 0;
  }

  notifyOnCommentChange(comment: TaskComment) {
    this.commentChange.emit(comment);
  }
}
