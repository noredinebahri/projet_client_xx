import {Component, Input} from '@angular/core';
import {TaskComment} from '@task/model/task';

@Component({
  selector: 'psm-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent {
  @Input()
  comment: TaskComment | undefined
}
