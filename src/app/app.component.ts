import { Component, OnInit } from '@angular/core';
import { GridConfig, ColumnType } from './models/custom-data-grid';
import { EmployeeService } from './employee.service';
import { IEmployee } from './models/employee';

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

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.setGridConfigs();
    this.getEmps();
  }

  setGridConfigs() {
    this.gridConfiguration = [
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
      {
        name: 'phone',
        label: 'Phone',
        columnType: ColumnType.Text,
        sort: true
      },
      {
        name: 'dob',
        label: 'DOB',
        columnType: ColumnType.Date,
        sort: true,
        align: 'right'
      },
      {
        name: 'email',
        label: 'Email',
        columnType: ColumnType.Text,
        align: 'center'
      }
    ];

    this.displayedColumns = ['id', 'name', 'gender', 'phone', 'dob', 'email'];
  }

  getEmps() {
    this.employeeService.getEmployees().subscribe(
      (data: IEmployee[]) => {
        data.forEach(emp => (emp.dob = new Date(emp.dob)));
        setTimeout(() => {
          this.Employees = data;
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

  onGenderChange(data: any) {
    this.GenderChangeData = data;
  }
}
