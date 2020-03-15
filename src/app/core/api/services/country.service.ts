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
    this.entityPluralName = Country.PLURAL_NAME;
    this.entityConstructor = Country;
  }

  /** @override */
  protected getCacheTtlForUrl(url: string): number {
    // Cache all, collection and item, country fetch responses for a period long enough
    // to avoid multiple fetching operations within the same page.
    return 3;
  }
}
