import { TestBed } from '@angular/core/testing';

import { SessionInProgressService } from './session-in-progress.service';

describe('SessionInProgressService', () => {
  let service: SessionInProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionInProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
