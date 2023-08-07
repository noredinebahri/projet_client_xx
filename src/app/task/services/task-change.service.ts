import {Subject} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';
import {TaskChange, TaskProperty} from '@task/model/task';

@Injectable()
export class TaskChangeService implements OnDestroy {
  private readonly changes = new Subject<TaskChange>();
  readonly values$ = this.changes.asObservable();

  emitChange(taskNumber: string, changedProperty: TaskProperty) {
    this.changes.next({taskNumber, changedProperty});
  }

  ngOnDestroy(): void {
    this.changes.complete();
  }
}
