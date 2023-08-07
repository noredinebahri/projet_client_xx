import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskCommentComponent} from '@task/components/task-comment/task-comment.component';
import {PsmFormatDateTimePipe} from '@shared/l10n/format-date-time.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {TaskComment} from '@task/model/task';
import {formatDateTime} from '@shared/l10n/date-utils';

describe('TaskCommentComponent', () => {
  let fixture: ComponentFixture<TaskCommentComponent>;
  let component: TaskCommentComponent;
  let element: HTMLElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [PsmFormatDateTimePipe, TaskCommentComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('shows data of the comment passed', () => {
    // given
    const comment: TaskComment = {
      createdBy: 'bot',
      createdAt: new Date(),
      text: 'Test'
    }
    component.comment = comment;
    // when
    fixture.detectChanges();
    // then
    const textElement = element.querySelector<HTMLDivElement>('div.comment-text');
    expect(textElement).not.toBeNull();
    expect(textElement?.textContent).toBe(comment.text);

    const creatorElement = element.querySelector<HTMLElement>('div.comment-header > strong');
    expect(creatorElement).not.toBeNull();
    expect(creatorElement?.textContent).toBe(comment.createdBy);

    const creationDateElement = element.querySelector<HTMLElement>('div.comment-header > span');
    expect(creationDateElement).not.toBeNull();
    expect(creationDateElement?.textContent).toContain(formatDateTime(comment.createdAt, 'date'));
    expect(creationDateElement?.textContent).toContain(formatDateTime(comment.createdAt, 'time'));
  });
});
