import { Component, ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import isObject from 'lodash/isObject';
import { EntitiesFormComponent } from '@pages/entities/entities-form.component';
import { Country } from '@core/api/entities/country';
import { Indicator } from '@core/api/entities/indicator';
import { CountryService, IndicatorService } from '@core/api';
import { AutocompleteSearchDelegate } from '@core/api/types';
import { generateIri } from '@core/utils/entity.util';

@Component({
  selector: 'ngx-indicators-form',
  templateUrl: './indicators-form.component.html',
  styleUrls: ['./indicators-form.component.scss'],
})
export class IndicatorsFormComponent extends EntitiesFormComponent<Indicator> implements OnInit {
  // // //  View elements
  @ViewChild('countryInput', { static: true })
  protected countryInput: ElementRef;

  entityConstructor = Indicator;

  /** */
  countryAcSearchDelegate: AutocompleteSearchDelegate<Country>;

  /** Constructor */
  constructor(protected injector: Injector,
              protected formBuilder: FormBuilder,
              protected renderer: Renderer2,
              protected dialogRef: NbDialogRef<IndicatorsFormComponent>,
              protected entityService: IndicatorService,
              protected countryService: CountryService) {
    super(injector);
    this.countryAcSearchDelegate = this.bindAutocompleteSearchDelegate(countryService);

    // Setup request filters to nest the `country` relation
    this.filters = this.filters.set('with[]', 'country');

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'name': ['', Validators.required],
      'organization': ['', Validators.required],
      'country': ['', Validators.required],
    });
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor() {
    return Indicator;
  }
  // // //  Accessors

  get name() {
    return this.entityForm.get('name');
  }
  get organization() {
    return this.entityForm.get('organization');
  }
  get country() {
    return this.entityForm.get('country');
  }

  // // //

  /** @override */
  protected normalizeFormValues(): any {
    const values = super.normalizeFormValues();
    if (isObject(values.country) && values.country.code) {
      values.country = generateIri(Country, values.country.code);
    }
    return values;
  }

  /** @override */
  protected populateForm(entity: Indicator) {
    super.populateForm(entity);

    // Set initial values of auto-complete fields
    this.renderer.setProperty(this.countryInput.nativeElement, 'value', entity.country.name);
  }

  // // //  Event handlers

  /**
   * Handle form submission.
   * @param event
   */
  onSubmit(event: any) {
    if (this.entityForm.valid) {
      this.saveEntity();
    }
  }

  /**
   * handle dialog dismissal.
   */
  onDialogDismiss() {
    this.dialogRef.close();
  }
}
