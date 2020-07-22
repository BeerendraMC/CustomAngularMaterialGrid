import { Component, OnInit, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'custom-data-grid',
  templateUrl: './custom-data-grid.component.html',
  styleUrls: ['./custom-data-grid.component.css']
})
export class CustomDataGridComponent implements OnInit, OnChanges {

  @Input() gridConfig: GridConfig[];
  @Input() displayedColumns: string[];
  @Input() dataSource: Array<any>;
  @Input() defaultSortColumn?: { name: string; sortDirection: SortDirection };
  @Input() pageSizeOptions?: number[] = [5, 10, 20];
  @Input() verticalScrollOffsetInRows?: number; /* No. of rows to introduce vertical scroll if the displayed no. of rows > this no. */
  @Input() searchOption?: { onColumn: string; searchTextBoxLabel: string; searchBoxStyle?: Object }; /* for global filter set onColumn: 'globalFilter' */
  @Input() noDataMessage?: string = 'N/A';

  @Output() OnLinkClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  gridDataSource: MatTableDataSource<any>;
  tableScrollStyle: Object;
  private sortState: Sort;

  get ColumnType() { return ColumnType; }

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.defaultSortColumn) {
      this.sortState = { active: this.defaultSortColumn.name, direction: this.defaultSortColumn.sortDirection };
      this.sort.active = this.sortState.active;
      this.sort.direction = this.sortState.direction;
    }
    if (this.verticalScrollOffsetInRows) {
      const maxHeight = 56 * (this.verticalScrollOffsetInRows + 1);
      this.tableScrollStyle = { 'max-height': maxHeight.toString() + 'px', 'overflow-y': 'auto' };
    }
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.gridDataSource = new MatTableDataSource(this.dataSource);
      this.gridDataSource.paginator = this.paginator;
      this.gridDataSource.sort = this.sort;
      this.gridDataSource.sortingDataAccessor = (data: any, property: string) => {
        if (typeof data[property] === 'string') {
          return data[property].toLowerCase();
        } else if (typeof data[property] === 'object' && typeof data[property].getDate !== 'function') {
          return (<string>data[property].Link).toLowerCase();
        }
        return data[property];
      };
      if (this.sortState) {
        this.sort.sortChange.emit(this.sortState);
      }
      if (this.searchOption && this.searchOption.onColumn !== 'globalFilter') {
        this.gridDataSource.filterPredicate = (data: any, filter: string) => {
          if (data[this.searchOption.onColumn] instanceof Date) {
            return this.datePipe.transform(data[this.searchOption.onColumn]).toLowerCase().indexOf(filter) != -1;
          } else if (typeof data[this.searchOption.onColumn] === 'number') {
            return data[this.searchOption.onColumn].toString().toLowerCase().indexOf(filter) != -1;
          } else if (typeof data[this.searchOption.onColumn] === 'object') {
            return (<string>data[this.searchOption.onColumn].Link).toLowerCase().indexOf(filter) != -1;
          }
          return data[this.searchOption.onColumn].toLowerCase().indexOf(filter) != -1;
        };
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.gridDataSource.filter = filterValue.trim().toLowerCase();

    if (this.gridDataSource.paginator) {
      this.gridDataSource.paginator.firstPage();
    }
  }

  emitClickedElement(element: any) {
    this.OnLinkClick.emit(element);
  }

  emitSelectedElement(element: any, event: MatSelectChange) {
    const emitData = { element, selectedValue: event.value };
    this.OnSelectionChange.emit(emitData);
  }

}

export enum ColumnType {
  Text,
  Date,
  Link,
  Dropdown,
  LinkAndDescription
}

export interface GridConfig {
  name: string;
  label: string;
  columnType: ColumnType;
  style?: Object;
  sort?: boolean;
  dropdownValues?: Array<{ value: any; viewValue: any }>;
  align?: 'right' | 'center';
}
