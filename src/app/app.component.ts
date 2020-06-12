import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GridConfig, ColumnType } from './custom-data-grid/custom-data-grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gridConfiguration: GridConfig[];
  displayedColumns: string[];
  Employees: IEmployee[];
  selectedEmployee: IEmployee;
  GenderChangeData: any;
  selectedRow: IEmployee;
  defaultSelectedEmployee: IEmployee;

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.gridConfiguration = [
      { name: 'id', label: 'Id', columnType: ColumnType.Text, sort: true, },
      { name: 'name', label: 'Name', columnType: ColumnType.Link, sort: true, disableClearSort: true },
      { name: 'gender', label: 'Gender', columnType: ColumnType.Dropdown, sort: true,
      dropdownValues: [{value: 'male', viewValue: 'Male'}, {value: 'female', viewValue: 'Female'}] },
      { name: 'phone', label: 'Phone', columnType: ColumnType.Text, sort: true },
      { name: 'dob', label: 'DOB', columnType: ColumnType.Date, sort: true, align: 'right' },
      { name: 'email', label: 'Email', columnType: ColumnType.Text, align: 'center' },
      { name: 'delete', label: 'Delete', columnType: ColumnType.Icon, align: 'center', ariaLabel: 'This button will delete this row' }
    ];

    this.displayedColumns = ['id', 'name', 'gender', 'phone', 'dob', 'email', 'delete'];
    this.getEmployees();
  }

  getEmployees() {
    this._http.get<IEmployee[]>('http://localhost:3000/employees').subscribe(
      (data: IEmployee[]) => {
        data.forEach(emp => emp.dob = new Date(emp.dob));
        setTimeout(() => {
          this.Employees = data;
          this.defaultSelectedEmployee = data.find(x => x.name === 'Sundar Pichai');
        }, 2000);
      },
      err => {
        console.error(err);
      }
    );
  }

  onNameClick(emp: IEmployee) {
    this.selectedEmployee = emp;
  }

  onRowClick(emp: IEmployee) {
    this.selectedRow = emp;
  }

  onGenderChange(data: any) {
    this.GenderChangeData = data;
  }

}

interface IEmployee {
  id: number;
  name: string;
  gender: string;
  phone: number;
  dob: Date | string;
  email: string;
}
