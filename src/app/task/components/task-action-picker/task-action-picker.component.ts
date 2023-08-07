import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {TaskAction, TaskActionType, TaskActionValue} from '@task/model/task-action';

@Component({
  selector: 'psm-task-action-picker',
  templateUrl: './task-action-picker.component.html',
  styleUrls: ['./task-action-picker.component.scss']
})
export class TaskActionPickerComponent {
  @Output()
  taskActionChange = new EventEmitter<TaskActionValue<any>>();
  taskActions: TaskAction<any>[] | undefined;
  selectedTaskAction: TaskActionValue<any> | null = null;
  showAvailableActions: boolean = false;

  constructor(private readonly eRef: ElementRef) {
  }

  @Input()
  set availableTaskActions(newTaskActions: TaskAction<any>[] | undefined) {
    this.taskActions = newTaskActions;
    this.cancelSelectedAction();
  }

  @HostListener("document:click", ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showAvailableActions = false;
    }
  }

  notifyOnActionChange() {
    if (this.selectedTaskAction) {
      this.taskActionChange.emit(this.selectedTaskAction);
    }
  }

  noTaskActionSelected() {
    return !this.selectedTaskAction;
  }

  toggleAvailableActions() {
    this.showAvailableActions = !this.showAvailableActions;
  }

  cancelSelectedAction() {
    this.selectedTaskAction = null;
  }

  selectTaskActionAndClose(type: TaskActionType, value: any) {
    this.selectedTaskAction = {type, value};
    this.showAvailableActions = false;
  }
}
