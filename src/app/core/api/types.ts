import { ResponseContext } from '@core/api/services/response-context';
import { Observable } from 'rxjs';

export interface RequestOptions {
  cache: {
    ttl: number;
  };
}

/** Enity constructor type */
export interface EntityConstructor<T> {
  new (): T;
}

/** Serializer interface */
export interface Serializer {
  serialize<T>(entity: T | T[]): any | any[];
  deserialize<T>(json: any, entityType: EntityConstructor<T>): T | T[];
  deserializeContext<T>(entityType: EntityConstructor<T>, context: ResponseContext<T>): ResponseContext<T>;
}

/**
 * An interface to be implemented by auto-complete (aka type-ahead) service providers to perform
 * the searching and formatting functionality required by auto-complete fields.
 */
export interface AutocompleteFormatDelegate<T> {
  /**
   * Return a string to populate an auto-complete input field with a description of the given entity.
   *
   * @param entity T
   * @return string The text to display in representation of entity
   */
  acInputFormat(entity: T): string;

  /**
   * Return a string to populate an auto-complete list item a description of the given entity.
   *
   * @param entity T
   * @return string The text to display in representation of entity
   */
  acResultFormat(entity: T): string;
}

/**
 * An interface to be implemented by auto-complete (aka type-ahead) service providers to perform
 * the searching and formatting functionality required by auto-complete fields.
 */
export interface AutocompleteSearchDelegate<T> {
  /**
   * Use the stream of search terms `text$` to fetch a list of candidate entities for an auto-complete field.
   *
   * @param text$ Observable<string> Each emitted string represents a change in the search text entered by the user.
   * @return An Observable that emits a list of entities in response to changes in the `text$` stream.
   */
  acSearch(text$: Observable<string>): Observable<readonly T[]>;
}
