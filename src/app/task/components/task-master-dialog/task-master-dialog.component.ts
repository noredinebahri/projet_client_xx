import {Component, OnDestroy} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil
} from 'rxjs';
import {Task, TaskSearchCriteria,} from '@task/model/task';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '@task/services/task.service';
import {parseUrlParamBooleanValue} from '@shared/dialog/dialog-utils';
import {filterStateUrlParamName, sortingUrlParamName} from '@shared/ag-grid/ag-grid-utils';
import {
  breakIfSearchCriteriaNotProvided,
  createSearchCriteria,
  defaultSearchCriteria,
  searchCriteriaNotChanged,
  transformSearchCriteriaToParams
} from '@task/components/task-dialog-utils';
import {TaskChangeService} from '@task/services/task-change.service';

@Component({
  selector: 'psm-task-master-dialog',
  templateUrl: './task-master-dialog.component.html',
  styleUrls: ['./task-master-dialog.component.scss'],
  providers: [TaskChangeService]
})
export class TaskMasterDialogComponent implements OnDestroy {
  readonly searchCriteria$: Observable<TaskSearchCriteria>;
  readonly detailsExpanded$: Observable<boolean>;
  readonly searchResults$: Observable<Task[]>;
  currentTaskNumber: string | null = null;

  private readonly forceSearching = new BehaviorSubject<void>(undefined);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly currentRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly tasks: TaskService,
              taskChange: TaskChangeService,
  ) {
    this.currentTaskNumber = this.currentRoute.snapshot.firstChild?.params['taskNumber'] ?? null;
    this.searchCriteria$ = currentRoute.params
      .pipe(
        map(params => createSearchCriteria(params)),
        distinctUntilChanged(searchCriteriaNotChanged)
      );

    this.detailsExpanded$ = currentRoute.params
      .pipe(
        map(params => parseUrlParamBooleanValue(params['expanded'])),
      );

    this.searchResults$ = combineLatest([this.searchCriteria$, this.forceSearching.asObservable()])
      .pipe(
        map(combined => combined[0]),
        breakIfSearchCriteriaNotProvided(() => {
          setTimeout(() => {
            this.updateUrlParamsOnNewSearchCriteria(defaultSearchCriteria);
          });
        }),
        switchMap(searchCriteria => this.tasks.find(searchCriteria))
      );

    taskChange.values$
      .pipe(
        filter(change => change.changedProperty === 'status'),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.forceSearchingByCurrentCriteria())
  }

  toggle() {
    const current = parseUrlParamBooleanValue(this.currentRoute.snapshot.params['expanded']);
    this.updateUrlParamsWith({expanded: !current})
  }

  showDetailsOf(taskNumber: string) {
    this.currentTaskNumber = taskNumber;
    const currentMasterParams = this.getCurrentMasterParams();
    this.router.navigate([currentMasterParams, taskNumber], {relativeTo: this.currentRoute});
  }

  updateUrlParamsOnNewSearchCriteria(newSearchCriteria: TaskSearchCriteria) {
    this.updateUrlParamsWith(transformSearchCriteriaToParams(newSearchCriteria));
  }

  updateUrlParamsWith(newParams: Params) {
    const currentMasterParams = this.getCurrentMasterParams();
    const mergedMasterParams = {...currentMasterParams, ...newParams};
    const urlParts: (Params | string)[] = [mergedMasterParams];
    const currentDetailsParams = this.currentRoute.snapshot.firstChild?.params;
    const currentTaskNumber = currentDetailsParams?.['taskNumber'] as (string | undefined);
    if (currentTaskNumber) {
      urlParts.push(currentTaskNumber);
      const mergedDetailsParams = {...currentDetailsParams};
      delete mergedDetailsParams['taskNumber'];
      urlParts.push(mergedDetailsParams);
    }
    this.router.navigate(urlParts, {relativeTo: this.currentRoute});
  }

  ngOnDestroy(): void {
    this.forceSearching.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getCurrentMasterParams(): Params {
    const currentMasterParams = {...this.currentRoute.snapshot.params};
    // as the master's params are inherited from the overview, we remove those out of our interest
    delete currentMasterParams[filterStateUrlParamName];
    delete currentMasterParams[sortingUrlParamName];
    return currentMasterParams;
  }

  private forceSearchingByCurrentCriteria() {
    this.forceSearching.next();
  }
}
