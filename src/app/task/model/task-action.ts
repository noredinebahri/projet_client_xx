import {TaskStatus} from '@task/model/task';

export type TaskActionType = 'changeTaskStatus' | 'assignTask' | 'createNewTask' | 'resubmitTask';

export interface TaskAction<T> {
  type: TaskActionType;
  value: T | null;
  availableValues?: T[];
}

export interface TaskActionValue<T> {
  value: T;
  type: TaskActionType;
}

export function createChangeTaskStatusAction(value: TaskStatus | null): TaskAction<TaskStatus> {
  return {
    type: 'changeTaskStatus',
    value,
    availableValues: ['Open', 'In Progress', 'Closed']
  };
}
