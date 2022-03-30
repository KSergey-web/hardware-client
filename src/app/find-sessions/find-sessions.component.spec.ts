import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSessionsComponent } from './find-sessions.component';

describe('FindSessionsComponent', () => {
  let component: FindSessionsComponent;
  let fixture: ComponentFixture<FindSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindSessionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
