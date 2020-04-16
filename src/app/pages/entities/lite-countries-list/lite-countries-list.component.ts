import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { Country } from '@core/api/entities/country';
import { CountryService } from '@core/api';

@Component({
  selector: 'ngx-lite-countries-list',
  templateUrl: './lite-countries-list.component.html',
  styleUrls: ['./lite-countries-list.component.scss'],
})
export class LiteCountriesListComponent extends EntitiesListComponent<Country> implements OnInit {

  /** Filtered list of countries */
  filteredCountries: Country[];
  /** Filter form instance */
  listFilterForm: FormGroup;
  /** By default sort by `name` */
  requiredSorts = {
    'name': 'asc',
  };

  /** Constructor */
  constructor(injector: Injector,
              protected formBuilder: FormBuilder,
              protected entityService: CountryService) {
    super(injector);

    // Build country search form
    this.listFilterForm = this.formBuilder.group({
      'name': [''],
    });

    // Track changes to the search field to filter the countries list
    this.observe(this.name.valueChanges).subscribe({
      next: filterQuery => {
        if (this.rows) {
          this.filteredCountries = this.rows.filter(
            country => country.name.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1);
        }
      },
    });
  }

  /** @override */
  ngOnInit() {
    super.ngOnInit();
    this.setRequestParams();
    this.loadList();
  }

  /** @override */
  protected preprocessList(list: Country[]): Country[] {
    // Since the fetching occurs only once thoughout the component's lifecycle,
    // cone fetched `countries` as the `filteredCountries` list.
    const countries = super.preprocessList(list);
    this.filteredCountries = [...countries];
    return countries;
  }

  // // //  Accessors

  get name() {
    return this.listFilterForm.get('name');
  }
}

