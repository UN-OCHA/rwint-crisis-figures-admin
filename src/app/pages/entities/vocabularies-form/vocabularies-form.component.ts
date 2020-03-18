import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EntitiesFormComponent } from '@pages/entities/entities-form.component';
import { Country } from '@core/api/entities/country';
import { Vocabulary } from '@core/api/entities/vocabulary';
import { VocabularyService } from '@core/api';
import { AutocompleteSearchDelegate } from '@core/api/types';

@Component({
  selector: 'ngx-vocabularies-form',
  templateUrl: './vocabularies-form.component.html',
  styleUrls: ['./vocabularies-form.component.scss'],
})
export class VocabulariesFormComponent extends EntitiesFormComponent<Vocabulary> implements OnInit {

  entityConstructor = Vocabulary;

  /** */
  countryAcSearchDelegate: AutocompleteSearchDelegate<Country>;

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
