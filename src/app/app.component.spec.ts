import { TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { EmployeeService } from './employee.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const employeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
