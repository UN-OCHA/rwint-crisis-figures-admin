import { TestBed } from '@angular/core/testing';

import { RequestProcessorService } from './request-processor.service';

describe('RequestProcessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestProcessorService = TestBed.get(RequestProcessorService);
    expect(service).toBeTruthy();
  });
});
