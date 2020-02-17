import { ResponseContext } from '@core/api/services/response-context';

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
