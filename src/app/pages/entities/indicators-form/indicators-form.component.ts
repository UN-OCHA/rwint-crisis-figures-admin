import { Component, ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { NbDialogRef } from '@nebular/theme';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import sortBy from 'lodash/sortBy';
import { EntitiesFormComponent } from '@pages/entities/entities-form.component';
import { Country } from '@core/api/entities/country';
import { Indicator } from '@core/api/entities/indicator';
import { Term } from '@core/api/entities/term';
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

  /** */
  countryAcSearchDelegate: AutocompleteSearchDelegate<Country>;

  isFlexiLayoutOpen: boolean = false;

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
    this.filters = this.filters
      .append('with[]', 'country')
      .append('with[]', 'terms');

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'name': ['', Validators.required],
      'organization': ['', Validators.required],
      'country': ['', Validators.required],
      'weight': ['0', Validators.required],
      'terms': [''],
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
  get weight() {
    return this.entityForm.get('weight');
  }
  get terms() {
    return this.entityForm.get('terms');
  }

  // // //

  /** @override */
  protected normalizeFormValues(): any {
    const values = super.normalizeFormValues();
    if (isObject(values.country) && values.country.code) {
      values.country = generateIri(Country, values.country.code);
    }

    // Convert the `weight` property to a number if passed as a string
    if (isString(values.weight)) {
      values.weight = Number(values.weight);
    }

    if (isArray(values.terms)) {
      const normalizedTerms = values.terms.map(term => generateIri(Term.PLURAL_NAME, term.id));
      values.terms = normalizedTerms;
    }
    return values;
  }

  /** @override */
  protected populateForm(entity: Indicator) {
    super.populateForm(entity);

    // Set initial values of auto-complete fields
    this.renderer.setProperty(this.countryInput.nativeElement, 'value', entity.country.name);

    // Set the `terms` form property from model
    if (entity.terms) {
      this.setTermsValue(entity.terms);
    }
  }

  /**
   * Update the value of the `terms` form field with the provided list of terms.
   *
   * @param termsList The list of terms to set on the form model.
   * @param markFieldAsDirty A boolean value to indicate whether to mark the `terms`
   *        form field as `dirty`.
   */
  protected setTermsValue(termsList: Term[], markFieldAsDirty: boolean = false) {
    this.terms.setValue(sortBy(termsList, 'name'));
    if (markFieldAsDirty) {
      this.terms.markAsDirty();
    }
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
   * Handle dialog dismissal.
   */
  onDialogDismiss() {
    this.dialogRef.close();
  }

  /**
   * Handle FlexiLayout trigger. This controls whether the FlexiLayout drawer should be
   * in `open` or `closed` state.
   */
  onTrigger() {
    this.isFlexiLayoutOpen = !this.isFlexiLayoutOpen;
  }

  // // // Event Handlers

  /**
   *
   * @param item
   * @param list
   * @param effect
   */
  onDragged(dragEvent: DragEvent, item: any, effect: DropEffect) {
    const list = this.terms.value as Term[];

    console.log(dragEvent);
    // Remove items from dropped outside the list container
    if (effect === 'move' || effect === 'none') {
      const index = list.indexOf(item);
      list.splice(index, 1);
      this.setTermsValue(list, true);
    }
  }

  /**
   *
   * @param event
   * @param list
   */
  onDrop(event: DndDropEvent) {
    const list = this.terms.value as Term[];

    if (list) {
      const itemIndexInModel = (this.terms.value as Term[]).findIndex(term => term.id === (event.data as Term).id);

      if (event.dropEffect === 'copy' || event.dropEffect === 'move') {
        let index = event.index;
        if (typeof index === 'undefined') {
          index = list.length;
        }

        // When copying an item from another list into current, prevent adding the same
        // item to the list more than once
        if (event.dropEffect === 'copy' && itemIndexInModel > -1) {
          return;
        }

        // When moving an item within the same list, remove the original item (drag source)
        if (event.dropEffect === 'move' && itemIndexInModel > -1) {
          list.splice(itemIndexInModel, 1);

          // Account for previously removed item
          if (index > itemIndexInModel) {
            --index;
          }
        }

        // Finally, insert the item in its new index
        list.splice(index, 0, event.data);
      }

      this.setTermsValue(list, true);
    }
  }
}
