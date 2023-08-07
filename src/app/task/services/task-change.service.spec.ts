import {TaskChangeService} from './task-change.service';
import {TaskProperty} from '@task/model/task';

describe('TaskChangeService', () => {
  let service: TaskChangeService;

  beforeEach(() => {
    service = new TaskChangeService();
  })

  it('notifies observers after new status is emitted', (done) => {
    // 1. given
    const taskNumber = 'GEDAS-234';
    const changedTaskProperty: TaskProperty = 'status';
    service.values$.subscribe(taskChange => {
      // 3. then
      expect(taskChange.taskNumber).toBe(taskNumber);
      expect(taskChange.changedProperty).toBe(changedTaskProperty);
      done();
    });
    // 2. when
    service.emitChange(taskNumber, changedTaskProperty);
  });

  afterEach(() => {
    service.ngOnDestroy();
  })
});
