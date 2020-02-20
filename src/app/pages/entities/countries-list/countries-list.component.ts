import { Component, Injector, OnInit } from '@angular/core';
import { CountryService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { Country } from '@core/api/entities/country';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { CountriesFormComponent } from '@pages/entities/countries-form/countries-form.component';

@Component({
  selector: 'ngx-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
})
export class CountriesListComponent extends EntitiesListComponent<Country> implements OnInit {

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: CountryService) {
    super(injector);
    this.entityFormComponent = CountriesFormComponent;
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor(): EntityConstructor<Country> {
    return Country;
  }
}
