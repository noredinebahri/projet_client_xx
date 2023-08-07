import {TestBed} from '@angular/core/testing';
import {TaskService} from './task.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ConfigurationService} from '@shared/config/configuration.service';
import {Task, TaskComment, TaskDetailsTo, TaskSearchCriteria, TaskStatus, TaskTo} from '@task/model/task';
import isEqual from 'date-fns/isEqual';

describe('TaskService', () => {
  const psmBackendUrl = 'dds';
  const iamIssuerUrl = 'iss';
  let taskService: TaskService;
  let httpTestingController: HttpTestingController;
  let taskDetailsMock: TaskDetailsTo;
  let tasksMock: TaskTo[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService,
        {provide: ConfigurationService, useValue: {psmBackendUrl, iamIssuerUrl}}
      ]
    });
    taskService = TestBed.inject<TaskService>(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController)

    taskDetailsMock = {
      taskNumber: 'GEDASTEST-302',
      type: 'PotentialDuplicate',
      status: 'Open',
      reportedBy: 'TA',
      createdAt: '2022-10-14T12:05:55.973Z',
      lastChangedAt: '2022-10-14T12:05:55.973Z',
      description: "While trying to add a new street segment, the system identified a potential duplicate.Please check if the new street segment should be added to PSM or discarded.",
      referenceObjects: [],
      bbox: {
        westernEdgeLong: 0,
        southernEdgeLat: 0,
        easternEdgeLong: 0,
        northernEdgeLat: 0
      },
      comments: [
        {
          id: 1,
          createdAt: '2022-10-14T12:05:55.973Z',
          createdBy: 'gedas_bot',
          text: 'Some comment'
        }
      ]
    };

    tasksMock = [
      {
        taskNumber: "GEDASTEST-291",
        type: "PotentialDuplicate",
        status: "Closed",
        reportedBy: 'amustermann',
        createdAt: '2022-10-20T14:01:21.429Z',
        lastChangedAt: '2022-10-20T14:01:21.429Z'
      },
      {
        taskNumber: "GEDASTEST-191",
        type: "PotentialDuplicate",
        status: "Closed",
        reportedBy: 'amustermann',
        assignedTo: null,
        createdAt: '2022-10-20T14:01:21.429Z',
        lastChangedAt: '2022-10-20T14:01:21.429Z'
      },
    ];
  });

  it('transforms date properties from string to JavaScript Date when requesting task details', (done) => {
    // 1. given
    const taskNumber = 'GEDASTEST-302';
    // 2. when
    taskService.findByTaskNumber(taskNumber).subscribe(
      taskDetails => {
        // 5. then
        expect(taskDetails.taskNumber).toBe(taskNumber)
        expect(isEqual(taskDetails.lastChangedAt!, new Date(taskDetailsMock.lastChangedAt!))).toBeTruthy();
        const commentResponse = taskDetails.comments?.[0];
        const commentMock = taskDetailsMock.comments?.[0];
        expect(isEqual(commentResponse?.createdAt!, new Date(commentMock?.createdAt!))).toBeTruthy();
        done();
      });
    // 3. then
    const request = httpTestingController.expectOne(`${psmBackendUrl}/tasks/details/${taskNumber}`)
    expect(request.request.method).toBe("GET");
    // 4. when (the response flushed)
    request.flush(taskDetailsMock);
  });

  it('transforms date properties from string to JavaScript Date when searching for tasks', (done) => {
    // 1. given
    const searchCriteria: TaskSearchCriteria = {status: 'Closed'};
    // 2. when
    taskService.find(searchCriteria).subscribe(
      tasks => {
        // 5. then
        expect(tasks.length).toBe(2);
        expectDatePropertiesOf(tasks[0]).toEqualToIsoStringDatePropertiesOf(tasksMock[0]);
        expectDatePropertiesOf(tasks[1]).toEqualToIsoStringDatePropertiesOf(tasksMock[1]);
        done();
      });
    // 3. then
    const request = httpTestingController.expectOne(`${psmBackendUrl}/tasks?status=${searchCriteria.status}`)
    expect(request.request.method).toBe("GET");
    // 4. when (the response flushed)
    request.flush(tasksMock);
  });

  it('saves a new comment', (done) => {
    // 1. given
    const taskNumber = 'GEDASTEST-302';
    const comment: TaskComment = {text: 'test for unit test 2'};
    // 2. when
    taskService.saveComment(taskNumber, comment).subscribe(() => done());
    // 3. then
    const request = httpTestingController.expectOne(`${psmBackendUrl}/tasks/${taskNumber}/comment`)
    expect(request.request.method).toBe('POST');
    // 4. when (the response flushed)
    request.flush(null);
  });

  it('changes a status of several tasks', (done) => {
    // 1. given
    const taskNumber1 = 'GEDASTEST-301';
    const taskNumber2 = 'GEDASTEST-302';
    const requestedStatus: TaskStatus = 'In Progress';
    // 2. when
    taskService.changeStatus([taskNumber1, taskNumber2], requestedStatus)
      .subscribe(() => done());
    // 3. then
    const requests = httpTestingController.match({method: 'PUT'});
    expect(requests.length).toBe(2); // two requests should be sent
    requests.forEach( // both requests should have the same body
      request => expect(request.request.body).toEqual({status: requestedStatus}));
    // 4. when (the response flushed)
    requests.forEach(request => request.flush(null));
  });

  it('throws error if no status number provided when requesting status change', (done) => {
    // 1. given
    const requestedStatus: TaskStatus = 'In Progress';
    // 2. when
    taskService.changeStatus([], requestedStatus)
      .subscribe({
        error(e) {
          expect(e.message).toBe('No task numbers provided!')
          done();
        }
      });
  });

  afterEach(() => {
    httpTestingController.verify();
  })
});

function expectDatePropertiesOf(task: Task) {
  return {
    toEqualToIsoStringDatePropertiesOf(taskTo: TaskTo) {
      expect(isEqual(task.lastChangedAt!, new Date(taskTo.lastChangedAt!))).toBeTruthy();
      expect(isEqual(task.createdAt!, new Date(taskTo.createdAt!))).toBeTruthy();
    }
  }
}
