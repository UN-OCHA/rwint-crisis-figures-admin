import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Term } from '@core/api/entities/term';

@Injectable()
export class TermService extends BaseEntityService<Term> {

  /** @override */
  primarySearchProperty = 'label';

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = Term.PLURAL_NAME;
    this.entityConstructor = Term;
  }
}
