import { environment } from '@env/environment';

export class Pagination {
  /** Total number of items in a collection */
  totalItems: number;

  /** Number of items in a single page */
  pageSize: number = environment.api.pagination.pageSize;

  /**
   * A zero-based index indicating current page number.
   * Use (offset + 1) to actual page number.
   */
  offset: number = 0;

  /** Total number of pages (readonly) */
  private _totalPages: number = 0;

  /** Calculate number of pages based on  */
  public get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 0;
  }
}

export class ResponseContext<T> {
  body: any | T | T[];
  pagination?: Pagination;

  /**
   * Create a pagination instance ONLY IF it has not already been created.
   *
   * @return Pagination
   */
  initPagination(): Pagination {
    if (!this.pagination) {
      this.pagination = new Pagination();
    }

    return this.pagination;
  }
}
