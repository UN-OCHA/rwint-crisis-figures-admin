import { Injector, Injectable } from '@angular/core';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Country } from '@core/api/entities/country';

@Injectable()
export class CountryService extends BaseEntityService<Country> {

  /** @override */
  primarySearchProperty = 'name';

  /** Constructor */
  constructor(private injector: Injector) {
    super(injector);
    this.entityPluralName = 'countries';
    this.entityConstructor = Country;
  }
}
