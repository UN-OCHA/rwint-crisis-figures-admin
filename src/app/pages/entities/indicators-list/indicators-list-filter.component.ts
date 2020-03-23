import { Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import isString from 'lodash/isString';
import { CountryService } from '@core/api';
import { Country } from '@core/api/entities/country';
import { EntitiesListFilterComponent } from '@pages/entities/entities-list-filter.component';

@Component({
  selector: 'ngx-indicators-list-filter',
  templateUrl: './indicators-list-filter.component.html',
  styleUrls: ['./indicators-list-filter.component.scss'],
})
export class IndicatorsListFilterComponent extends EntitiesListFilterComponent implements OnInit, OnChanges {

  /** Related `Country` instance */
  country: Country;

  /** Constructor */
  constructor(protected injector: Injector,
              protected countryService: CountryService) {
    super(injector);
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters) {
      this.filters = changes.filters.currentValue;

      if (this.filters && isString(this.filters['country.code'])) {
        this.loadCountry(this.filters['country.code']);
      }
    }
  }

  /**
   * Load related `Country` instance.
   *
   * @param countryId
   */
  protected loadCountry(countryId: number) {
    this.countryService.one(countryId).subscribe(responseCtx => {
      this.country = responseCtx.body;
    });
  }
}
