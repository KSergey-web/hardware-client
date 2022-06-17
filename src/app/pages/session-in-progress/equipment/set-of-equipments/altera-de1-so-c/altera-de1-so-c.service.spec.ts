import { TestBed } from '@angular/core/testing';

import { AlteraDe1SoCService } from './altera-de1-so-c.service';

describe('AlteraDe1SoCService', () => {
  let service: AlteraDe1SoCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlteraDe1SoCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
