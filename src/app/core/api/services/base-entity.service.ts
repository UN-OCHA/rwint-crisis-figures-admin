import { Injector } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import { environment } from '@env/environment';
import { SerializerService } from '@core/api/services/serializer.service';
import { RequestProcessorService } from '@core/api/services/request-processor.service';
import { ResponseContext } from '@core/api/services/response-context';
import { AutocompleteSearchDelegate, EntityConstructor } from '@core/api/types';
import { Entity } from '@core/api/entities/entity';

/**
 * Base class of all entity services.
 */
export abstract class BaseEntityService<T extends Entity> implements AutocompleteSearchDelegate<T> {
  // // //  Dependencies
  protected http: HttpClient;
  protected requestProcessor: RequestProcessorService;
  protected serializer: SerializerService;

  // // //  Entity-specific props
  protected baseUrl = environment.api.baseUrl;
  protected entityPluralName: string;
  protected entityConstructor: EntityConstructor<T>;
  /** The entity property to primarily use in search operations such as auto-complete fields. */
  protected primarySearchProperty: string;

  /** Constructor */
  protected constructor(injector: Injector) {
    this.http = injector.get<HttpClient>(HttpClient);
    this.serializer = injector.get<SerializerService>(SerializerService);
    this.requestProcessor = injector.get<RequestProcessorService>(RequestProcessorService);
  }

  /**
   * Fetch a single entity.
   * @param identifier number|string
   * @param filters? HttpParams
   */
  one(identifier: number | string, filters?: HttpParams): Observable<ResponseContext<T>> {
    const request = new HttpRequest<T>('GET', `${this.baseUrl}/${this.entityPluralName}/${identifier}`, null, {
      headers: this.getRequestHeaders(),
      params: filters,
    });

    return this.requestProcessor.dispatch<T>(request, this.entityConstructor);
  }

  /**
   * Fetch a list of entities.
   * @param endpoint
   * @param filters? HttpParams
   */
  list(filters?: HttpParams): Observable<ResponseContext<T[]>> {
    const request = new HttpRequest<T>('GET', `${this.baseUrl}/${this.entityPluralName}`, null, {
      headers: this.getRequestHeaders(),
      params: filters,
    });

    return this.requestProcessor.dispatch<T>(request, this.entityConstructor);
  }

  /**
   * Persist entity data.
   *
   * @param entityData (any)
   * @param isPatch (boolean) Indicate whether to persist the given data as a new resource (Post)
   *        or update an existing resource (Patch).
   */
  save(entityData: any, isPatch: boolean = false): Observable<ResponseContext<T>> {
    const entity = this.serializer.deserialize<T>(entityData, this.entityConstructor) as T;
    let headers = this.getRequestHeaders();
    let identifierValuePath = '';

    // Patching a resource requires a different endpoint URI and a different content type.
    if (isPatch) {
      identifierValuePath = `/${entity.getIdentifierValue()}`;
      headers = headers.set('Content-Type', 'application/merge-patch+json');
    }

    const request = new HttpRequest<T>(
      isPatch ? 'PATCH' : 'POST',
      `${this.baseUrl}/${this.entityPluralName}${identifierValuePath}`, entity, {
        headers: headers,
      },
    );

    return this.requestProcessor.dispatch<T>(request, this.entityConstructor);
  }

  /**
   * Submit a request to delete an entity.
   *
   * Delete requests do not return a response body. Upon success, the operation simply returns
   * a positive HTTP status.
   *
   * @param entity [number | string | Entity]
   */
  delete(entity: number | string | Entity): Observable<any> {
    let identifierValue = null;

    if (entity instanceof this.entityConstructor) {
      identifierValue = entity.getIdentifierValue();
    } else if (isString(entity) || isNumber(entity)) {
      identifierValue = entity;
    } else {
      throw new Error('Illegal argument type. Accepted types include numeric, string or Entity instances.');
    }

    const request = new HttpRequest<any>(
      'DELETE',
      `${this.baseUrl}/${this.entityPluralName}/${identifierValue}`, null, {
        headers: this.getRequestHeaders(),
      },
    );

    return this.http.request(request).pipe(
      // Only allow the final response (HTTP Event) to propagate to observers.
      filter(response => response instanceof HttpResponse && response.type === HttpEventType.Response),
    );
  }

  /**
   * Generate default request headers.
   * @return HttpHeaders
   */
  protected getRequestHeaders(): HttpHeaders {
    const headers = new HttpHeaders({...environment.api.defaultHeaders});
    return headers;
  }

  // // //  AutocompleteSearchDelegate implementation

  /** @override */
  acSearch(text$: Observable<string>): Observable<readonly T[]> {
    if (this.primarySearchProperty) {
      const filters = new HttpParams();
      return text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(term => term.length >= 2),
        switchMap(term =>
          this.list(filters.set(this.primarySearchProperty, term)).pipe(
            map(responseContext => responseContext.body),
          ),
        ),
      );
    } else {
      // Did you forget to set the (primarySearchProperty) in the target entity service?
      throw throwError('Entity does not support auto-complete.');
    }
  }
}
