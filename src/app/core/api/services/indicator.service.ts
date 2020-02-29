import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Indicator } from '@core/api/entities/indicator';

@Injectable()
export class IndicatorService extends BaseEntityService<Indicator> {

  /** @override */
  primarySearchProperty = 'name';

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = Indicator.PLURAL_NAME;
    this.entityConstructor = Indicator;
  }
}
