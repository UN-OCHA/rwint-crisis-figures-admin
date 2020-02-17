import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CountryService } from '@core/api';
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
}
