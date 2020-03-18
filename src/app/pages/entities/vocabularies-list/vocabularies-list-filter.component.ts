import { Component, Injector, Input, OnInit } from '@angular/core';
import isString from 'lodash/isString';
import { CountryService } from '@core/api';
import { Country } from '@core/api/entities/country';
import { EntitiesListFilterComponent } from '@pages/entities/entities-list-filter.component';

@Component({
  selector: 'ngx-vocabularies-list-filter',
  templateUrl: './vocabularies-list-filter.component.html',
  styleUrls: ['./vocabularies-list-filter.component.scss'],
})
export class VocabulariesListFilterComponent extends EntitiesListFilterComponent implements OnInit {

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

    if (isString(this.filters['country.code'])) {
      this.loadCountry(this.filters['country.code']);
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
