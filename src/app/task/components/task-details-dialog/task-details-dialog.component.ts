import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '@task/services/task.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import {TaskComment, TaskDetails, MapElementReferenceObject, TaskStatus} from '@task/model/task';
import {createChangeTaskStatusAction, TaskAction} from '@task/model/task-action';
import {TaskActionMessageComponent} from '@task/components/task-action-message/task-action-message.component';
import {BoundingBox, MapState} from '@shared/map/model';
import {isMapElementReferenceObject} from '@task/components/task-dialog-utils';
import {TaskChangeService} from '@task/services/task-change.service';
import {MapEditorService} from '@shared/map/map-editor.service';
import {ToastService} from '@shared/toast/toast.service';
import {GeoJSON} from 'geojson';

@Component({
  selector: 'psm-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss']
})
export class TaskDetailsDialogComponent implements OnDestroy {
  @ViewChild("taskActionMessage")
  taskActionMessage: TaskActionMessageComponent | undefined;

  readonly taskNumber$: Observable<string>;
  readonly task$: Observable<TaskDetails | null>;
  taskActions: TaskAction<any>[] | undefined;
  serviceActionInProgress = false;
  taskBoundingBox: BoundingBox | null = null;
  mapElementReferenceObjectsAsGeoJson: GeoJSON[] = [];

  private taskStatus: TaskStatus | null = null;
  private previousTaskStatus: TaskStatus | null = null;
  private mapElementReferenceObjects: MapElementReferenceObject[] = [];
  private taskNumber: string | undefined;
  private readonly forceReloading = new BehaviorSubject<void>(undefined);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly currentRoute: ActivatedRoute,
              private readonly taskService: TaskService,
              private readonly router: Router,
              private readonly taskChange: TaskChangeService,
              private readonly mapEditor: MapEditorService,
              private readonly toasts: ToastService
  ) {
    this.taskNumber$ = currentRoute.params.pipe(
      map(params => params?.['taskNumber']),
      tap(taskNumber => {this.taskNumber = taskNumber
      })
    );

    this.task$ = combineLatest([this.taskNumber$, this.forceReloading.asObservable()])
      .pipe(
        map(combinedEmittedValues => combinedEmittedValues[0]),
        tap(() => this.serviceActionInProgress = true),
        tap(() => this.taskActionMessage?.close()),
        tap(() => this.resetTaskActions()),
        switchMap(taskNumber => this.taskService.findByTaskNumber(taskNumber!)
          .pipe(
            catchError(error => {
              this.toasts.show(`Task mit ID ${taskNumber} konnte nicht gefunden werden`);
              setTimeout(() => {
                this.router.navigate(['..'], {relativeTo: this.currentRoute});
              })
              return throwError(() => error);
            }),
          )),
        tap(() => this.serviceActionInProgress = false),
        tap(task => {
          this.taskStatus = (task?.status as TaskStatus) ?? null;
          if (task?.bbox?.northernEdgeLat) {
            this.taskBoundingBox = task?.bbox;
          }
          this.mapElementReferenceObjects = task?.referenceObjects?.filter(isMapElementReferenceObject) ?? [];
          this.mapElementReferenceObjectsAsGeoJson = this.mapElementReferenceObjects
            .filter(refObject => refObject.geoJson != null)
            .map(refObject => refObject.geoJson) as GeoJSON[];
          this.setTaskActionsFromCurrentTask();
        }),
        finalize(() => this.serviceActionInProgress = false)
      );
  }

  goBackToOverview() {
    this.router.navigate(['../'], {relativeTo: this.currentRoute})
  }

  executeAction(action: TaskAction<any>) {
    this.resetTaskActions();
    if (action.type === 'changeTaskStatus') {
      this.changeTaskStatus(action.value,
        () => {
          this.taskActionMessage?.showOneOnStatusChangeSuccess(action.value, [this.taskNumber!])
        });
    }
  }

  undoStatusChange() {
    this.resetTaskActions();
    this.changeTaskStatus(this.previousTaskStatus!,
      () => {
        this.taskActionMessage?.showOneOnUndoStatusChangeSuccess([this.taskNumber!])
      });
  }

  goToPsmEditor(mapState: MapState) {
    if (this.mapElementReferenceObjects.length > 0) {
      const firstReferenceObject = this.mapElementReferenceObjects[0];
      this.mapEditor.openAndSelectObject(`${firstReferenceObject.psmObjectType[0]}${firstReferenceObject.psmObjectId}`)
    } else {
      this.mapEditor.openAt(mapState);
    }
  }

  saveCommentAndReloadTask(comment: TaskComment) {
    this.taskService.saveComment(this.taskNumber!, comment)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.taskChange.emitChange(this.taskNumber!, 'comments');
        this.reloadDetailsOfCurrentTask();
      });
  }

  ngOnDestroy(): void {
    this.forceReloading.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private changeTaskStatus(requestedTaskStatus: TaskStatus, successCallbackFn: () => void) {
    this.serviceActionInProgress = true
    this.taskService.changeStatus([this.taskNumber!], requestedTaskStatus)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.serviceActionInProgress = false;
        this.taskChange.emitChange(this.taskNumber!, 'status');
        this.previousTaskStatus = this.taskStatus;
        this.taskStatus = requestedTaskStatus;
        this.setTaskActionsFromCurrentTask();
        this.reloadDetailsOfCurrentTask();
        successCallbackFn();
      });
  }

  private setTaskActionsFromCurrentTask() {
    this.taskActions = [createChangeTaskStatusAction(this.taskStatus)];
  }

  private resetTaskActions() {
    this.taskActions = undefined;
  }

  private reloadDetailsOfCurrentTask() {
    this.forceReloading.next();
  }
}
