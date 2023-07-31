import { TestBed } from '@angular/core/testing';

import { CFAClaimService } from './cfaclaim.service';

describe('CFAClaimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CFAClaimService = TestBed.get(CFAClaimService);
    expect(service).toBeTruthy();
  });
});
