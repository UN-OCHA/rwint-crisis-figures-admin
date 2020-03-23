import { Component, Injector, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import isString from 'lodash/isString';
import { CountryService, IndicatorService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { Indicator } from '@core/api/entities/indicator';
import { IndicatorValue } from '@core/api/entities/indicator-value';
import { Country } from '@core/api/entities/country';
import { EntitiesGridComponent } from '@pages/entities/entities-grid.component';
import { IndicatorsFormComponent } from '@pages/entities/indicators-form/indicators-form.component';

@Component({
  selector: 'ngx-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.scss'],
})
export class IndicatorsListComponent extends EntitiesGridComponent<Indicator> implements OnInit {

  /** Embed countries and latest values in list response */
  requiredFilters = {
    'with[]': ['country', 'values'],
    'preset': 'latest',
  };

  /** Related `Country` instance used in filtering (if any) */
  country?: Country;

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: IndicatorService,
              protected countryService: CountryService) {
    super(injector);
    this.entityFormComponent = IndicatorsFormComponent;
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor(): EntityConstructor<Indicator> {
    return Indicator;
  }

  /** @override */
  protected setListFilter(filters: Params) {
    super.setListFilter(filters);

    // Load country instance when filtering by country code
    // First, skip fetching the country if it is already loaded and matches filter prop
    if (this.country && this.country.code === this.filters['country.code']) {
      return;
    }

    if (isString(this.filters['country.code'])) {
      setTimeout(() => {
        this.loadCountry(this.filters['country.code']);
      }, 2000);
    } else {
      this.country = undefined;
    }
  }

  /** @override */
  protected buildEntityFormDialogContext(entity?: Indicator): any {
    const context = super.buildEntityFormDialogContext(entity);
    if (this.country) {
      context.prepopulatedProps = {
        country: this.country,
      };
    }

    return context;
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
