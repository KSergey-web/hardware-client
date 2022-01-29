import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartedSessionsComponent } from './started-sessions.component';

describe('StartedSessionsComponent', () => {
  let component: StartedSessionsComponent;
  let fixture: ComponentFixture<StartedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartedSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
