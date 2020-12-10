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
      { name: 'id', label: 'Id', columnType: ColumnType.Text, sort: true, style: { width: '5%' } },
      { name: 'name', label: 'Name', columnType: ColumnType.LinkAndDescription, sort: true, style: { width: '30%' } },
      {
        name: 'gender',
        label: 'Gender',
        columnType: ColumnType.Dropdown,
        sort: true,
        style: { width: '100px' },
        dropdownValues: [
          { value: 'male', viewValue: 'Male' },
          { value: 'female', viewValue: 'Female' }
        ]
      },
      {
        name: 'phone',
        label: 'Phone',
        columnType: ColumnType.Text,
        sort: true,
        style: { width: '15%' }
      },
      {
        name: 'dob',
        label: 'DOB',
        columnType: ColumnType.Date,
        sort: true,
        align: 'right',
        style: { width: '15%' }
      },
      {
        name: 'email',
        label: 'Email',
        columnType: ColumnType.Text,
        align: 'center',
        style: { width: '20%' }
      }
    ];

    this.displayedColumns = ['id', 'name', 'gender', 'phone', 'dob', 'email'];
  }

  getEmps() {
    this.employeeService.getEmployees().subscribe(
      (data: IEmployee[]) => {
        const empData: IEmployee[] = data.map(emp => ({
          id: emp.id,
          name: { Link: emp.name, Description: emp.description },
          gender: emp.gender,
          phone: emp.phone,
          dob: new Date(emp.dob),
          email: emp.email
        }));
        setTimeout(() => {
          this.Employees = empData;
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
