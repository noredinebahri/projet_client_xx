import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskCommentInputComponent} from '@task/components/task-comment-input/task-comment-input.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('TaskCommentInputComponent', () => {
  let fixture: ComponentFixture<TaskCommentInputComponent>,
    component: TaskCommentInputComponent,
    element: HTMLElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [TaskCommentInputComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TaskCommentInputComponent>(TaskCommentInputComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('shows empty text area with placeholder and disabled send button', () => {
    // then
    taskCommentInputOf(element)
      .expect().textarea().toHavePlaceholder()
      .and.textarea().toHaveText('')
      .and.sendButton().toBeDisabled();
  });

  it('shows input comment in text area', () => {
    // given
    const comment = 'My Comment'
    component.comment = {text: comment};
    // when
    fixture.detectChanges();
    // then
    taskCommentInputOf(element)
      .expect().textarea().toHaveText(comment);
  });

  it('clears input comment in text area', () => {
    // given
    const comment = 'My Comment'
    component.comment = {text: comment};
    fixture.detectChanges();
    // when
    taskCommentInputOf(element).clickOnClearButton();
    // then
    taskCommentInputOf(element)
      .expect().textarea().toHaveText('');
  });

  it('shows empty text area when input comment undefined', () => {
    // given
    component.comment = undefined;
    // when
    fixture.detectChanges();
    // then
    taskCommentInputOf(element)
      .expect().textarea().toHaveText('');
  });

  it('notifies on new comment change when clicked on send button', (done) => {
    // 1. given
    const text = 'New Comment';
    component.commentChange.subscribe(newComment => {
      // 4. then
      expect(newComment.text).toBe(text);
      expect(newComment.id).toBeUndefined();
      expect(newComment.createdBy).toBeUndefined();
      expect(newComment.createdAt).toBeUndefined();
      done();
    });
    // 2. given
    taskCommentInputOf(element).enterText(text)
    fixture.detectChanges();
    // 3. when
    taskCommentInputOf(element).clickOnSendButton()
  });

  it('notifies on existing comment change when clicked on send button', (done) => {
    // 1. given
    const comment = {text: 'Some comment', id: 1, createdAt: new Date(), createdBy: 'someone'};
    const newCommentText = 'New comment'
    component.comment = comment;
    fixture.detectChanges();
    component.commentChange.subscribe(newComment => {
      // 4. then
      expect(newComment.text).toBe(newCommentText);
      expect(newComment.id).toBe(comment.id);
      expect(newComment.createdBy).toBe(comment.createdBy);
      expect(newComment.createdAt).toBe(comment.createdAt);
      done();
    });
    // 2. given
    taskCommentInputOf(element).enterText(newCommentText)
    fixture.detectChanges();
    // 3. when
    taskCommentInputOf(element).clickOnSendButton()
  });
});

function taskCommentInputOf(element: HTMLElement) {
  return {
    expect() {
      const elements = {
        textarea() {
          const textarea = getTextarea();
          return {
            toHaveText(text: string) {
              expect(textarea?.value).toBe(text);
              return chain();
            },
            toHavePlaceholder() {
              expect(textarea?.placeholder).toBeTruthy();
              return chain();
            }
          }
        },
        sendButton() {
          const sendButton = getSendButton();
          return {
            and: elements,
            toBeDisabled() {
              expect(sendButton?.disabled).toBeTruthy();
              return chain();
            }
          }
        }
      };
      return elements;

      function chain() {
        return {and: elements};
      }
    },
    enterText(text: string) {
      const textarea = getTextarea();
      textarea.value = text;
      textarea.dispatchEvent(new Event('input'));
      return this;
    },
    clickOnSendButton() {
      const sendButton = getSendButton();
      sendButton.click();
      return this;
    },
    clickOnClearButton() {
      const sendButton = getClearButton();
      sendButton.click();
      return this;
    }
  }

  function getTextarea() {
    const textarea = element.querySelector<HTMLTextAreaElement>('textarea');
    if (!textarea) {
      throw new Error('Textarea not found!');
    }
    return textarea;
  }

  function getSendButton() {
    const sendButton = element.querySelector<HTMLButtonElement>('button.btn-send');
    if (!sendButton) {
      throw new Error('Textarea not found!');
    }
    return sendButton;
  }

  function getClearButton() {
    const clearButton = element.querySelector<HTMLButtonElement>('button.cancel');
    if (!clearButton) {
      throw new Error('Textarea not found!');
    }
    return clearButton;
  }
}
