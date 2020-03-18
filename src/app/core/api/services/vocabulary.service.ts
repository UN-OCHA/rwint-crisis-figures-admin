import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Vocabulary } from '@core/api/entities/vocabulary';

@Injectable()
export class VocabularyService extends BaseEntityService<Vocabulary> {

  /** @override */
  primarySearchProperty = 'label';

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = Vocabulary.PLURAL_NAME;
    this.entityConstructor = Vocabulary;
  }
}
