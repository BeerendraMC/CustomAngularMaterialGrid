import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSortModule, MatTableModule } from '@angular/material';

import { CustomDataGridComponent } from './custom-data-grid.component';

describe('CustomDataGridComponent', () => {
  let component: CustomDataGridComponent;
  let fixture: ComponentFixture<CustomDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, MatSortModule],
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
});
