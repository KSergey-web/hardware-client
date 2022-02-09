import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionInProgressComponent } from './session-in-progress.component';

describe('SessionInProgressComponent', () => {
  let component: SessionInProgressComponent;
  let fixture: ComponentFixture<SessionInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionInProgressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
