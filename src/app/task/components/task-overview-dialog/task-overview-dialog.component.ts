import {Component, OnDestroy, ViewChild} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  zip
} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '@task/services/task.service';
import {Task, TaskSearchCriteria, TaskStatus,} from '@task/model/task'
import {
  deserializeSortingParameters,
  serializeSortingParameters,
  SortingParameter,
  sortingUrlParamName
} from '@shared/ag-grid/ag-grid-utils';
import {
  breakIfSearchCriteriaNotProvided,
  createSearchCriteria,
  defaultSearchCriteria,
  searchCriteriaNotChanged,
  transformSearchCriteriaToParams
} from '@task/components/task-dialog-utils';
import {createChangeTaskStatusAction, TaskAction, TaskActionValue} from '@task/model/task-action';
import {TaskActionMessageComponent} from '@task/components/task-action-message/task-action-message.component';

@Component({
  selector: 'psm-task-overview-dialog',
  templateUrl: './task-overview-dialog.component.html',
  styleUrls: ['./task-overview-dialog.component.scss']
})
export class TaskOverviewDialogComponent implements OnDestroy {
  @ViewChild("taskActionMessage")
  taskActionMessage: TaskActionMessageComponent | undefined;
  readonly searchCriteria$: Observable<TaskSearchCriteria>;
  readonly sortingParameters$: Observable<SortingParameter[]>;
  readonly searchResults$: Observable<Task[]>;
  taskActions: TaskAction<any>[] | undefined;

  private tasksToExecuteActionsOn: Task[] = [];
  private previousTasksToExecuteActionsOn: Task[] = []; // for undo
  private requestedTaskStatus: TaskStatus | null = null;
  private readonly forceSearching = new BehaviorSubject<void>(undefined);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly currentRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly tasks: TaskService) {
    this.searchCriteria$ = currentRoute.params
      .pipe(
        map(params => createSearchCriteria(params)),
        distinctUntilChanged(searchCriteriaNotChanged)
      );

    this.sortingParameters$ = currentRoute.params
      .pipe(
        map(params => params?.[sortingUrlParamName]),
        distinctUntilChanged(),
        map(rawSortingParams => deserializeSortingParameters(rawSortingParams)),
      );

    this.searchResults$ = combineLatest([this.searchCriteria$, this.forceSearching.asObservable()])
      .pipe(
        map(params => params[0]),
        breakIfSearchCriteriaNotProvided(() => {
          setTimeout(() => this.updateUrlParamsOnNewSearchCriteria(defaultSearchCriteria));
        }),
        switchMap(searchCriteria => this.tasks.find(searchCriteria))
      )
  }

  updateUrlParamsOnNewSearchCriteria(newSearchCriteria: TaskSearchCriteria) {
    this.updateUrlParamsWith(transformSearchCriteriaToParams(newSearchCriteria));
  }

  updateUrlParamsWith(newParams: Params) {
    const currentParams = this.currentRoute.snapshot.params;
    const mergedParams = {...currentParams, ...newParams};
    this.router.navigate([mergedParams], {relativeTo: this.currentRoute});
  }

  updateUrlParamsOnNewSortingParameters(newSortingParameters: SortingParameter[]) {
    const params: Params = {}
    params[sortingUrlParamName] = serializeSortingParameters(newSortingParameters);
    this.updateUrlParamsWith(params);
  }

  goToDetailsOf(task: Task) {
    this.router.navigate(['details', task.taskNumber], {relativeTo: this.currentRoute});
  }

  updateActionsOf(tasks: Task[]) {
    this.tasksToExecuteActionsOn = tasks;
    const newTasksToExecuteAreThere = this.tasksToExecuteActionsOn.length > 0;
    const statusCommonToAllTasks = newTasksToExecuteAreThere ? this.tasksToExecuteActionsOn
      .reduce<TaskStatus | null>(keepStatusIfSameAsInCurrentTaskOrSetToNullOtherwise, this.tasksToExecuteActionsOn[0].status as TaskStatus) : null;
    if (newTasksToExecuteAreThere) {
      this.taskActions = [createChangeTaskStatusAction(statusCommonToAllTasks)];
    } else {
      setTimeout(() => this.resetTaskActions()); // setTimeout to prevent ExpressionChangedAfterItHasBeenCheckedError
    }

    function keepStatusIfSameAsInCurrentTaskOrSetToNullOtherwise(taskStatus: TaskStatus | null, currentTask: Task) {
      return taskStatus && taskStatus === currentTask.status ? taskStatus : null
    }
  }

  executeActionOnTasks(action: TaskActionValue<any>) {
    this.resetTaskActions();
    if (action.type === 'changeTaskStatus') {
      this.requestedTaskStatus = action.value as TaskStatus;
      const numbersOfTasksRelevantForStatusChange = this.getNumbersOfTasksHavingStatusesOtherThanRequestedOne();
      this.tasks.changeStatus(numbersOfTasksRelevantForStatusChange, this.requestedTaskStatus)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          this.taskActionMessage?.showOneOnStatusChangeSuccess(this.requestedTaskStatus!, numbersOfTasksRelevantForStatusChange);
          this.previousTasksToExecuteActionsOn = this.tasksToExecuteActionsOn; // keep the tasks for possible undo request
          this.forceSearchingByCurrentCriteria();
        });
    }
  }

  undoStatusChange() {
    this.resetTaskActions();
    const status2TaskNumbers = this.previousTasksToExecuteActionsOn
      .filter(taskHavingStatusOtherThan(this.requestedTaskStatus))
      .reduce(collectTaskNumbersByTaskStatuses, {});
    const numbersOfTasksToUpdate = Object.keys(status2TaskNumbers)
      .map(status => status2TaskNumbers[status])
      .reduce((acc, taskNumbers) => acc.concat(taskNumbers), []);
    const undoActions$ = Object.keys(status2TaskNumbers)
      .map(status => {
        const numbersOfTasksToSetStatusOn = status2TaskNumbers[status];
        return this.tasks.changeStatus(numbersOfTasksToSetStatusOn, status as TaskStatus);
      });

    zip(undoActions$)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.taskActionMessage?.showOneOnUndoStatusChangeSuccess(numbersOfTasksToUpdate);
        this.forceSearchingByCurrentCriteria();
      });

    function collectTaskNumbersByTaskStatuses(statusToTaskNumbers: { [status: string]: string[] }, currentTask: Task) {
      const numbersOfTasksOfGivenStatus = statusToTaskNumbers[currentTask.status] || [];
      numbersOfTasksOfGivenStatus.push(currentTask.taskNumber);
      statusToTaskNumbers[currentTask.status] = numbersOfTasksOfGivenStatus;
      return statusToTaskNumbers;
    }
  }

  ngOnDestroy(): void {
    this.forceSearching.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getNumbersOfTasksHavingStatusesOtherThanRequestedOne() {
    return this.tasksToExecuteActionsOn
      .filter(taskHavingStatusOtherThan(this.requestedTaskStatus))
      .map(task => task.taskNumber);
  }

  private forceSearchingByCurrentCriteria() {
    this.forceSearching.next();
  }

  private resetTaskActions() {
    this.taskActions = undefined;
  }
}

function taskHavingStatusOtherThan(taskStatus: TaskStatus | null) {
  return function (task: Task) {
    return task.status !== taskStatus;
  }
}
