import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColumnType, GridConfig } from '../models/custom-data-grid';

import { CustomDataGridComponent } from './custom-data-grid.component';

describe('CustomDataGridComponent', () => {
  let component: CustomDataGridComponent;
  let fixture: ComponentFixture<CustomDataGridComponent>;
  const mockGridConfiguration: GridConfig[] = [
    { name: 'id', label: 'Id', columnType: ColumnType.Text },
    { name: 'name', label: 'Name', columnType: ColumnType.Link },
    { name: 'gender', label: 'Gender', columnType: ColumnType.Text }
  ];
  const mockDisplayedColumns = ['id', 'name', 'gender'];
  const mockGridData = [
    { id: 1, name: 'Beerendra M C', gender: 'male' },
    { id: 2, name: 'Manju D R', gender: 'male' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatSelectModule,
        MatPaginatorModule,
        BrowserAnimationsModule
      ],
      declarations: [CustomDataGridComponent],
      providers: [
        {
          provide: DatePipe,
          useValue: {
            datePipe: jasmine.createSpy('datePipe')
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test the table', done => {
    component.gridConfig = mockGridConfiguration;
    component.displayedColumns = mockDisplayedColumns;
    component.dataSource = mockGridData;
    component.ngOnChanges();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const tableRows = fixture.nativeElement.querySelectorAll('tr');
      expect(tableRows.length).toBe(mockGridData.length + 1);

      // Header row
      const headerRow = tableRows[0];
      expect(headerRow.cells[0].innerHTML).toContain(mockGridConfiguration[0].label);
      expect(headerRow.cells[1].innerHTML).toContain(mockGridConfiguration[1].label);
      expect(headerRow.cells[2].innerHTML).toContain(mockGridConfiguration[2].label);

      // Data rows
      const row1 = tableRows[1];
      expect(row1.cells[0].innerHTML).toContain(mockGridData[0].id);
      expect(row1.cells[1].innerHTML).toContain(mockGridData[0].name);
      expect(row1.cells[2].innerHTML).toContain(mockGridData[0].gender);

      const row2 = tableRows[2];
      expect(row2.cells[0].innerHTML).toContain(mockGridData[1].id);
      expect(row2.cells[1].innerHTML).toContain(mockGridData[1].name);
      expect(row2.cells[2].innerHTML).toContain(mockGridData[1].gender);

      done();
    });
  });
});
