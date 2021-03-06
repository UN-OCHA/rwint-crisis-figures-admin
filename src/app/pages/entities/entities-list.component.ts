import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import isArray from 'lodash/isArray';
import { Pagination } from '@core/api/services/response-context';
import { BaseEntityService } from '@core/api/services/base-entity.service';
import { BaseComponent } from '@pages/entities/base.component';
import { Entity } from '@core/api/entities/entity';
import { EntityConstructor } from '@core/api/types';

@Component({ template: `` })
export class EntitiesListComponent<T extends Entity> extends BaseComponent implements OnInit, OnDestroy {

  // Dependencies
  protected entityService: BaseEntityService<T>;

  // Props
  rows: T[] = [];
  listRequestParams: HttpParams;
  pagination: Pagination = new Pagination();
  filters: Params;
  sorts: Params;
  requiredFilters: Params = {};
  requiredSorts: Params = {};

  /** Constructor */
  constructor(injector: Injector) {
    super(injector);
  }

  /** @override */
  ngOnInit(): void {}

  /** @override */
  ngOnDestroy(): void {}

  /**
   * Update list by optionally setting filtering parameters before setting a list page to load.
   *
   * @param filters
   * @param sorts
   * @param paginator
   */
  protected setRequestParams(filters?: Params, sorts?: Params, paginator?: {offset: number}) {
    // Reset the request params in order to repopulate them
    if (filters || sorts || paginator || !this.listRequestParams || this.listRequestParams.keys().length > 0) {
      this.listRequestParams = new HttpParams();
    }

    if ((filters && filters !== this.filters) || Object.keys(this.requiredFilters).length > 0) {
      this.setListFilter(filters);
    }

    if ((sorts && sorts !== this.sorts) || Object.keys(this.requiredSorts).length > 0) {
      this.setListSort(sorts);
    }

    // Submit initial request to fetch entities list by setting
    // pagination offset to the first page.
    this.setListPage(paginator || { offset: 0 });
  }

  /**
   * Create request parameters from list filtering properties.
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
   * Create request parameters from list sorting properties.
   *
   * @param sorts Params {[property: string]: sortDirection}
   */
  setListSort(sorts: Params) {
    // Combine new filters with the required ones
    this.sorts = {
      ...this.requiredSorts,
      ...sorts,
    };

    // Assign list request parameters from sorts
    Object.entries(this.sorts).forEach(([key, val]) => {
      this.listRequestParams = this.listRequestParams.set(`order[${key}]`, val);
    });
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
  }

  /**
   * Use the entity service to fetch resources from the API backend.
   *
   * @see setListPage
   */
  loadList() {
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
   * A hook for subclasses to return their EntityConstructor.
   *
   * @return EntityConstructor
   */
  getEntityConstructor(): EntityConstructor<T> {
    throw new Error('This class is missing the implementation of `getEntityConstructor()`.');
  }
}
