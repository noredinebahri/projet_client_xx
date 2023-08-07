import {ColDef, ColumnState, HeaderValueGetterFunc, ValueFormatterParams} from 'ag-grid-community';
import {ApplyColumnStateParams} from 'ag-grid-community/dist/lib/columns/columnModel';
import {formatDateTime} from '@shared/l10n/date-utils';
import {TranslateService} from '@ngx-translate/core';

export const filterStateUrlParamName = 'filterState';

export type FilterState = {
  [key: string]: any;
};

export function deserializeFilterState(deserializedFilterState: string): FilterState | null {
  if (deserializedFilterState) {
    try {
      return JSON.parse(deserializedFilterState);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function serializeFilterState(filterState: FilterState): string {
  if (filterState) {
    try {
      return JSON.stringify(filterState);
    } catch (e) {
      return '';
    }
  }
  return '';
}

export const sortingUrlParamName = 'sortBy';
const sortingParameterSeparator = ',';
const sortingPropertyNameAndOrderSeparator = '-';

export interface SortingParameter {
  propertyName: string;
  order: 'asc' | 'desc';
}

export function serializeSortingParameters(sortingParameters: SortingParameter[]): string {
  if (sortingParameters?.length > 0) {
    return sortingParameters
      .map(sortingParameter => `${sortingParameter.propertyName}${sortingPropertyNameAndOrderSeparator}${sortingParameter.order}`)
      .join(sortingParameterSeparator);
  }
  return '';
}

export function deserializeSortingParameters(serializedSortingParameters: string): SortingParameter[] {
  if (serializedSortingParameters) {
    const sortingParameters = serializedSortingParameters.split(sortingParameterSeparator);
    return sortingParameters
      .reduce<SortingParameter[]>((currentSortingParameters, serializedSortingParameter) => {
        const sorting = deserializeSortingParameter(serializedSortingParameter);
        if (sorting) {
          currentSortingParameters.push(sorting);
        }
        return currentSortingParameters;
      }, []);
  }
  return [];


  function deserializeSortingParameter(serializedSortingParameter: string): SortingParameter | null {
    if (serializedSortingParameter) {
      const propertyNameAndOrder = serializedSortingParameter?.split(sortingPropertyNameAndOrderSeparator);
      if (propertyNameAndOrder.length > 1) {
        const propertyName = propertyNameAndOrder[0];
        const order = propertyNameAndOrder[1];
        if (propertyName && (order === 'asc' || order === 'desc')) {
          return {propertyName, order};
        }
      }
    }
    return null;
  }
}

export function createColumnStateFrom(sortingParameters: SortingParameter[] | null): ApplyColumnStateParams {
  const columnState: ApplyColumnStateParams = {
    defaultState: {sort: null}
  };
  if (sortingParameters && sortingParameters.length > 0) {
    columnState.state = sortingParameters.map((sortingParameter, index) => ({
      colId: sortingParameter.propertyName,
      sort: sortingParameter.order,
      sortIndex: index
    }));
  }
  return columnState;
}

export function createSortingParametersFrom(columnState: ColumnState[]): SortingParameter[] {
  if (!columnState) {
    return [];
  }
  return columnState
    .filter(singleColumnState => singleColumnState.sort != null)
    .sort(((a, b) => {
      const sortIndex1 = a.sortIndex ?? 0;
      const sortIndex2 = b.sortIndex ?? 0;
      return sortIndex1 - sortIndex2;
    }))
    .map(singleColumnState => ({
      propertyName: singleColumnState.colId,
      order: singleColumnState.sort!
    }));
}

export function dateFormatter(params: ValueFormatterParams<Date>): string {
  return formatDateTime(params.value);
}

export function createHeaderTranslateGetter(translate: TranslateService, labelKeyPrefix: string): HeaderValueGetterFunc {
  return function (params) {
    const colDef = params.colDef as ColDef;
    return translate.instant(`${labelKeyPrefix}.${colDef.field}`);
  }
}
