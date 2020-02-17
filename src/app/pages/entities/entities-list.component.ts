import { Injector, OnInit, TemplateRef, Type } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Pagination } from '@core/api/services/response-context';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { Entity } from '@core/api/entities/entity';
import { ConfirmDialogComponent } from '@theme/components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

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
      this.rows = responseContext.body;

      // Copy pagination properties and adjust offset for UI use
      this.pagination.totalItems = responseContext.pagination.totalItems;
      this.pagination.pageSize = responseContext.pagination.pageSize;
      this.pagination.offset = responseContext.pagination.offset - 1;
    });
  }

  /**
   * Display the entity's add/edit form in a modal dialog.
   * The provided `entity` argument is passed to the dialog component.
   *
   * @param dialogComponent
   */
  showEntityForm(entity?: Entity) {
    this.dialogService
      .open(this.entityFormComponent, {
        context: {
          identifierProperty: entity && entity.getIdentifierProperty(),
          identifierValue: entity && entity[entity.getIdentifierProperty()],
        },
      })
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
      this.toastr.success('Entity deleted successfully.');
      this.loadList();
    }, error => {
      this.toastr.danger('An error occurred while attempting to delete the entity.');
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
}
