import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import isObject from 'lodash/isObject';
import { EntitiesFormComponent } from '@pages/entities/entities-form.component';
import { Vocabulary } from '@core/api/entities/vocabulary';
import { Term } from '@core/api/entities/term';
import { VocabularyService, TermService } from '@core/api';
import { AutocompleteSearchDelegate } from '@core/api/types';
import { generateIri, isIri } from '@core/utils/entity.util';

@Component({
  selector: 'ngx-vocabularies-form',
  templateUrl: './terms-form.component.html',
  styleUrls: ['./terms-form.component.scss'],
})
export class TermsFormComponent extends EntitiesFormComponent<Term> implements OnInit {
  /** */
  vocabularyAcSearchDelegate: AutocompleteSearchDelegate<Vocabulary>;

  /** Constructor */
  constructor(protected injector: Injector,
              protected formBuilder: FormBuilder,
              protected dialogRef: NbDialogRef<TermsFormComponent>,
              protected entityService: TermService,
              protected vocabularyService: VocabularyService) {
    super(injector);
    this.vocabularyAcSearchDelegate = this.bindAutocompleteSearchDelegate(vocabularyService);

    // Setup request filters to nest the `vocabulary` relation
    this.filters = this.filters.set('with[]', 'vocabularies');

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'name': ['', Validators.required],
      'label': ['', Validators.required],
      'vocabulary': ['', Validators.required],
    });
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor() {
    return Term;
  }
  // // //  Accessors

  get name() {
    return this.entityForm.get('name');
  }
  get label() {
    return this.entityForm.get('label');
  }
  get vocabulary() {
    return this.entityForm.get('vocabulary');
  }

  // // //

  /** @override */
  protected normalizeFormValues(): any {
    const values = super.normalizeFormValues();

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
  protected populateForm(entity: Term) {
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
