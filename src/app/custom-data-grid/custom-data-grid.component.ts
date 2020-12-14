import { Component, OnInit, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { ColumnType, GridConfig } from '../models/custom-data-grid';

/**
 * A configurable and re-usable grid component built on Angular Material data table
 * https://material.angular.io/components/table/overview
 */
@Component({
  selector: 'app-custom-data-grid',
  templateUrl: './custom-data-grid.component.html',
  styleUrls: ['./custom-data-grid.component.css']
})
export class CustomDataGridComponent implements OnInit, OnChanges {
  /** Main grid configuration array, where each object represents the configurations of one column. */
  @Input() gridConfig: GridConfig[];

  /** The set of columns to be displayed. */
  @Input() displayedColumns: string[];

  /** The table's source of data. */
  @Input() dataSource: Array<any>;

  /** Optional default sort column details - name and sort direction. */
  @Input() defaultSortColumn?: { name: string; sortDirection: SortDirection };

  /**
   * The set of provided page size options to display to the user.
   * Defaults to [5, 10, 20].
   */
  @Input() pageSizeOptions: number[] = [5, 10, 20];

  /**
   * Optional number of rows to introduce vertical scroll
   * when the user selects more number of rows than it.
   */
  @Input() verticalScrollOffsetInRows?: number;

  /**
   * Optional filter option details.
   * To have the global filter, set onColumn: 'globalFilter'.
   */
  @Input() searchOption?: {
    onColumn: string;
    onTwoColumns?: string[];
    searchTextBoxLabel: string;
    searchBoxStyle?: {};
  };

  /**
   * The message to be displayed when there is no data.
   * Defaults to 'N/A'.
   */
  @Input() noDataMessage = 'N/A';

  /**
   * Event emitted when any one of the links in the grid has been clicked by the user.
   * Emits the clicked row data.
   */
  @Output() OnLinkClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when the selected value of any one of the dropdowns in the grid
   * has been changed by the user.
   * Emits an object which contains clicked row data and selected value.
   */
  @Output() OnSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event emitted when any one of the custom template's element in the grid has been clicked by the user
   * if it is binding to click event.
   * Emits the clicked row data.
   */
  @Output() OnCustomTemplateClick: EventEmitter<any> = new EventEmitter<any>();

  /** Reference to the MatPaginator. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /** Reference to the MatSort. */
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
        'max-height': `${maxHeight}px`,
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
          const dataObj = data[property];
          return (dataObj[dataObj.SearchSortField] as string).toLowerCase();
        }
        return data[property];
      };
      if (this.sortState) {
        this.sort.sortChange.emit(this.sortState);
      }
      if (this.searchOption) {
        this.gridDataSource.filterPredicate =
          this.searchOption.onColumn === 'globalFilter'
            ? this.customGlobalFilterPredicate()
            : this.customFilterPredicate();
      }
    }
  }

  /**
   * Applies filter by filtering the grid data
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.gridDataSource.filter = filterValue.trim().toLowerCase();

    if (this.gridDataSource.paginator) {
      this.gridDataSource.paginator.firstPage();
    }
  }

  /**
   * Emits clicked row data.
   * @param element
   */
  emitClickedElement(element: any) {
    this.OnLinkClick.emit(element);
  }

  /**
   * Emits clicked row data for custom template.
   * @param element
   */
  emitClickedElementForCustomTemplate(element: any) {
    this.OnCustomTemplateClick.emit(element);
  }

  /**
   * Emits an object which includes selected row data and selected value.
   * @param element
   * @param event
   */
  emitSelectedElement(element: any, event: MatSelectChange) {
    const emitData = { element, selectedValue: event.value };
    this.OnSelectionChange.emit(emitData);
  }

  /**
   * Returns a custom filter predicate function which lets us filter gird data by one or two columns
   * @returns filterPredicate
   */
  customFilterPredicate(): (data: any, filter: string) => boolean {
    const myFilterPredicate = (data: any, filter: string) => {
      let isMatched: boolean;
      if (this.searchOption.onColumn) {
        const onColumnData = data[this.searchOption.onColumn];
        if (onColumnData instanceof Date) {
          isMatched = this.datePipe.transform(onColumnData).toLowerCase().indexOf(filter) !== -1;
        } else if (typeof onColumnData === 'object') {
          isMatched = (onColumnData[onColumnData.SearchSortField] as string).toLowerCase().indexOf(filter) !== -1;
        } else {
          isMatched = onColumnData.toString().toLowerCase().indexOf(filter) !== -1;
        }
      } else if (this.searchOption.onTwoColumns && this.searchOption.onTwoColumns.length > 1) {
        const onTwoColumnsData = [data[this.searchOption.onTwoColumns[0]], data[this.searchOption.onTwoColumns[1]]];
        let dataObj0, dataObj1;
        if (onTwoColumnsData[0] instanceof Date && onTwoColumnsData[1] instanceof Date) {
          isMatched =
            this.datePipe.transform(onTwoColumnsData[0]).toLowerCase().indexOf(filter) !== -1 ||
            this.datePipe.transform(onTwoColumnsData[1]).toLowerCase().indexOf(filter) !== -1;
        } else if (onTwoColumnsData[0] instanceof Date && typeof onTwoColumnsData[1] === 'object') {
          dataObj1 = onTwoColumnsData[1];
          isMatched =
            this.datePipe.transform(onTwoColumnsData[0]).toLowerCase().indexOf(filter) !== -1 ||
            (dataObj1[dataObj1.SearchSortField] as string).toLowerCase().indexOf(filter) !== -1;
        } else if (typeof onTwoColumnsData[0] === 'object' && onTwoColumnsData[1] instanceof Date) {
          dataObj0 = onTwoColumnsData[0];
          isMatched =
            (dataObj0[dataObj0.SearchSortField] as string).toLowerCase().indexOf(filter) !== -1 ||
            this.datePipe.transform(onTwoColumnsData[1]).toLowerCase().indexOf(filter) !== -1;
        } else if (typeof onTwoColumnsData[0] === 'object' && typeof onTwoColumnsData[1] === 'object') {
          dataObj0 = onTwoColumnsData[0];
          dataObj1 = onTwoColumnsData[1];
          isMatched =
            (dataObj0[dataObj0.SearchSortField] as string).toLowerCase().indexOf(filter) !== -1 ||
            (dataObj1[dataObj1.SearchSortField] as string).toLowerCase().indexOf(filter) !== -1;
        } else {
          isMatched =
            onTwoColumnsData[0].toString().toLowerCase().indexOf(filter) !== -1 ||
            onTwoColumnsData[1].toString().toLowerCase().indexOf(filter) !== -1;
        }
      }

      return isMatched;
    };

    return myFilterPredicate;
  }

  /** Recursive function to fetch SearchSortField value of the object for global filter */
  nestedFilterCheck(search: string, data: any, key: string) {
    if (data[key] instanceof Date) {
      search += this.datePipe.transform(data[key]).toLowerCase();
    } else if (typeof data[key] === 'object') {
      search = this.nestedFilterCheck(search, data[key], data[key].SearchSortField);
      /**
       * Use below logic to reduce all the object values and to search by all the fields of the objects.
       * for (const k in data[key]) {
       *   if (data[key][k] !== null) {
       *     search = this.nestedFilterCheck(search, data[key], k);
       *   }
       * }
       */
    } else {
      search += data[key];
    }
    return search;
  }

  /**
   * Returns a custom global filter predicate function which lets us filter gird data globally
   * @returns filterPredicate
   */
  customGlobalFilterPredicate(): (data: any, filter: string) => boolean {
    const myFilterPredicate = (data: any, filter: string) => {
      const accumulator = (currentTerm: string, key: string) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };

    return myFilterPredicate;
  }
}
