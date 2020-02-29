import { Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Entity } from '@core/api/entities/entity';
import { AutocompleteFormatDelegate, AutocompleteSearchDelegate } from '@core/api/types';
import { isValidEntityId } from '@core/utils/entity.util';

export enum FormMode {
  CREATE,
  UPDATE,
}

/**
 * Base component of entities forms.
 */
export abstract class EntitiesFormComponent<T extends Entity>
  implements OnInit, OnDestroy, AutocompleteFormatDelegate<T> {

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
  /** Form mode (update existing entity vs. create new entity) */
  formMode: FormMode;

  /** API request filters used when fetching the entity, if required */
  protected filters: HttpParams = new HttpParams();

  /** Constructor */
  protected constructor(injector: Injector) {
    this.toastr = injector.get(NbToastrService);

  }

  /** @override */
  ngOnInit(): void {
    if (this.identifierValue) {
      this.formMode = FormMode.UPDATE;
      this.loadEntity();
    } else {
      this.formMode = FormMode.CREATE;
    }
  }

  /** @override */
  ngOnDestroy(): void {

  }

  /**
   * Use the entity service to fetch resources from the API backend.
   * It is NOT RECOMMENDED to use this method to directly populate
   * the data table; for that purpose, use the `setListPage` method.
   *
   * @see setListPage
   */
  protected loadEntity() {
    this.entityForm.disable();
    this.entityService.one(this.identifierValue, this.filters).subscribe(responseContext => {
      this.populateForm(responseContext.body);
    }, error => {
      this.toastr.danger('An error occurred while loading data.', 'Error');
    }, () => {
      this.entityForm.enable();
    });
  }

  /**
   * Persist form data via a call to the entity API service. An entity must have
   * a valid `id` property in order to perform an update. Otherwise, the entity
   * will be persisted as a new record.
   */
  protected saveEntity() {
    const entityData = this.normalizeFormValues();
    const isUpdate = this.formMode === FormMode.UPDATE;

    this.entityService.save(entityData, isUpdate).subscribe(responseContext => {
      this.toastr.success('Data saved successfully.', 'Success');
      this.dialogRef.close({reload: true});
    }, error => {
      this.toastr.danger('An error occurred while saving data.', 'Error');
    });
  }

  /**
   * Normalize form values into an object that is valid for the entity API service
   * to save according to the entity's data structure and validation rules.
   *
   * @return The processed form values
   */
  protected normalizeFormValues(): any {
    // Start by injecting the entity identifier (if any) into the data object.
    // Note that the identifier can be overridden if it already exists in the form.
    const values = { ...this.entityForm.value };

    if (this.identifierProperty && isValidEntityId(this.identifierValue)) {
      values[this.identifierProperty] = this.identifierValue;
    }

    return values;
  }

  /**
   * Child classes can use this method to populate (denormalize) the form using
   * values from the entity. This method is typically called the first time the
   * entity is loaded.
   *
   * The default implementation does not handle complex fields that require special
   * formatting or complex logic.
   *
   * @param entity <T>
   */
  protected populateForm(entity: Partial<T>) {
    this.entityForm.patchValue(entity);
  }

  /**
   * By default, the auto-complete directives of `ngbTypeahead` do not bind their searching
   * and formatting functions to any scope. This method performs the binding on the delegate
   * itself.
   *
   * @param delegate The raw auto-complete delegate.
   * @return An auto-complete delegate with the correct bindings.
   */
  protected bindAutocompleteSearchDelegate<U>(delegate: AutocompleteSearchDelegate<U>): AutocompleteSearchDelegate<U> {
    return {
      acSearch: delegate.acSearch.bind(delegate),
    };
  }

  /** @override */
  acInputFormat(entity: T): string {
    return entity.toString();
  }

  /** @override */
  acResultFormat(entity: T): string {
    return entity.toString();
  }
}
