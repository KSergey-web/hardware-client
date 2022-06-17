import { TestBed } from '@angular/core/testing';
import { CheckAuthChildGuard } from './check-auth-child.guard';

describe('CheckAuthChildrenGuard', () => {
  let guard: CheckAuthChildGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckAuthChildGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
