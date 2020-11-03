import { Component, OnInit, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-custom-data-grid',
  templateUrl: './custom-data-grid.component.html',
  styleUrls: ['./custom-data-grid.component.css']
})
export class CustomDataGridComponent implements OnInit, OnChanges {
  @Input() gridConfig: GridConfig[];
  @Input() displayedColumns: string[];
  @Input() dataSource: Array<any>;
  @Input() defaultSortColumn?: { name: string; sortDirection: SortDirection };
  @Input() pageSizeOptions?: number[] = [5, 10, 20];
  @Input()
  verticalScrollOffsetInRows?: number; /* No. of rows to introduce vertical scroll if the displayed no. of rows > this no. */
  @Input() searchOption?: {
    onColumn: string;
    onTwoColumns?: string[];
    searchTextBoxLabel: string;
    searchBoxStyle?: {};
  }; /* for global filter set onColumn: 'globalFilter' */
  @Input() noDataMessage = 'N/A';

  @Output() OnLinkClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  gridDataSource: MatTableDataSource<any>;
  tableScrollStyle: {};
  private sortState: Sort;

  get ColumnType() {
    return ColumnType;
  }

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    if (this.defaultSortColumn) {
      this.sortState = {
        active: this.defaultSortColumn.name,
        direction: this.defaultSortColumn.sortDirection
      };
      this.sort.active = this.sortState.active;
      this.sort.direction = this.sortState.direction;
    }
    if (this.verticalScrollOffsetInRows) {
      const maxHeight = 56 * (this.verticalScrollOffsetInRows + 1);
      this.tableScrollStyle = {
        'max-height': maxHeight.toString() + 'px',
        'overflow-y': 'auto'
      };
    }
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
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
          return (data[property].Link as string).toLowerCase();
        }
        return data[property];
      };
      if (this.sortState) {
        this.sort.sortChange.emit(this.sortState);
      }
      if (this.searchOption && this.searchOption.onColumn !== 'globalFilter') {
        this.gridDataSource.filterPredicate = this.customFilterPredicate();
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

  customFilterPredicate(): (data: any, filter: string) => boolean {
    const myFilterPredicate = (data: any, filter: string) => {
      let isMatched: boolean;
      if (this.searchOption.onColumn) {
        if (data[this.searchOption.onColumn] instanceof Date) {
          isMatched = this.datePipe.transform(data[this.searchOption.onColumn]).toLowerCase().indexOf(filter) !== -1;
        } else if (typeof data[this.searchOption.onColumn] === 'object') {
          isMatched = (data[this.searchOption.onColumn].Link as string).toLowerCase().indexOf(filter) !== -1;
        }
        isMatched = data[this.searchOption.onColumn].toString().toLowerCase().indexOf(filter) !== -1;
      } else if (this.searchOption.onTwoColumns && this.searchOption.onTwoColumns.length > 1) {
        if (
          data[this.searchOption.onTwoColumns[0]] instanceof Date &&
          data[this.searchOption.onTwoColumns[1]] instanceof Date
        ) {
          isMatched =
            this.datePipe.transform(data[this.searchOption.onTwoColumns[0]]).toLowerCase().indexOf(filter) !== -1 ||
            this.datePipe.transform(data[this.searchOption.onTwoColumns[1]]).toLowerCase().indexOf(filter) !== -1;
        } else if (
          data[this.searchOption.onTwoColumns[0]] instanceof Date &&
          typeof data[this.searchOption.onTwoColumns[1]] === 'object'
        ) {
          isMatched =
            this.datePipe.transform(data[this.searchOption.onTwoColumns[0]]).toLowerCase().indexOf(filter) !== -1 ||
            (data[this.searchOption.onTwoColumns[1]].Link as string).toLowerCase().indexOf(filter) !== -1;
        } else if (
          typeof data[this.searchOption.onTwoColumns[0]] === 'object' &&
          typeof data[this.searchOption.onTwoColumns[1]] === 'object'
        ) {
          isMatched =
            (data[this.searchOption.onTwoColumns[0]].Link as string).toLowerCase().indexOf(filter) !== -1 ||
            (data[this.searchOption.onTwoColumns[1]].Link as string).toLowerCase().indexOf(filter) !== -1;
        } else if (
          typeof data[this.searchOption.onTwoColumns[0]] === 'object' &&
          data[this.searchOption.onTwoColumns[1]] instanceof Date
        ) {
          isMatched =
            (data[this.searchOption.onTwoColumns[0]].Link as string).toLowerCase().indexOf(filter) !== -1 ||
            this.datePipe.transform(data[this.searchOption.onTwoColumns[1]]).toLowerCase().indexOf(filter) !== -1;
        }
        isMatched =
          data[this.searchOption.onTwoColumns[0]].toString().toLowerCase().indexOf(filter) !== -1 ||
          data[this.searchOption.onTwoColumns[1]].toString().toLowerCase().indexOf(filter) !== -1;
      }

      return isMatched;
    };

    return myFilterPredicate;
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
  style?: {};
  sort?: boolean;
  dropdownValues?: Array<{ value: any; viewValue: any }>;
  align?: 'right' | 'center';
}
