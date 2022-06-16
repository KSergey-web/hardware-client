import { TestBed } from '@angular/core/testing';

import { EquipmentCommunicationService } from './equipment-communication.service';

describe('EquipmentCommunicationService', () => {
  let service: EquipmentCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
