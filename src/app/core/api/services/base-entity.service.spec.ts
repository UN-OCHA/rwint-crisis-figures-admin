import { TestBed } from '@angular/core/testing';

import { BaseEntityService } from './base-entity.service';

describe('BaseEntityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseEntityService = TestBed.get(BaseEntityService);
    expect(service).toBeTruthy();
  });
});
