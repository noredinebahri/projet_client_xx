import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridReadyEvent,
  RowClickedEvent,
  SelectionChangedEvent,
  SortChangedEvent,
  ValueGetterFunc
} from 'ag-grid-community';
import {Task} from '@task/model/task'
import {
  createColumnStateFrom,
  createHeaderTranslateGetter,
  createSortingParametersFrom,
  dateFormatter,
  SortingParameter
} from '@shared/ag-grid/ag-grid-utils';
import {TranslateService} from '@ngx-translate/core';
import {ColumnState} from 'ag-grid-community/dist/lib/columns/columnModel';
import {enumTranslator} from '@shared/enum/enum-translator';
import {ApiCaller, createApiCallDeferrer} from '@shared/dialog/dialog-utils';
import {GridApi} from 'ag-grid-community/dist/lib/gridApi';

const gridLabelKeyPrefix = 'task.overview.results.grid';

@Component({
  selector: 'psm-task-results',
  templateUrl: './task-results.component.html',
  styleUrls: ['./task-results.component.scss']
})
export class TaskResultsComponent {
  sortingParametersLabel = '';
  numberOfResults = 0;
  readonly columnDefs: ColDef[] = [
    {
      field: 'taskNumber',
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {field: 'type'},
    {field: 'status'},
    {field: 'createdAt', valueFormatter: dateFormatter},
    {field: 'lastChangedAt', valueFormatter: dateFormatter}
  ];

  readonly defaultColDef: ColDef = {
    sortable: true, filter: true, floatingFilter: true, resizable: true
  };

  rowSelection: 'single' | 'multiple' = 'multiple';
  readonly rowHeightInPixels = 54;
  readonly headerRowHeightInPixels = 64;

  @Output()
  readonly sortingParametersChange = new EventEmitter<SortingParameter[]>();

  @Output()
  readonly taskClick = new EventEmitter<Task>();

  @Output()
  readonly taskSelectionChange = new EventEmitter<Task[]>();

  private readonly gridApiCaller: ApiCaller<{ gridApi: GridApi, columnApi: ColumnApi }> = createApiCallDeferrer();

  constructor(private readonly translate: TranslateService) {
    this.defaultColDef.headerValueGetter = createHeaderTranslateGetter(translate, gridLabelKeyPrefix);
    const statusColumnDef = this.columnDefs.find(columnDef => columnDef.field === 'status');
    if (statusColumnDef) {
      statusColumnDef.valueGetter = createTranslatedTaskStatusEnumValueGetter(translate);
    }
  }

  @Input()
  set results(newResults: Task[] | null) {
    if (newResults) {
      this.gridApiCaller.execute(({gridApi}) => gridApi.setRowData(newResults))
      this.numberOfResults = newResults?.length;
      this.taskSelectionChange.next([]); // cancel previous selections
    }
  }

  @Input()
  set sortingParameters(newSortingParameters: SortingParameter[] | null) {
    const newColumnState = createColumnStateFrom(newSortingParameters)
    this.gridApiCaller.execute(({columnApi: columnApi}) => {
      columnApi.applyColumnState(newColumnState);
    });
    this.setSortingParametersLabelFrom(newColumnState.state);
  }

  notifyOnTaskClick(event: RowClickedEvent) {
    this.taskClick.next(event.data);
  }

  notifyOnSelectionChange(event: SelectionChangedEvent) {
    this.taskSelectionChange.next(event.api.getSelectedRows())
  }

  onGridReady({api: gridApi, columnApi: columnApi}: GridReadyEvent) {
    this.gridApiCaller.onApiReady({gridApi, columnApi});
    this.gridApiCaller.execute(({gridApi}) => gridApi.sizeColumnsToFit());
    this.gridApiCaller.execute(({columnApi}) => {
      const columnState = columnApi.getColumnState();
      this.setSortingParametersLabelFrom(columnState);
    });
  }

  notifyOnSortingParamsUpdate($event: SortChangedEvent) {
    const columnState = $event.columnApi.getColumnState();
    const sortingParameters = createSortingParametersFrom(columnState);
    this.sortingParametersChange.next(sortingParameters);
  }

  private setSortingParametersLabelFrom(columnState: ColumnState[] | undefined) {
    const sortingColumns = columnState && columnState.length > 0 ?
      columnState.filter(singleColumnState => singleColumnState.sortIndex != null) : [];
    if (sortingColumns && sortingColumns.length > 0) {
      this.sortingParametersLabel = sortingColumns
        .map(sortingParameter => sortingParameter.colId)
        .reduce((label, field, currentIndex, fields) => {
          const lastField = currentIndex === fields.length - 1;
          const fieldLabel = this.translate.instant(`${gridLabelKeyPrefix}.${field}`);
          return `${label}"${fieldLabel}"${lastField ? '' : ', '}`;
        }, `${this.translate.instant('task.overview.results.sortedBy')} `);
    } else {
      this.sortingParametersLabel = this.translate.instant('task.overview.results.noSorting');
    }
  }
}

function createTranslatedTaskStatusEnumValueGetter(translate: TranslateService): ValueGetterFunc<Task> {
  const translateEnum = enumTranslator(translate);

  return function (params) {
    const taskStatusEnumValue = params.data?.status;
    return translateEnum.translate(taskStatusEnumValue, 'taskStatus');
  }
}
