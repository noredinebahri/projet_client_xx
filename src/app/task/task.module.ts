import {ModuleWithProviders, NgModule} from '@angular/core';
import {TaskService} from './services/task.service';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@shared/shared.module';
import {TaskSearchCriteriaComponent} from './components/task-search-criteria/task-search-criteria.component';
import {TaskResultsComponent} from './components/task-results/task-results.component';
import {TaskDetailsDialogComponent} from './components/task-details-dialog/task-details-dialog.component';
import {TaskOverviewDialogComponent} from './components/task-overview-dialog/task-overview-dialog.component';
import {TaskMasterDialogComponent} from './components/task-master-dialog/task-master-dialog.component';
import {SimpleTaskDetailsComponent} from './components/simple-task-details/simple-task-details.component';
import {SimpleTaskResultsComponent} from '@task/components/simple-task-results/simple-task-results.component';
import {TaskActionPickerComponent} from './components/task-action-picker/task-action-picker.component';
import {TaskActionMessageComponent} from './components/task-action-message/task-action-message.component';
import {TaskProgressComponent} from './components/task-progress/task-progress.component';
import {TaskCommentComponent} from './components/task-comment/task-comment.component';
import {TaskCommentInputComponent} from './components/task-comment-input/task-comment-input.component';
import {UnselectedTaskDialogComponent} from './components/unselected-task-dialog/unselected-task-dialog.component';

@NgModule({
  declarations: [
    TaskSearchCriteriaComponent,
    TaskResultsComponent,
    TaskDetailsDialogComponent,
    TaskOverviewDialogComponent,
    TaskMasterDialogComponent,
    SimpleTaskResultsComponent,
    SimpleTaskDetailsComponent,
    TaskActionPickerComponent,
    TaskActionMessageComponent,
    TaskProgressComponent,
    TaskCommentComponent,
    TaskCommentInputComponent,
    UnselectedTaskDialogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TaskModule {
  static forRoot(): ModuleWithProviders<TaskModule> {
    return {
      ngModule: TaskModule,
      providers: [TaskService]
    }
  }
}
