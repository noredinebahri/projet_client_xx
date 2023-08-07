import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskResultsComponent} from '@task/components/task-results/task-results.component';
import {AgGridModule} from 'ag-grid-angular';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {Task} from '@task/model/task'
import format from 'date-fns/format';
import {dateTimeFormat} from '@shared/l10n/date-utils';

describe('TaskResultsComponent', () => {
  let fixture: ComponentFixture<TaskResultsComponent>;
  let component: TaskResultsComponent;
  let element: HTMLElement;

  const testTask: Task = {
    taskNumber: "GEDASTEST-291",
    type: "PotentialDuplicate",
    status: "Closed",
    reportedBy: 'amustermann',
    createdAt: new Date(),
    lastChangedAt: new Date()
  };

  const translation = {
    task: {
      overview: {
        results: {
          tasks: 'Aufgabe(n)', noSorting: 'Keine Sortierung', sortedBy: 'Sortiert nach',
          grid: {
            taskNumber: 'Aufgaben-Nr.',
            type: 'Aufgabentyp',
            createdAt: 'Erstellungsdatum',
            order: 'Auftrag',
            lastChangedAt: 'Letzte Änderung',
            status: 'Status',
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

  beforeEach(() => {
    return TestBed
      .configureTestingModule({
        declarations: [TaskResultsComponent],
        imports: [FormsModule, AgGridModule, TranslateModule.forRoot({defaultLanguage: 'de', useDefaultLang: true})]
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    const translate = TestBed.inject<TranslateService>(TranslateService);
    translate.setTranslation('de', translation);
  });

  it('renders no rows initially', () => {
    // given
    const agGrid = agGridOf(fixture);
    return agGrid.waitUntilGridReady().then(() => {
      // when
      fixture.detectChanges(); // needed to update sorting info
      // then
      agGrid.expect().toHaveNoRows();
      expectNumberOfResultsInfoIn(element).toBe(`0 ${translation.task.overview.results.tasks}`);
      expectSoringParametersInfoIn(element).toBe(translation.task.overview.results.noSorting);
    });
  });

  it('renders rows and updates number of results when results set', () => {
    // given
    const agGrid = agGridOf(fixture);
    return agGrid.waitUntilGridReady().then(() => {
      // when
      component.results = [testTask];
      fixture.detectChanges();
      // then
      agGrid.expect().toHaveRows(1);
      agGrid.expect().row(0).cellOf('taskNumber').toHaveValue(testTask.taskNumber);
      agGrid.expect().row(0).cellOf('type').toHaveValue(testTask.type);
      agGrid.expect().row(0).cellOf('status').toHaveValue(translation.shared.enums.taskStatus[testTask.status]);
      agGrid.expect().row(0).cellOf('createdAt').toHaveValue(format(testTask.createdAt!, dateTimeFormat));
      agGrid.expect().row(0).cellOf('lastChangedAt').toHaveValue(format(testTask.lastChangedAt!, dateTimeFormat));
      expectNumberOfResultsInfoIn(element).toBe(`1 ${translation.task.overview.results.tasks}`);
    });
  });

  it('updates sorting parameters info when single sorting parameter set', () => {
    // given
    return agGridOf(fixture).waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      // when
      component.sortingParameters = [{propertyName: 'taskNumber', order: 'asc'}];
      fixture.detectChanges();
      // then
      expectSoringParametersInfoIn(element).toBe(
        `${translation.task.overview.results.sortedBy} "${translation.task.overview.results.grid.taskNumber}"`);
    });
  });

  it('updates sorting parameters info when multiple sorting parameter set', () => {
    // given
    return agGridOf(fixture).waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      // when
      component.sortingParameters = [{propertyName: 'taskNumber', order: 'asc'}, {
        propertyName: 'status',
        order: 'desc'
      }];
      fixture.detectChanges();
      // then
      expectSoringParametersInfoIn(element).toBe(
        `${translation.task.overview.results.sortedBy} "${translation.task.overview.results.grid.taskNumber}", "${translation.task.overview.results.grid.status}"`);
    });
  });

  it('updates sorting parameters info when sorting parameter set to null', () => {
    // given
    return agGridOf(fixture).waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      // when
      component.sortingParameters = null;
      fixture.detectChanges();
      // then
      expectSoringParametersInfoIn(element)
        .toBe(`${translation.task.overview.results.noSorting}`);
    });
  });

  it('notifies on sorting parameters change when clicked on column header', (done) => {
    // 1. given
    const agGrid = agGridOf(fixture);
    agGrid.waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      component.sortingParametersChange.subscribe(sortingParams => {
        // 3. then
        expect(sortingParams.length).toBe(1);
        done();
      });
      // 2. when
      agGrid.clickOnColumnHeaderOf('type');
    });
  });

  it('notifies on task click', (done) => {
    // 1. given
    const agGrid = agGridOf(fixture);
    agGrid.waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      component.taskClick.subscribe(task => {
        // 3. then
        expect(task).toBe(testTask);
        done();
      });
      // 2. when
      agGrid.clickOnRow(0);
    });
  });

  it('notifies on task selection', (done) => {
    // 1. given
    const agGrid = agGridOf(fixture);
    agGrid.waitUntilGridReady().then(() => {
      component.results = [testTask];
      fixture.detectChanges();
      component.taskSelectionChange.subscribe(tasks => {
        // 3. then
        expect(tasks.length).toBe(1);
        expect(tasks[0]).toBe(testTask);
        done();
      });
      // 2. when
      agGrid.selectRow(0);
    });
  });
});

function expectNumberOfResultsInfoIn(element: HTMLElement) {
  return {
    toBe(expectedNoOfResultsInfo: string) {
      const noOfResults = element.querySelector<HTMLSpanElement>('span.nbr-task');
      if (!noOfResults) {
        throw new Error(`No number of results info found`);
      }
      expect(noOfResults?.textContent).toBe(expectedNoOfResultsInfo);
    }
  }
}

function expectSoringParametersInfoIn(element: HTMLElement) {
  return {
    toBe(expectedSoringParametersInfo: string) {
      const sortingParameters = element.querySelector<HTMLSpanElement>('span.sorted-by');
      if (!sortingParameters) {
        throw new Error(`No sorting parameters info found`);
      }
      expect(sortingParameters?.textContent).toBe(expectedSoringParametersInfo);
    }
  }
}

export function agGridOf(fixture: ComponentFixture<unknown>) {
  const element = fixture.nativeElement as HTMLElement;

  return {
    waitUntilGridReady() {
      fixture.detectChanges();
      return fixture.whenStable(); // needed as ag-grid fires GridReadyEvent asynchronously
    },

    clickOnColumnHeaderOf(field: string) {
      const taskNumberColumnHeader = element.querySelector<HTMLElement>(`[col-id="${field}"] .ag-header-cell-label`);
      if (!taskNumberColumnHeader) {
        throw new Error(`No column header of ${field} found`);
      }
      taskNumberColumnHeader?.click();
      fixture.detectChanges();
    },

    clickOnRow(row: number) {
      const rowElement = getRowElement(row);
      rowElement.click();
      fixture.detectChanges();
    },

    selectRow(row: number) {
      const rowElement = getRowElement(row);
      const checkboxInput = rowElement.querySelector<HTMLElement>('input.ag-checkbox-input');
      if (!checkboxInput) {
        throw new Error('No checkbox found');
      }
      checkboxInput?.click();
      fixture.detectChanges();
    },

    expect() {
      return {
        toHaveRows(numberOfRows: number) {
          const rows = element.querySelectorAll<HTMLElement>(`[ref="eContainer"] .ag-row`);
          expect(rows.length).toBe(numberOfRows);
        },

        toHaveNoRows() {
          return this.toHaveRows(0);
        },

        row(row: number) {
          return {
            cellOf(field: string) {
              return {
                toHaveValue(value: string) {
                  const rowElement = getRowElement(row);
                  const cellElement = rowElement.querySelector<HTMLElement>(`[col-id="${field}"].ag-cell-value`) // column with selection checkbox
                    || rowElement.querySelector<HTMLElement>(`[col-id="${field}"] .ag-cell-value`); // ordinary column
                  if (!cellElement) {
                    throw new Error(`Cell ${field} in row ${row} could not be found!`);
                  }
                  expect(cellElement?.textContent).toBe(value);
                }
              }
            }
          }
        }
      }
    }
  }

  function getRowElement(row: number) {
    const rowElement = element.querySelector<HTMLElement>(`[ref="eContainer"] [row-index="${row}"].ag-row`);
    if (!rowElement) {
      throw new Error(`Row ${row} could not be found`);
    }
    return rowElement;
  }
}
