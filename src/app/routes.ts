import {Routes} from '@angular/router';
import {DashboardComponent} from './portal/components/dashboard/dashboard.component';
import {TaskOverviewDialogComponent} from './task/components/task-overview-dialog/task-overview-dialog.component';
import {TaskDetailsDialogComponent} from './task/components/task-details-dialog/task-details-dialog.component';
import {TaskMasterDialogComponent} from '@task/components/task-master-dialog/task-master-dialog.component';
import {NotFoundDialogComponent} from '@portal/components/not-found-dialog/not-found-dialog.component';
import {UnselectedTaskDialogComponent} from '@task/components/unselected-task-dialog/unselected-task-dialog.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'tasks',

    children: [
      {
        path: '',
        component: TaskOverviewDialogComponent,
      },
      {
        path: 'details',
        component: TaskMasterDialogComponent,
        children: [
          {
            path: ':taskNumber',
            component: TaskDetailsDialogComponent
          },
          {
            path: '',
            component: UnselectedTaskDialogComponent
          }
        ]
      }
    ]
  },
  {path: '', pathMatch: 'full', redirectTo: '/'},
  {path: '**', component: NotFoundDialogComponent}
];
