import { TestBed } from '@angular/core/testing';

import { BodyExtractorService } from './body-extractor.service';

describe('BodyExtractorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyExtractorService = TestBed.get(BodyExtractorService);
    expect(service).toBeTruthy();
  });
});
