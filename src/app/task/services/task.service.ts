import {forkJoin, map, Observable, OperatorFunction, throwError} from 'rxjs';
import {
  Task,
  TaskComment,
  TaskCommentTo,
  TaskDetails,
  TaskDetailsTo,
  TaskSearchCriteria,
  TaskStatus,
  TaskTo
} from '@task/model/task';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from '@shared/config/configuration.service';
import {parseDatePropertiesForEachElementOf, parseDatePropertiesOf} from '@shared/l10n/date-utils';
import {GeoJSON} from 'geojson';

@Injectable()
export class TaskService {
  private readonly psmBackendUrl: string;

  constructor(private readonly http: HttpClient, config: ConfigurationService) {
    this.psmBackendUrl = config.psmBackendUrl;
  }

  changeStatus(taskNumbers: string[], requestedStatus: TaskStatus): Observable<void> {
    if (taskNumbers.length > 0) {
      const changeStatusActions = taskNumbers.map(
        taskNumber => this.http.put<void>(`${this.psmBackendUrl}/tasks/${taskNumber}/status`, {status: requestedStatus}));
      return forkJoin(changeStatusActions).pipe(map(() => undefined));
    }
    return throwError(() => new Error('No task numbers provided!'));
  }

  find(searchCriteria: TaskSearchCriteria): Observable<Task[]> {
    return this.http.get<TaskTo[]>(`${this.psmBackendUrl}/tasks?status=${searchCriteria.status}`)
      .pipe(
        map(tasks => parseDatePropertiesForEachElementOf<TaskTo, Task>(tasks, ['createdAt', 'lastChangedAt']))
      )
  }

  findByTaskNumber(taskNumber: string): Observable<TaskDetails> {
    return this.http.get<TaskDetailsTo>(`${this.psmBackendUrl}/tasks/details/${taskNumber}`)
      .pipe(
        parseDatePropertiesOfTaskDetails(),
        addToStringMethodForGeoJsonObjects()
      );
  }

  saveComment(taskNumber: string, payload: TaskComment): Observable<void> {
    return this.http.post<void>(`${this.psmBackendUrl}/tasks/${taskNumber}/comment`, {comment: payload.text});
  }
}

function parseDatePropertiesOfTaskDetails(): OperatorFunction<TaskDetailsTo, TaskDetails> {
  interface TaskDetailsWithCommentTos extends Omit<TaskDetails, 'comments'> {
    comments?: TaskCommentTo[];
  }

  return map<TaskDetailsTo, TaskDetails>(taskDetailsTo => {
    const task = parseDatePropertiesOf<TaskDetailsTo, TaskDetailsWithCommentTos>(taskDetailsTo, ['createdAt', 'lastChangedAt']);
    const commentTos: TaskCommentTo[] | undefined = taskDetailsTo.comments;
    let comments: TaskComment[] = [];
    if (commentTos) {
      comments = parseDatePropertiesForEachElementOf<TaskCommentTo, TaskComment>(commentTos, ['createdAt']);
    }
    return {...task, comments};
  });
}

function addToStringMethodForGeoJsonObjects(): OperatorFunction<TaskDetails, TaskDetails> {
  return map(taskDetails => {
    taskDetails.referenceObjects?.forEach(refObj => {
      if (refObj.geoJson) {
        const geoJson = refObj.geoJson as GeoJSON
        geoJson.toString = function () {
          return this.type ?? 'GeoJSON object'
        }
      }
    })
    return taskDetails;
  })
}
