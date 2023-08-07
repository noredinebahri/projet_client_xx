import {TranslateModule} from '@ngx-translate/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {TaskSearchCriteriaComponent} from './task-search-criteria.component';
import {TaskSearchCriteria, TaskStatus} from '@task/model/task';

describe('TaskSearchCriteriaComponent', () => {
  let fixture: ComponentFixture<TaskSearchCriteriaComponent>;
  let element: HTMLElement;
  let component: TaskSearchCriteriaComponent;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        TaskSearchCriteriaComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSearchCriteriaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('has empty value initially', () => {
    // then
    searchCriteriaOf(element).expect().statusToBe('')
  });

  it('has value of status just set and notifies about its change', (done) => {
    // given
    const searchCriteria: TaskSearchCriteria = {status: 'In Progress'};
    component.valueChange.subscribe(changedSearchCriteria => {
      // then
      expect(changedSearchCriteria.status).toBe(searchCriteria.status);
      done();
    });
    // when
    component.value = searchCriteria;
    fixture.detectChanges();
    // then
    searchCriteriaOf(element).expect().statusToBe(searchCriteria.status!);
  });

  it('notifies about status change', (done) => {
    // 1. given
    const status: TaskStatus = 'In Progress';
    component.valueChange.subscribe(changedSearchCriteria => {
      // 3. then
      expect(changedSearchCriteria.status).toBe(status);
      done();
    });
    // 2. when
    searchCriteriaOf(element).selectStatusOf(status);
    fixture.detectChanges();
  });
});

export function searchCriteriaOf(element: HTMLElement) {
  const viewSelectElement = element.querySelector<HTMLSelectElement>('select#view');
  if (!viewSelectElement) {
    throw new Error('No view select element found!');
  }

  return {
    expect() {
      return {
        statusToBe(status: TaskStatus | '') {
          expect(viewSelectElement.value).toBe(status);
        }
      };
    },

    selectStatusOf(status: TaskStatus) {
      viewSelectElement.value = status;
      viewSelectElement.dispatchEvent(new Event('change'));
    }
  };
}
