import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EntitiesFormComponent, FormMode } from '@pages/entities/entities-form.component';
import { Country } from '@core/api/entities/country';
import { CountryService } from '@core/api';

@Component({
  selector: 'ngx-countries-form',
  templateUrl: './countries-form.component.html',
  styleUrls: ['./countries-form.component.scss'],
})
export class CountriesFormComponent extends EntitiesFormComponent<Country>
  implements OnInit {

  /** Constructor */
  constructor(protected injector: Injector,
              protected formBuilder: FormBuilder,
              protected dialogRef: NbDialogRef<CountriesFormComponent>,
              protected entityService: CountryService) {
    super(injector);

    // Build entity form
    this.entityForm = this.formBuilder.group({
      'id': [null],
      'code': ['', Validators.required],
      'name': ['', Validators.required],
    });
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  // // //  Accessors

  get code() {
    return this.entityForm.get('code');
  }
  get name() {
    return this.entityForm.get('name');
  }

  // // //

  protected populateForm(entity: Country) {
    super.populateForm(entity);

    setTimeout(() => {
      if (this.formMode === FormMode.UPDATE) {
        this.code.disable();
      }
    });
  }

  // // //   Event handlers

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
