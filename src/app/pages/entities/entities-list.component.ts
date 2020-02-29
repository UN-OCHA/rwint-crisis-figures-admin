import { Injector, OnInit, Type } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Pagination } from '@core/api/services/response-context';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Entity } from '@core/api/entities/entity';
import { ConfirmDialogComponent } from '@theme/components/confirm-dialog/confirm-dialog.component';
import { EntityConstructor } from '@core/api/types';

export abstract class EntitiesListComponent<T extends Entity> implements OnInit {

  // Dependencies
  protected dialogService: NbDialogService;
  protected toastr: NbToastrService;
  protected entityService: BaseEntityService<T>;
  protected entityFormComponent: Type<any>;

  // Props
  rows: T[] = [];
  filters: HttpParams = new HttpParams();
  pagination: Pagination = new Pagination();
  ColumnMode = ColumnMode;

  /** Constructor */
  protected constructor(injector: Injector) {
    this.dialogService = injector.get(NbDialogService);
    this.toastr = injector.get(NbToastrService);
  }

  /** @override */
  ngOnInit(): void {
    // Submit initial request to fetch entities list by setting
    // pagination offset to the first page.
    this.setListPage({ offset: 0 });
  }

  /**
   * A handler of ngx-datatable's `page` event. This is triggered
   * when the user navigates to another page in the list.
   *
   * @param offset The new page number requested by the data table.
   *               Note that offsets are ZERO-based.
   */
  protected setListPage({offset}) {
    this.filters = this.filters.set('page', String(offset + 1));
    this.loadList();
  }

  /**
   * Use the entity service to fetch resources from the API backend.
   *
   * @see setListPage
   */
  protected loadList() {
    this.entityService.list(this.filters).subscribe(responseContext => {
      this.rows = this.preprocessList(responseContext.body);

      // Copy pagination properties and adjust offset for UI use
      this.pagination.totalItems = responseContext.pagination.totalItems;
      this.pagination.pageSize = responseContext.pagination.pageSize;
      this.pagination.offset = responseContext.pagination.offset - 1;
    });
  }

  /**
   * A hook for subclasses to manipulate the list of entities before rendering
   * it by the UI.
   *
   * This default implementation returns the list without modifications.
   *
   * @param list
   * @return The modified list
   */
  protected preprocessList(list: T[]): T[] {
    return list;
  }

  /**
   * Build the dialog context of the entity form. It can return arbitrary properties
   * used for rendering and populating the form.
   *
   * @param entity
   * @return An object to populate the dialog context.
   */
  protected buildEntityFormDialogContext(entity?: T): any {
    if (!entity) {
      entity = new (this.getEntityConstructor());
    }

    return {
      identifierProperty: entity && entity.getIdentifierProperty(),
      identifierValue: entity && entity[entity.getIdentifierProperty()],
    };
  }

  /**
   * Display the entity's add/edit form in a modal dialog.
   *
   * If the optional `entity` argument is provided, as in the case of editing
   * an entity, it gets passed to the dialog component in the form of an
   * identifier name/value pair.
   *
   * In the case of creating a new entity, the entity constructor is used to
   * create a dummy entity in order to extract the `identifierProperty` name.
   *
   * @param entity Entity
   */
  showEntityForm(entity?: T) {
    const context = this.buildEntityFormDialogContext(entity);
    this.dialogService
      .open(this.entityFormComponent, { context })
      .onClose.subscribe(result => {
        if (result && result.reload === true) {
          this.loadList();
        }
      },
    );
  }

  /**
   * Delete an entity.
   * @param row
   */
  deleteEntity(entity: Entity) {
    this.entityService.delete(entity).subscribe(() => {
      this.toastr.success('Entity deleted successfully.', 'Success');
      this.loadList();
    }, error => {
      this.toastr.danger('An error occurred while attempting to delete the entity.', 'Error');
    });
  }

  // // //  Event handlers

  /**
   * Click handler for row deletion button.
   */
  onDelete(entity: Entity) {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Confirm Deletion',
        content: `This will permanently delete "${entity.toString()}".`,
      },
    }).onClose.subscribe((result: boolean) => {
      if (result === true) {
        this.deleteEntity(entity);
      }
    });
  }

  // // //  Abstracts

  abstract getEntityConstructor(): EntityConstructor<T>;
}
