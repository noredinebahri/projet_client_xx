import {Params} from '@angular/router';
import {filter, MonoTypeOperatorFunction} from 'rxjs';
import {MapElementReferenceObject, ReferenceObject, TaskSearchCriteria} from '@task/model/task';

export const defaultSearchCriteria: TaskSearchCriteria = {status: 'Open'};

export function searchCriteriaNotChanged(criteria1: TaskSearchCriteria, criteria2: TaskSearchCriteria): boolean {
  return criteria1 && criteria2
    && criteria1.status === criteria2.status
    && criteria1.type === criteria2.type
}

export function createSearchCriteria(params: Params): TaskSearchCriteria {
  const searchCriteria: TaskSearchCriteria = {};
  searchCriteria.status = params?.['status'] ?? undefined;
  return searchCriteria;
}

export function transformSearchCriteriaToParams(searchCriteria: TaskSearchCriteria): Params {
  const params: Params = {};
  params['status'] = searchCriteria?.status ?? '';
  return params;
}

export function breakIfSearchCriteriaNotProvided(
  noSearchCriteriaHookFn: (searchCriteria: TaskSearchCriteria) => void): MonoTypeOperatorFunction<TaskSearchCriteria> {
  return filter<TaskSearchCriteria>(searchCriteria => {
    const statusProvided = !!searchCriteria.status;
    if (!statusProvided) {
      noSearchCriteriaHookFn(searchCriteria);
    }
    return statusProvided;
  });
}

export function isMapElementReferenceObject(
  object: ReferenceObject | MapElementReferenceObject): object is MapElementReferenceObject {
  const mapElementReferenceObject = object as MapElementReferenceObject;
  return mapElementReferenceObject.psmObjectId != null && mapElementReferenceObject.psmObjectType != null;
}
