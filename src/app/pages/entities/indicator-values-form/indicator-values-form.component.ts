import { Component, ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import moment from 'moment';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isDate from 'lodash/isDate';
import { EntitiesFormComponent } from '@pages/entities/entities-form.component';
import { Indicator } from '@core/api/entities/indicator';
import { IndicatorValue } from '@core/api/entities/indicator-value';
import { IndicatorService, IndicatorValueService } from '@core/api';
import { AutocompleteSearchDelegate } from '@core/api/types';
import { generateIri, isIri } from '@core/utils/entity.util';

@Component({
  selector: 'ngx-indicators-form',
  templateUrl: './indicator-values-form.component.html',
  styleUrls: ['./indicator-values-form.component.scss'],
})
export class IndicatorValuesFormComponent extends EntitiesFormComponent<IndicatorValue> implements OnInit {
  /** */
  indicatorAcSearchDelegate: AutocompleteSearchDelegate<Indicator>;

  /** Constructor */
  constructor(protected injector: Injector,
              protected formBuilder: FormBuilder,
              protected dialogRef: NbDialogRef<IndicatorValuesFormComponent>,
              protected entityService: IndicatorValueService,
              protected indicatorService: IndicatorService) {
    super(injector);
    this.indicatorAcSearchDelegate = this.bindAutocompleteSearchDelegate(indicatorService);

    // Setup request filters to nest the `indicator` relation
    this.filters = this.filters.set('with[]', 'indicators');

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'value': ['', Validators.required],
      'date': ['', Validators.required],
      'sourceUrl': ['', Validators.required],
      'indicator': ['', Validators.required],
    });
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor() {
    return IndicatorValue;
  }
  // // //  Accessors

  get value() {
    return this.entityForm.get('value');
  }
  get date() {
    return this.entityForm.get('date');
  }
  get sourceUrl() {
    return this.entityForm.get('sourceUrl');
  }
  get indicator() {
    return this.entityForm.get('indicator');
  }

  // // //

  /** @override */
  protected normalizeFormValues(): any {
    const values = super.normalizeFormValues();

    // Format `value` as number
    if (isString(values.value) && isFinite(parseFloat(values.value))) {
      values.value = parseFloat(values.value);
    }

    // Format `date` as date string
    if (isDate(values.date)) {
      values.date = moment(values.date).format('YYYY-MM-DD');
    }

    // Attempt to format related `indicator` instance as IRI string;
    // otherwise, remove `indicator` property as FormMode.UPDATE is implied.
    if (isObject(values.indicator) && values.indicator.id) {
      if (values.indicator instanceof Indicator) {
        values.indicator = generateIri(values.indicator);
      } else if (isIri(values.indicator['@id'])) {
        values.indicator = values.indicator['@id'];
      } else {
        delete values.indicator;
      }
    }

    return values;
  }

  /** @override */
  protected populateForm(entity: IndicatorValue) {
    // Convert date string to Date instance
    if (isString(entity.date)) {
      entity.date = moment(entity.date).toDate();
    }

    super.populateForm(entity);
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
