import { Injector } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { CacheService } from '@ngx-cache/core';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import { environment } from '@env/environment';
import { SerializerService } from '@core/api/services/serializer.service';
import { RequestProcessorService } from '@core/api/services/request-processor.service';
import { ResponseContext } from '@core/api/services/response-context';
import { AutocompleteSearchDelegate, EntityConstructor, RequestOptions } from '@core/api/types';
import { Entity } from '@core/api/entities/entity';

/**
 * Base class of all entity services.
 */
export abstract class BaseEntityService<T extends Entity> implements AutocompleteSearchDelegate<T> {
  // // //  Dependencies
  protected http: HttpClient;
  protected requestProcessor: RequestProcessorService;
  protected serializer: SerializerService;
  protected cache: CacheService;

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
    this.cache = injector.get<CacheService>(CacheService);
  }

  /**
   * Fetch a single entity.
   *
   * @param identifier number|string
   * @param filters? HttpParams
   * @return Observable<ResponseContext<T>>
   */
  one(identifier: number | string, filters?: HttpParams, options?: RequestOptions): Observable<ResponseContext<T>> {
    const url = `${this.baseUrl}/${this.entityPluralName}/${identifier}`;

    // The cache TTL can be either set while making the request (via `options`) or
    // set by the child API service. The former option gets the precedence. The TTL
    // is used to determine whether are request should be cached; therefore, setting
    // a TTL of `0` or less disables caching.
    const cacheTtl = (options && options.cache && options.cache.ttl)
      ? options.cache.ttl
      : this.getCacheTtlForUrl(url, 'ONE');

    if ((cacheTtl > 0) && this.isUrlCached(url)) {
      return this.getCachedResponse(url);
    }

    const request = new HttpRequest<T>('GET', `${this.baseUrl}/${this.entityPluralName}/${identifier}`, null, {
      headers: this.getRequestHeaders(),
      params: filters,
      withCredentials: true,
    });

    return this.requestProcessor.dispatch<T>(request, this.entityConstructor).pipe(
      tap(responseContext => {
        if (cacheTtl > 0) {
          this.cacheResponseContext(responseContext, url, cacheTtl);
        }
      }),
    );
  }

  /**
   * Fetch a list of entities.
   *
   * @param endpoint
   * @param filters? HttpParams
   * @return Observable<ResponseContext<T[]>>
   */
  list(filters?: HttpParams, options?: Partial<RequestOptions>): Observable<ResponseContext<T[]>> {
    const url = `${this.baseUrl}/${this.entityPluralName}`;

    // The cache TTL can be either set while making the request (via `options`) or
    // set by the child API service. The former option gets the precedence. The TTL
    // is used to determine whether are request should be cached; therefore, setting
    // a TTL of `0` or less disables caching.
    const cacheTtl = (options && options.cache && options.cache.ttl)
      ? options.cache.ttl
      : this.getCacheTtlForUrl(url, 'LIST');

    if ((cacheTtl > 0) && this.isUrlCached(url)) {
      return this.getCachedResponse(url);
    }

    const request = new HttpRequest<T>('GET', url, null, {
      headers: this.getRequestHeaders(),
      params: filters,
      withCredentials: true,
    });

    return this.requestProcessor.dispatch<T>(request, this.entityConstructor).pipe(
      tap(responseContext => {
        if (cacheTtl > 0) {
          this.cacheResponseContext(responseContext, url, cacheTtl);
        }
      }),
    );
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
        withCredentials: true,
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
        withCredentials: true,
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

  /**
   * Determine whether the response of API requests to `url` should be cached by returning
   * the amount of time, in seconds, for which the response should live in cache.
   *
   * Return `0` in order to disable caching for the given `url` which is the default behaviour.
   *
   * @param url The request `url` to verify.
   * @return The response cache duration (aka TTL).
   */
  protected getCacheTtlForUrl(url: string, requestType?: 'LIST' | 'ONE'): number {
    return 0;
  }

  /**
   * Determine whether the response of API requests to `url` is already cached.
   *
   * @param url The request `url` to verify.
   * @return True if response is already cached; otherwise, false.
   */
  protected isUrlCached(url: string): boolean {
    return this.cache.has(url);
  }

  /**
   * Return the cached response using `url` as key.
   *
   * @param url Caching key of response
   * @return The cached ResponseContext instance
   */
  protected getCachedResponse(url: string): Observable<ResponseContext<T[]>> {
    const cachedResponse = this.cache.get(url) as ResponseContext<T>;

    if (cachedResponse) {
      return of(cachedResponse);
    } else {
      return throwError(`Response from ${url} is not cached.`);
    }
  }

  /**
   * Cache the provided `responseContext` under given `key`.
   *
   * @param responseContext The response context to cache.
   * @param key The key used to identify cached response.
   * @param ttl The caching duration of the response
   */
  protected cacheResponseContext(responseContext: ResponseContext<T>, key: string, ttl?: number): void {
    this.cache.set(key, responseContext, 10, { TTL: ttl });
  }

  // // //  AutocompleteSearchDelegate implementation

  /** @override */
  acSearch(text$: Observable<string>,
           searchProperty?: string,
           httpParams?: HttpParams): Observable<readonly T[]> {
    // Default to the `primarySearchProperty` if no custom `searchProperty` is provided.
    const property = searchProperty || this.primarySearchProperty;

    if (property) {
      if (!httpParams) {
        httpParams = new HttpParams();
      }

      return text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(phrase => phrase.length >= 2),
        switchMap(phrase =>
          this.list(httpParams.set(property, phrase)).pipe(
            map(responseContext => responseContext.body),
          ),
        ),
      );
    } else {
      // Did you forget to set a property to search by?
      throw throwError('No search property is provided.');
    }
  }
}
