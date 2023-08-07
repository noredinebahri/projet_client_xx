import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TaskComment} from '@task/model/task';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'psm-task-comment-input',
  templateUrl: './task-comment-input.component.html',
  styleUrls: ['./task-comment-input.component.scss']
})
export class TaskCommentInputComponent {
  @Output() commentChange = new EventEmitter<TaskComment>()

  readonly commentFormControl: FormControl<string | null> = new FormControl('', Validators.required);
  private originalTaskComment: TaskComment | undefined;

  @Input()
  set comment(newComment: TaskComment | undefined) {
    this.originalTaskComment = newComment;
    this.commentFormControl.setValue(newComment ? newComment.text : '');
  }

  notifyOnCommentChange() {
    if (this.commentFormControl.valid) {
      const commentText: string = this.commentFormControl.value! // we're sure as the form control is valid
      const comment: TaskComment = this.originalTaskComment ? {
        ...this.originalTaskComment,
        text: commentText
      } : {text: commentText};
      this.commentChange.emit(comment);
      this.clear();
    }
  }

  clear() {
    this.commentFormControl.reset('');
  }
}
