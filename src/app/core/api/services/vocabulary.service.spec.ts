import { TestBed } from '@angular/core/testing';

import { VocabularyService } from './vocabulary.service';

describe('VocabularyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VocabularyService = TestBed.get(VocabularyService);
    expect(service).toBeTruthy();
  });
});
