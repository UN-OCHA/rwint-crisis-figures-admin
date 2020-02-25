import { TestBed } from '@angular/core/testing';

import { IndicatorValueService } from './indicator-value.service';

describe('IndicatorValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndicatorValueService = TestBed.get(IndicatorValueService);
    expect(service).toBeTruthy();
  });
});
