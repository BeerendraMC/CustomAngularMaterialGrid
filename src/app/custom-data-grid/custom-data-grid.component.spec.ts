import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataGridComponent } from './custom-data-grid.component';

describe('CustomDataGridComponent', () => {
  let component: CustomDataGridComponent;
  let fixture: ComponentFixture<CustomDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDataGridComponent]
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
