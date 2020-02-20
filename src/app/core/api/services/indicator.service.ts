import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Indicator } from '@core/api/entities/indicator';

@Injectable()
export class IndicatorService extends BaseEntityService<Indicator> {

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = 'indicators';
    this.entityConstructor = Indicator;
  }
}
