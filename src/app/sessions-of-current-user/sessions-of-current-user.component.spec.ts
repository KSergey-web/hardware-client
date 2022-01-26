import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsOfCurrentUserComponent } from './sessions-of-current-user.component';

describe('SessionsOfCurrentUserComponent', () => {
  let component: SessionsOfCurrentUserComponent;
  let fixture: ComponentFixture<SessionsOfCurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsOfCurrentUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsOfCurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
