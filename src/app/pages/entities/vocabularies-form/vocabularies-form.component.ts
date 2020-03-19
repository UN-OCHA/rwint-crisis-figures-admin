import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EntitiesFormComponent, FormMode } from '@pages/entities/entities-form.component';
import { Country } from '@core/api/entities/country';
import { Vocabulary } from '@core/api/entities/vocabulary';
import { VocabularyService } from '@core/api';
import { AutocompleteSearchDelegate } from '@core/api/types';
import { generateIri, isIri, slugify } from '@core/utils/entity.util';
import isObject from 'lodash/isObject';
import { Term } from '@core/api/entities/term';

@Component({
  selector: 'ngx-vocabularies-form',
  templateUrl: './vocabularies-form.component.html',
  styleUrls: ['./vocabularies-form.component.scss'],
})
export class VocabulariesFormComponent extends EntitiesFormComponent<Vocabulary> implements OnInit {

  /** The state of `name` field editablility */
  enableManualNameEntry: boolean = false;

  /** Constructor */
  constructor(protected injector: Injector,
              protected formBuilder: FormBuilder,
              protected dialogRef: NbDialogRef<VocabulariesFormComponent>,
              protected entityService: VocabularyService) {
    super(injector);

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'name': ['', Validators.required],
      'label': ['', Validators.required],
    });
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();

    // Enable manual name entry by default in `Update` mode
    this.enableManualNameEntry = this.formMode === FormMode.UPDATE;

    // Track changes to `label` field to slugfiy and update `name` field accordingly
    this.observe(this.label.valueChanges).subscribe({
      next: labelValue => {
        if (!this.enableManualNameEntry && this.label.dirty) {
          this.updateNameFromLabel();
        }
      },
    });
  }

  getEntityConstructor() {
    return Vocabulary;
  }

  // // //  Accessors

  get name() {
    return this.entityForm.get('name');
  }
  get label() {
    return this.entityForm.get('label');
  }

  // // //

  /**
   * Set the `name` field value from the `label` value after slugifying it.
   */
  protected updateNameFromLabel() {
    if (this.label.value) {
      this.name.setValue(slugify(this.label.value));

      if (this.name.pristine) {
        this.name.markAsDirty();
      }
    }
  }

  /** @override */
  protected normalizeFormValues(): any {
    const values = super.normalizeFormValues();

    // Set the `name` property in the normalized data if it is not already
    // present in form values
    if (!values.name) {
      values.name = this.name.value;
    }

    // Attempt to format related `vocabulary` instance as IRI string;
    // otherwise, remove `vocabulary` property as FormMode.UPDATE is implied.
    if (isObject(values.vocabulary) && values.vocabulary.id) {
      if (values.vocabulary instanceof Vocabulary) {
        values.vocabulary = generateIri(values.vocabulary);
      } else if (isIri(values.vocabulary['@id'])) {
        values.vocabulary = values.vocabulary['@id'];
      } else {
        delete values.vocabulary;
      }
    }

    return values;
  }

  /** @override */
  protected populateForm(entity: Vocabulary) {
    super.populateForm(entity);

    // Ensure the `name` field is initially disabled
    setTimeout(() => {
      if (!this.enableManualNameEntry) {
        this.name.disable();
      }
    });
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

  /**
   * Event handler for `name-edit` checkbox to update the `name` field editability state.
   *
   * @param event
   */
  onNameEditCheckboxChange(event: Event) {
    this.enableManualNameEntry = (event.target as HTMLInputElement).checked;

    if (this.enableManualNameEntry) {
      this.name.enable();
    } else {
      this.name.disable();
      this.updateNameFromLabel();
    }
  }
}
