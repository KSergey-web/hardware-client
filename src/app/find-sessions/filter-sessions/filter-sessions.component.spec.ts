import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSessionsComponent } from './filter-sessions.component';

describe('FilterSessionsComponent', () => {
  let component: FilterSessionsComponent;
  let fixture: ComponentFixture<FilterSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
