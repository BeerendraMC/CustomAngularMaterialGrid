# CustomMaterialGrid

CustomDataGrid is a configurable and re-usable component built on angular 8 using [Angular Material data table](https://material.angular.io/components/table/overview).

## How to run

> `npm install`\
> `npm start`

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Documentation

This component dynamically renders the grid using `GridConfig` as Input array of objects where each object represents the configuration of a column. And two events are exposed as output objects, respective actions can be taken on parent components.

This has capability to integrate with any API response format and each actions can be controlled from parent components.

This component also supports for custom CSS (column level), `hyperlinks` and `dropdown`. On click of hyperlink it emits an event (`OnLinkClick`) with the respective row data object. And on selection change of dropdown it emits an event (`OnSelectionChange`) with the respective row data object and the selected value.

Here are the GridConfig interface and ColumnType enum:

```typescript
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
```

### `GridConfig` properties:

- `name`: represents the name of the property to bind to. This should match the property name of your model
- `label`: represents the column label to display on the grid
- `columnType`: it’s of type ColumnType enum. It represents what kind of values that the column is going to have. The Date column will display date objects in ‘MMM dd, yyyy’ format
- `style`: style object. Styles provided here will apply to the respective column
- `sort`: represents whether the sort option is required on the column or not (defaults to false)
- `dropdownValues`: an array of objects representing the dropdown options
- `align`: represents the column alignment (defaults to left)

### Sample Configuration array

```typescript
gridConfiguration: GridConfig[] = [
  { name: 'id', label: 'Id', columnType: ColumnType.Text, sort: true },
  { name: 'name', label: 'Name', columnType: ColumnType.Link, sort: true },
  {
    name: 'gender',
    label: 'Gender',
    columnType: ColumnType.Dropdown,
    sort: true,
    dropdownValues: [
      { value: 'male', viewValue: 'Male' },
      { value: 'female', viewValue: 'Female' }
    ]
  },
  { name: 'phone', label: 'Phone', columnType: ColumnType.Text, sort: true },
  { name: 'dob', label: 'DOB', columnType: ColumnType.Date, sort: true, align: 'right' },
  { name: 'email', label: 'Email', columnType: ColumnType.Text, align: 'center' }
]
```

### List of Features supported by Grid component

- Sort on individual column and default sort option
- Search (Globally or on a particular column or on any two columns. For global filter you must pass ‘globalFilter’ string to the ‘onColumn’ property of ‘searchOption’ input object)
- Pagination
- Configurable page size options
- Vertical scroll bar if the user selects more than the given no of rows per page (that number is configurable). When the user selects 20 rows per page from the page size options the height of the grid increases but our customer wanted to freeze the height to display a certain no of rows (10 or 5) and introduce a vertical scroll if the user wants to view more rows than that number.
- Hyperlink
- Dropdown
- Custom CSS (column level)
- Spinner (while making api call)
- Configurable message to display when there is no data (defaults to ‘No data available.’)
