import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { IndicatorValue } from '@core/api/entities/indicator-value';

@Injectable()
export class IndicatorValueService extends BaseEntityService<IndicatorValue> {

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = IndicatorValue.PLURAL_NAME;
    this.entityConstructor = IndicatorValue;
  }
}
