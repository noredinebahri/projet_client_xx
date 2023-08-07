import {ComponentFixture, TestBed} from "@angular/core/testing"
import {TranslateModule, TranslateService} from "@ngx-translate/core"
import {TaskActionPickerComponent} from "./task-action-picker.component"
import {TranslateEnumPipe} from '@shared/enum/translate-enum.pipe';
import {TaskAction} from '@task/model/task-action';
import {TaskStatus} from '@task/model/task';
import {enumTranslator} from '@shared/enum/enum-translator';
import {clickOnDocumentBody} from '@shared/spec/utils.spec';

describe('TaskActionPickerComponent', () => {
  const translation = {
    task: {
      details: {
        action_picker: {
          choose_action: 'Aktion wählen',
          apply: 'Anwenden',
          action: 'Aktion',
          types: {
            changeTaskStatus: 'Status ändern',
          }
        }
      }
    },
    shared: {
      enums: {
        taskStatus: {
          Closed: 'Erledigt',
          "In Progress": 'In Arbeit',
          Open: 'Zu Erledigen'
        }
      }
    }
  };

  let fixture: ComponentFixture<TaskActionPickerComponent>;
  let component: TaskActionPickerComponent;
  let element: HTMLElement;
  let taskStatusActions: TaskAction<TaskStatus>;
  let translateEnum: { translate(enumValue: string | undefined | null, enumName: string): string };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({defaultLanguage: 'de', useDefaultLang: true})],
      declarations: [TranslateEnumPipe, TaskActionPickerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    const translate = TestBed.inject<TranslateService>(TranslateService);
    translate.setTranslation('de', translation);
    translateEnum = enumTranslator(translate);
    taskStatusActions = {
      type: "changeTaskStatus",
      value: "In Progress",
      availableValues: [
        "Open",
        "In Progress",
        "Closed"
      ]
    };
    fixture = TestBed.createComponent(TaskActionPickerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('does not open actions on click and keeps apply button disabled if no available actions passed', () => {
    // given
    const actionPicker = actionPickerOf(element);
    // when
    actionPicker.clickToPickAction();
    fixture.detectChanges();
    // then
    actionPicker.expect().availableActions().notToBeShown();
    actionPicker.expect().applyButton().toBeDisabled();
  });

  it('opens task actions on click if available actions passed', () => {
    // given
    component.availableTaskActions = [taskStatusActions];
    fixture.detectChanges();
    const actionPicker = actionPickerOf(element);
    // when
    actionPicker.clickToPickAction();
    fixture.detectChanges();
    // then
    actionPicker.expect().availableActions().toBeShown();
    actionPicker.expect().availableActions().toContain([
      translateEnum.translate(taskStatusActions?.availableValues?.[0], 'taskStatus'),
      translateEnum.translate(taskStatusActions?.availableValues?.[1], 'taskStatus'),
      translateEnum.translate(taskStatusActions?.availableValues?.[2], 'taskStatus')
    ]);
    actionPicker.expect().availableActions().toHaveSelectedActionAt(1)
  });

  it('closes opened task actions on click out of available actions', () => {
    // given
    component.availableTaskActions = [taskStatusActions];
    fixture.detectChanges();
    const actionPicker = actionPickerOf(element);
    actionPicker.clickToPickAction();
    fixture.detectChanges();
    // when
    clickOnDocumentBody();
    fixture.detectChanges();
    // then
    actionPicker.expect().availableActions().notToBeShown();
  });

  it('shows selected task action, closes available options and enables apply button after task selected', () => {
    // given
    component.availableTaskActions = [taskStatusActions];
    fixture.detectChanges();
    const actionPicker = actionPickerOf(element);
    actionPicker.clickToPickAction();
    fixture.detectChanges();
    // when
    actionPicker.clickActionAt(0);
    fixture.detectChanges();
    // then
    actionPicker.expect().availableActions().notToBeShown();
    actionPicker.expect().pickActionElement()
      .toContainActionOf(translateEnum.translate(taskStatusActions?.availableValues?.[0], 'taskStatus'));
    actionPicker.expect().applyButton().toBeEnabled();
  });

  it('notifies on task action selection after apply button click', (done) => {
    component.taskActionChange.subscribe(newTaskAction => {
      // 3. then
      expect(newTaskAction).toEqual({value: 'Open', type: 'changeTaskStatus'});
      done();
    });
    // 1. given
    component.availableTaskActions = [taskStatusActions];
    fixture.detectChanges();
    const actionPicker = actionPickerOf(element);
    actionPicker.clickToPickAction();
    fixture.detectChanges();
    actionPicker.clickActionAt(0);
    fixture.detectChanges();
    // 2. when
    actionPicker.clickOnApplyButton();
    fixture.detectChanges();
  });
});

export function actionPickerOf(element: HTMLElement) {
  if (!element) {
    throw new Error('No action picker element passed!');
  }
  return {
    clickToPickAction() {
      const pickActionElement = getPickActionElement();
      pickActionElement.click();
    },

    clickActionAt(index: number) {
      const actionButton = getAvailableActionButtonAt(index);
      actionButton.click();
    },

    clickOnApplyButton() {
      const applyButton = getApplyButton();
      applyButton.click();
    },

    expect() {
      return {
        applyButton() {
          const applyButton = getApplyButton();
          return {
            toBeDisabled() {
              expect(applyButton.disabled).toBeTrue();
            },
            toBeEnabled() {
              expect(applyButton.disabled).toBeFalse();
            }
          }
        },
        availableActions() {
          const availableActions = getAvailableActionsElement();
          return {
            toBeShown() {
              expect(availableActions).not.toBeNull();
            },
            notToBeShown() {
              expect(availableActions).toBeNull();
            },
            toContain(expectedActions: string[]) {
              expectedActions.forEach((expectedAction, index) => {
                const actualActionButton = getAvailableActionButtonAt(index);
                expect(actualActionButton.textContent).toBe(expectedAction);
              });
            },
            toHaveSelectedActionAt(index: number) {
              const availableActions = getAvailableActionsElement();
              if (!availableActions) {
                throw new Error('Available actions not found!');
              }
              const taskActions = availableActions.querySelectorAll<HTMLButtonElement>('ol > li');
              if (index >= taskActions.length) {
                throw new Error(`No task action at index ${index} found!`);
              }
              const taskAction = taskActions[index];
              const tickIcon = taskAction.querySelector<HTMLSpanElement>('span');
              expect(tickIcon).not.toBeNull();
              const button = taskAction.querySelector<HTMLButtonElement>('button');
              expect(button).not.toBeNull();
              expect(button?.disabled).toBeTrue();
            }
          }
        },
        pickActionElement() {
          const pickActionElement = getPickActionElement();
          return {
            toContainActionOf(action: string) {
              const selectedAction = pickActionElement.querySelector('div.selected-action');
              expect(selectedAction).not.toBeNull();
              expect(selectedAction?.textContent).toContain(action);
            }
          }
        }
      }
    }
  };

  function getPickActionElement() {
    const pickActionElement = element.querySelector<HTMLElement>('div.task-action-drop-down');
    if (!pickActionElement) {
      throw new Error('No element to pick action found!');
    }
    return pickActionElement;
  }

  function getApplyButton() {
    const applyButton = element.querySelector<HTMLButtonElement>('button.btn-primary');
    if (!applyButton) {
      throw new Error('No apply button found!');
    }
    return applyButton;
  }

  function getAvailableActionsElement() {
    return element.querySelector<HTMLElement>('div.available-actions');
  }

  function getAvailableActionButtonAt(index: number) {
    const availableActions = getAvailableActionsElement();
    if (!availableActions) {
      throw new Error('Available actions not found!');
    }
    const taskActionButtons = availableActions.querySelectorAll<HTMLButtonElement>('ol > li > button');
    if (index >= taskActionButtons.length) {
      throw new Error(`No task action at index ${index} found!`);
    }
    return taskActionButtons[index];
  }
}
