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
  dropdownValues?: DropdownValue[];
  align?: 'right' | 'center';
}

export interface DropdownValue {
  value: string | number;
  viewValue: string | number;
}
