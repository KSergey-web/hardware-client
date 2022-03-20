import { TestBed } from '@angular/core/testing';

import { STK500Service } from './stk500.service';

describe('STK500Service', () => {
  let service: STK500Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(STK500Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
