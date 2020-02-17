import { Injectable } from '@angular/core';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import omitBy from 'lodash/omitBy';
import { ResponseContext } from '@core/api/services/response-context';

/**
 * The body bodyExtractor normalizes the response body according to a given content-type.
 */
@Injectable()
export class BodyExtractorService {
  /**
   * Extract response body based on provided content-type. The request context `context`
   * is populated with relevant data from the extracted body.
   *
   * @param body
   * @param contentType
   * @param context
   * @return ResponseContext
   */
  extract<T>(body: any, contentType: string, context: ResponseContext<T>): ResponseContext<T> {
    if (contentType.indexOf('application/json') > -1) {
      return this.extractJson(body, context);
    } else if (contentType.indexOf('application/ld+json') > -1) {
      return this.extractJsonLD(body, context);
    } else {
      throw new Error(`Body extractor does not support content-type (${contentType})`);
    }
  }

  /**
   * Extract JSON body. By default, the JSON body is returned as is.
   *
   * @param body
   * @param context
   */
  protected extractJson<T>(body: any, context: ResponseContext<T>): ResponseContext<T> {
    context.body = body;
    return context;
  }

  /**
   * Extract JSON-LD body.
   *
   * @param body
   * @param context
   */
  protected extractJsonLD<T>(body: any, context: ResponseContext<T>): ResponseContext<T> {
    // Ensure the body has a `@type` property
    if (isObject(body) && body['@type']) {
      // For collections, extract the `hydra:member` value
      if (body['@type'] === 'hydra:Collection' && body['hydra:member']) {
        context.body = body['hydra:member'];

        // Extract pagination props, if any
        if (isNumber(body['hydra:totalItems'])) {
          context.initPagination();
          context.pagination.totalItems = body['hydra:totalItems'];
        }
      } else { // Single-entity responses only require removal of metadata
        const newBody = omitBy(body, (value: string, key: string) => key.charAt(0) === '@');
        context.body = newBody;
      }
    } else { // Otherwise, treat it as a regular JSON body
      context = this.extractJson(body, context);
    }
    return context;
  }
}
