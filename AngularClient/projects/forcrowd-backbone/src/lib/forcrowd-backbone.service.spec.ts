import { TestBed } from '@angular/core/testing';

import { ForcrowdBackboneService } from './forcrowd-backbone.service';

describe('ForcrowdBackboneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForcrowdBackboneService = TestBed.get(ForcrowdBackboneService);
    expect(service).toBeTruthy();
  });
});
