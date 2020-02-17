import { Injector, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Entity } from '@core/api/entities/entity';

/**
 * Base component of entities forms.
 */
export abstract class EntitiesFormComponent<T extends Entity> implements OnInit {
  @Input()
  /** The property used to identify the entity `T` */
  identifierProperty?: string;
  /** The actual value of the `identifierProperty` */
  @Input()
  identifierValue?: number | string;

  // Dependencies
  protected entityService: BaseEntityService<T>;
  protected dialogRef: NbDialogRef<any>;
  protected toastr: NbToastrService;

  // Props
  /** Form instance */
  entityForm: FormGroup;

  /** API request filters used when fetching the entity, if required */
  protected filters: HttpParams = new HttpParams();

  /** Constructor */
  protected constructor(injector: Injector) {
    this.toastr = injector.get(NbToastrService);
  }

  /** @override */
  ngOnInit(): void {
    if (this.identifierValue) {
      this.loadFormValues();
    }
  }

  /**
   * Use the entity service to fetch resources from the API backend.
   * It is NOT RECOMMENDED to use this method to directly populate
   * the data table; for that purpose, use the `setListPage` method.
   *
   * @see setListPage
   */
  protected loadFormValues() {
    this.entityForm.disable();
    this.entityService.one(this.identifierValue, this.filters).subscribe(responseContext => {
      this.entityForm.setValue({...responseContext.body});
    }, error => {
      this.toastr.danger('An error occurred while loading data.', 'Error');
    }, () => {
      this.entityForm.enable();
    });
  }

  /**
   * Persist form data via a call to the entity API service.
   */
  protected saveEntity() {
    const entityData = {
      [this.identifierProperty]: this.identifierValue || null,
      ...this.entityForm.value,
    };
    const isUpdate = entityData[this.identifierProperty] !== null;

    this.entityService.save(entityData, isUpdate).subscribe(responseContext => {
      this.toastr.success('Data saved successfully.', 'Success');
      this.dialogRef.close({ reload: true });
    }, error => {
      this.toastr.danger('An error occurred while saving data.', 'Error');
    });
  }
}
