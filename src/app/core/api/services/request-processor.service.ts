import { Injectable } from '@angular/core';
import { BodyExtractorService } from '@core/api/services/body-extractor.service';
import { SerializerService } from '@core/api/services/serializer.service';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';
import { ResponseContext, Pagination } from '@core/api/services/response-context';
import { EntityConstructor } from '@core/api/types';

@Injectable()
export class RequestProcessorService {

  /** Constructor */
  constructor(protected http: HttpClient,
              protected bodyExtractor: BodyExtractorService,
              protected serializer: SerializerService) {
  }

  /**
   * Start the chain process of submitting the request and processing the response.
   *
   * @param request
   * @return Observable<ResponseContext<T>>
   */
  dispatch<T>(request: HttpRequest<T>, entityConstructor: EntityConstructor<T>): Observable<ResponseContext<T>> {
    // Create a new ResponseContext for chain processing
    const responseContext: ResponseContext<T> = new ResponseContext();

    return this.http.request(request).pipe(
      // Skip non-response HttpEvent(s)
      skipWhile(httpEvent => httpEvent.type !== HttpEventType.Response),
      // Extract the response body according to its content type
      map((response: HttpResponse<T>) => (
        this.bodyExtractor.extract(response.body, response.headers.get('Content-Type'), responseContext)
      )),
      // Deserialize the body into a proper entity instance which replaces it within the context
      map((ctx: ResponseContext<T>) => (
        this.serializer.deserializeContext<T>(entityConstructor, ctx)
      )),
    );
  }
}
