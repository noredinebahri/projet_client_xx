import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '@task/model/task';

@Component({
  selector: 'psm-simple-task-results',
  templateUrl: './simple-task-results.component.html',
  styleUrls: ['./simple-task-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTaskResultsComponent {
  @Input() currentTaskNumber: string | null = null;
  @Output() taskClick = new EventEmitter<string>();
  tasks: Task[] = [];
  numberOfResults = 0;

  @Input()
  public set results(newResults: Task[] | null) {
    this.tasks = newResults ?? [];
    this.numberOfResults = this.tasks.length;
  }

  notifyOnClickOnTask(taskNumber: string) {
    this.taskClick.emit(taskNumber);
  }

  isTaskCurrent(taskNumber: string) {
    return this.currentTaskNumber === taskNumber;
  }
}
