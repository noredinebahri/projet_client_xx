import {
  createColumnStateFrom,
  createHeaderTranslateGetter,
  createSortingParametersFrom,
  dateFormatter,
  deserializeFilterState,
  deserializeSortingParameters,
  serializeFilterState,
  serializeSortingParameters,
  SortingParameter
} from '@shared/ag-grid/ag-grid-utils';
import {ApplyColumnStateParams, ColumnState} from 'ag-grid-community/dist/lib/columns/columnModel';
import format from 'date-fns/format';
import {dateTimeFormat} from '@shared/l10n/date-utils';
import {TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('ag-grid utils', () => {
  describe('filter state', () => {
    it('serializes and deserializes filter state', () => {
      // given
      let taskNumberFilterModel: { [key: string]: any } = {
        taskNumber: {
          filterType: 'text',
          type: 'contains',
          filter: '201'
        }
      };
      // when
      const serializedFilterState = serializeFilterState(taskNumberFilterModel);
      const deserializedFilterState = deserializeFilterState(serializedFilterState);
      // then
      expect(deserializedFilterState).toEqual(taskNumberFilterModel);
    });

    it('deserializes to null if filter state can not be parsed', () => {
      // when
      const deserializedWrongJson = deserializeFilterState('{wrong json...');
      const deserializedNull = deserializeFilterState(null!);
      const deserializedUndefined = deserializeFilterState(undefined!);
      // then
      expect(deserializedWrongJson).toBeNull();
      expect(deserializedNull).toBeNull();
      expect(deserializedUndefined).toBeNull();
    });

    it('serializes to empty string if filter state not passed', () => {
      // when
      const circularDependencyObject: any = {};
      circularDependencyObject.self = circularDependencyObject;
      const serializedCircularDependencyObject = serializeFilterState(circularDependencyObject);
      const serializedNull = serializeFilterState(null!);
      const serializedUndefined = serializeFilterState(undefined!);
      // then
      expect(serializedCircularDependencyObject).toBe('');
      expect(serializedNull).toBe('');
      expect(serializedUndefined).toBe('');
    });
  });

  describe('sorting parameters', () => {
    let sortingParameter1: SortingParameter,
      sortingParameter2: SortingParameter,
      columnState1: ColumnState,
      columnState2: ColumnState;

    beforeEach(() => {
      sortingParameter1 = {propertyName: 'param1', order: 'asc'};
      sortingParameter2 = {propertyName: 'param2', order: 'desc'};
      columnState1 = {
        colId: sortingParameter1.propertyName,
        sort: sortingParameter1.order,
        sortIndex: 0
      };
      columnState2 = {
        colId: sortingParameter2.propertyName,
        sort: sortingParameter2.order,
        sortIndex: 1
      }
    });

    it('serializes sorting parameters', () => {
      // given
      const sortingParameters = [sortingParameter1, sortingParameter2];
      // when
      const serialized = serializeSortingParameters(sortingParameters);
      // then
      expect(serialized).toBe(`param1-asc,param2-desc`);
    });

    it('serializes to empty string if no sorting parameters passed', () => {
      // when
      const serializedEmptyList = serializeSortingParameters([]);
      const serializedNull = serializeSortingParameters(null!);
      const serializedUndefined = serializeSortingParameters(undefined!);
      // then
      expect(serializedEmptyList).toBe('');
      expect(serializedNull).toBe('');
      expect(serializedUndefined).toBe('');
    });

    it('deserializes sorting parameters', () => {
      // given
      const sortingParameters = 'param1-asc,param2-desc';
      // when
      const deserialized = deserializeSortingParameters(sortingParameters);
      // then
      expect(deserialized).toBeTruthy();
      expect(deserialized.length).toBe(2);
      expect(deserialized[0]).toEqual({propertyName: 'param1', order: 'asc'});
      expect(deserialized[1]).toEqual({propertyName: 'param2', order: 'desc'});
    });

    it('deserializes to empty array if no sorting parameters passed', () => {
      // when
      const deserializedEmptyString = deserializeSortingParameters('');
      const deserializedNull = deserializeSortingParameters(null!);
      const deserializedUndefined = deserializeSortingParameters(undefined!);
      // then
      expect(deserializedEmptyString.length).toBe(0);
      expect(deserializedNull.length).toBe(0);
      expect(deserializedUndefined.length).toBe(0);
    });

    it('creates column state from sorting parameters', () => {
      // given
      const sortingParameters = [sortingParameter1, sortingParameter2];
      // when
      const columnState = createColumnStateFrom(sortingParameters);
      // then
      expect(columnState).not.toBeNull();
      expect(columnState?.defaultState).toBeTruthy();
      expect(columnState?.defaultState).toEqual({sort: null});
      expect(columnState?.state).toBeTruthy();
      expect(columnState?.state?.length).toBe(2);
      expect(columnState?.state?.[0]).toEqual(columnState1);
      expect(columnState?.state?.[1]).toEqual(columnState2);
    });

    it('returns empty state when creating state if no sorting parameters passed', () => {
      // when
      const columnStateForNull = createColumnStateFrom(null);
      const columnStateForUndefined = createColumnStateFrom(undefined!);
      // then
      expectStateToBeEmpty(columnStateForNull);
      expectStateToBeEmpty(columnStateForUndefined);
    });

    it('returns empty state when creating state from empty list', () => {
      // when
      const columnStateForEmptyList = createColumnStateFrom([]);
      // then
      expectStateToBeEmpty(columnStateForEmptyList);
    });

    it('creates sorting parameters from column state', () => {
      // given
      const columnState: ColumnState[] = [columnState1, columnState2];
      // when
      const sortingParameters = createSortingParametersFrom(columnState);
      // then
      expect(sortingParameters).toBeTruthy();
      expect(sortingParameters.length).toBe(2);
      expect(sortingParameters[0]).toEqual(sortingParameter1);
      expect(sortingParameters[1]).toEqual(sortingParameter2);
    });

    it('returns empty list when no column state passed', () => {
      // when
      const sortingParametersEmptyList = createSortingParametersFrom([]);
      const sortingParametersForNull = createSortingParametersFrom(null!);
      const sortingParametersForUndefined = createSortingParametersFrom(undefined!);
      // then
      expect(sortingParametersEmptyList).toEqual([]);
      expect(sortingParametersForNull).toEqual([]);
      expect(sortingParametersForUndefined).toEqual([]);
    });

    function expectStateToBeEmpty(state: ApplyColumnStateParams) {
      expect(state).not.toBeNull();
      expect(state?.defaultState).toBeTruthy();
      expect(state?.defaultState).toEqual({sort: null});
      expect(state?.state).toBeUndefined();
    }
  });

  describe('value getters / formatters', () => {
    it('formats date columns', () => {
      // given
      const now = new Date();
      const paramStub: any = {value: now}
      // when
      const formattedDate = dateFormatter(paramStub);
      // then
      expect(formattedDate).toBe(format(now, dateTimeFormat));
    });

    it('returns empty string when no date value passed', () => {
      // given
      const paramStubWithUndefinedValue: any = {};
      const paramStubWithNullValue: any = {};
      // when
      const formattedDateForUndefined = dateFormatter(paramStubWithUndefinedValue);
      const formattedDateForNull = dateFormatter(paramStubWithNullValue);
      // then
      expect(formattedDateForUndefined).toBe('');
      expect(formattedDateForNull).toBe('');
    });

    it('translates header labels', () => {
      // given
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot({defaultLanguage: 'de', useDefaultLang: true})]
      })
      const translate = TestBed.inject<TranslateService>(TranslateService);
      const label = 'Zugewiesen';
      translate.setTranslation('de', {tableHeaders: {assignedTo: label}});
      const headerValueGetter = createHeaderTranslateGetter(translate, 'tableHeaders');
      const paramStub: any = {colDef: {field: 'assignedTo'}}
      // when
      const headerLabel = headerValueGetter(paramStub);
      // expect
      expect(headerLabel).toBe(label);
    });
  });
});
