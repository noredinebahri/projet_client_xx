import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {TaskOverviewDialogComponent} from '@task/components/task-overview-dialog/task-overview-dialog.component';
import {DialogIconComponent} from '@shared/dialog/dialog-icon/dialog-icon.component';
import {TaskSearchCriteriaComponent} from '@task/components/task-search-criteria/task-search-criteria.component';
import {TaskResultsComponent} from '@task/components/task-results/task-results.component';
import {TaskActionPickerComponent} from '@task/components/task-action-picker/task-action-picker.component';
import {TaskActionMessageComponent} from '@task/components/task-action-message/task-action-message.component';
import {TaskService} from '@task/services/task.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AgGridModule} from 'ag-grid-angular';
import {ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Task} from '@task/model/task';
import {agGridOf} from '@task/components/task-results/task-results.component.spec';
import {searchCriteriaOf} from '@task/components/task-search-criteria/task-search-criteria.component.spec';
import {defaultSearchCriteria} from '@task/components/task-dialog-utils';
import {sortingUrlParamName} from '@shared/ag-grid/ag-grid-utils';
import SpyObj = jasmine.SpyObj;
import {actionPickerOf} from '@task/components/task-action-picker/task-action-picker.component.spec';
import {TranslateEnumPipe} from '@shared/enum/translate-enum.pipe';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastComponent} from '@shared/toast/components/toast/toast.component';

describe('TaskOverviewDialogComponent', () => {
  const results: Task[] = [{
    taskNumber: "GEDASTEST-001",
    type: "PotentialDuplicate",
    status: "Open",
    reportedBy: 'amustermann',
    createdAt: new Date(),
    lastChangedAt: new Date()
  }];

  let fixture: ComponentFixture<TaskOverviewDialogComponent>;
  let component: TaskOverviewDialogComponent;
  let element: HTMLElement;
  let taskServiceSpy: SpyObj<TaskService>;
  let activatedRouteStub: any;
  let routerSpy: SpyObj<Router>;

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>(['find', 'changeStatus']);

    routerSpy = jasmine.createSpyObj<Router>(['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    activatedRouteStub = new ActivatedRouteStub(defaultSearchCriteria);
    return TestBed.configureTestingModule({
      declarations: [
        DialogIconComponent, TaskSearchCriteriaComponent, TaskResultsComponent, TranslateEnumPipe,
        TaskActionMessageComponent, ToastComponent,
        TaskActionPickerComponent, TaskActionMessageComponent, TaskOverviewDialogComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), RouterTestingModule, AgGridModule, NgbToastModule],
      providers: [
        {provide: TaskService, useValue: taskServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: Router, useValue: routerSpy}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskOverviewDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('sets search criteria, searches for tasks and displays the results when params emitted', fakeAsync(() => {
    // given
    taskServiceSpy.find.and.returnValue(of(results));
    fixture.detectChanges();
    flush();
    // then
    searchCriteriaOf(element).expect().statusToBe(defaultSearchCriteria.status!);
    expect(taskServiceSpy.find).toHaveBeenCalledOnceWith(defaultSearchCriteria);
    agGridOf(fixture).expect().toHaveRows(results.length);
  }));

  it('sets default status URL param when empty params emitted by router', fakeAsync(() => {
    // given
    taskServiceSpy.find.and.returnValue(of(results));
    fixture.detectChanges();
    flush(); // to flush all async actions (mostly in AgGrid)
    // when
    activatedRouteStub.emitNewParams({});
    fixture.detectChanges();
    flush() // setTimeout(() => this.updateUrlParamsOnNewSearchCriteria(defaultSearchCriteria));
    fixture.detectChanges();
    // then
    expectUrlParamsToBe(defaultSearchCriteria);
  }));

  it('adds search criteria to URL when sorted by column', fakeAsync(() => {
    // given
    taskServiceSpy.find.and.returnValue(of(results));
    fixture.detectChanges();
    flush(); // to flush all async actions (mostly in AgGrid)
    // when
    agGridOf(fixture).clickOnColumnHeaderOf('type');
    fixture.detectChanges();
    flush();
    // then
    const expectedParams: Params = {...defaultSearchCriteria};
    expectedParams[sortingUrlParamName] = 'type-asc';
    expectUrlParamsToBe(expectedParams);
  }));

  it('navigates to task details dialog after click on result row', fakeAsync(() => {
    // given
    taskServiceSpy.find.and.returnValue(of(results));
    fixture.detectChanges();
    flush(); // to flush all async actions (mostly in AgGrid)
    // when
    agGridOf(fixture).clickOnRow(0);
    fixture.detectChanges();
    flush();
    // then
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['details', results[0].taskNumber], {relativeTo: activatedRouteStub});
  }));

  it('enables changing status after selection of a result row', fakeAsync(() => {
    // given
    taskServiceSpy.find.and.returnValue(of(results));
    taskServiceSpy.changeStatus.and.returnValue(of(undefined));
    fixture.detectChanges();
    flush(); // to flush all async actions (mostly in AgGrid)
    // when
    agGridOf(fixture).selectRow(0);
    fixture.detectChanges();
    flush();
    const actionPicker = actionPickerOf(element);
    actionPicker.clickToPickAction(); // opens available task status actions
    fixture.detectChanges();
    actionPicker.clickActionAt(1) // selects 'In Progress'
    fixture.detectChanges();
    actionPicker.clickOnApplyButton();
    fixture.detectChanges();
    // then
    expect(taskServiceSpy.changeStatus).toHaveBeenCalledWith([results[0].taskNumber], 'In Progress');
    discardPeriodicTasks();
  }));

  function expectUrlParamsToBe(params: Params) {
    const mostRecentCall = routerSpy.navigate.calls.mostRecent();
    const [paramsArgument] = mostRecentCall.args[0];
    expect(paramsArgument).toEqual(params);
  }
});

class ActivatedRouteStub {
  readonly params;
  readonly snapshot;
  private readonly params$;

  constructor(initialParams?: Params) {
    this.params$ = new BehaviorSubject<Params>(initialParams || {});
    this.params = this.params$.asObservable();
    this.snapshot = function (paramsSubject: BehaviorSubject<Params>) {
      return {
        get params() {
          return paramsSubject.value;
        }
      }
    }(this.params$);
  }

  emitNewParams(newParams: Params) {
    this.params$.next(newParams);
  }
}
