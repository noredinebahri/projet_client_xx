import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TaskSearchCriteria, TaskStatus} from '@task/model/task';

@Component({
  selector: 'psm-task-search-criteria',
  templateUrl: './task-search-criteria.component.html',
  styleUrls: ['./task-search-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSearchCriteriaComponent {
  @Output()
  valueChange = new EventEmitter<TaskSearchCriteria>();
  readonly typeFormControl: FormControl<string | null>

  constructor() {
    this.typeFormControl = new FormControl();
    this.typeFormControl.valueChanges.subscribe(changedValue => {
      const searchCriteria: TaskSearchCriteria = {};
      if (changedValue) {
        searchCriteria.status = changedValue as TaskStatus;
      }
      this.valueChange.next(searchCriteria);
    })
  }

  @Input()
  set value(newValue: TaskSearchCriteria | undefined | null) {
    if (newValue) {
      this.typeFormControl.setValue(newValue.status ?? null);
    }
  }
}
