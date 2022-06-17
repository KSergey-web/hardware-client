import { TestBed } from '@angular/core/testing';

import { CheckTeacherGuard } from './check-teacher.guard';

describe('CheckTeacherGuard', () => {
  let guard: CheckTeacherGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckTeacherGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
