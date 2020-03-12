import { Injector, OnDestroy, OnInit, Type } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationEnd, ActivationStart } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Pagination } from '@core/api/services/response-context';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { BaseComponent } from '@pages/entities/base.component';
import { Entity } from '@core/api/entities/entity';
import { ConfirmDialogComponent } from '@theme/components/confirm-dialog/confirm-dialog.component';
import { EntityConstructor } from '@core/api/types';
import { filter } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

export abstract class EntitiesListComponent<T extends Entity> extends BaseComponent implements OnInit, OnDestroy {

  // Constants
  static readonly FILTER_KEY_PREFIX = 'flt.';

  // Dependencies
  protected dialogService: NbDialogService;
  protected toastr: NbToastrService;
  protected entityService: BaseEntityService<T>;
  protected route: ActivatedRoute;
  protected entityFormComponent: Type<any>;

  // Props
  rows: T[] = [];
  listRequestParams: HttpParams;
  pagination: Pagination = new Pagination();
  ColumnMode = ColumnMode;
  filters: Params;
  requiredFilters: Params = {};

  /** Constructor */
  protected constructor(injector: Injector) {
    super(injector);
    this.dialogService = injector.get(NbDialogService);
    this.toastr = injector.get(NbToastrService);

    // Extract filtering properties from route and store them in local filter state
    this.observeRouteChange();
  }
  
  /** @override */
  protected onRouteChange(event): void {
    super.onRouteChange(event);

    const filters = {};
    Object.entries(this.route.snapshot.queryParams)
      .filter(([key, val]) => key.startsWith(EntitiesListComponent.FILTER_KEY_PREFIX))
      .forEach(([key, val]) => filters[String(key).substr(EntitiesListComponent.FILTER_KEY_PREFIX.length)] = val);

    this.updateList(filters);
  }

  /** @override */
  ngOnInit(): void {}

  /** @override */
  ngOnDestroy(): void {}

  /**
   * Update list by optionally setting filtering parameters before setting a list page to load.
   *
   * @param filters
   * @param paginator
   */
  protected updateList(filters?: Params, paginator?: {offset: number}) {
    // Reset the request params in order to repopulate them
    if (filters && filters !== this.filters) {
      this.listRequestParams = new HttpParams();
      this.setListFilter(filters);
    }

    // Submit initial request to fetch entities list by setting
    // pagination offset to the first page.
    this.setListPage(paginator || { offset: 0 });
  }

  /**
   * A handler of ngx-datatable's `page` event. This is triggered
   * when the user navigates to another page in the list.
   *
   * @param offset The new page number requested by the data table.
   *               Note that offsets are ZERO-based.
   */
  setListPage({offset}) {
    this.listRequestParams = this.listRequestParams.set('page', String(offset + 1));
    this.loadList();
  }

  /**
   * Setup list filtering UI with parameters that are created and populated 
   * with values from the URL.
   *
   * @param filters
   */
  protected setListFilter(filters: Params) {
    // Combine new filters with the required ones
    this.filters = {
      ...filters, 
      ...this.requiredFilters,
    };
    
    // Assign list request parameters from filters
    Object.entries(this.filters).forEach(([key, val]) => {
      if (isArray(val)) {
        val.forEach(multiVal => {
          this.listRequestParams = this.listRequestParams.append(key, multiVal);
        });
      } else {
        this.listRequestParams = this.listRequestParams.set(key, val);
      }
    });
  }

  /**
   * Use the entity service to fetch resources from the API backend.
   *
   * @see setListPage
   */
  protected loadList() {
    this.entityService.list(this.listRequestParams).subscribe(responseContext => {
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

  /**
   * Handle changes to the filtering parameters by reloading the list with
   * updated request parameters.
   *
   * @param filters
   */
  onFiltersChange(filters: Params) {
    // Fixme To be implemented
  }

  // // //  Abstracts

  abstract getEntityConstructor(): EntityConstructor<T>;
}
