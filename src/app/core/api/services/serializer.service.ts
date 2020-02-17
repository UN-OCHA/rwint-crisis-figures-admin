import { Injectable } from '@angular/core';
import { JsonConvert, OperationMode } from 'json2typescript';
import { Serializer, EntityConstructor } from '@core/api/types';
import { ResponseContext } from '@core/api/services/response-context';

/**
 * A service for JSON serialization and deserialization.
 */
@Injectable()
export class SerializerService implements Serializer {

  protected jsonConvert: JsonConvert;

  constructor() {
    this.jsonConvert = new JsonConvert();
    this.jsonConvert.operationMode = OperationMode.ENABLE;
    this.jsonConvert.ignorePrimitiveChecks = true; // don't allow assigning number to string etc.
  }

  serialize<T>(entity: T): any {
    return this.jsonConvert.serialize(entity);
  }

  deserialize<T>(json: any, entityConstructor: EntityConstructor<T>): T | T[] {
    return this.jsonConvert.deserialize(json, entityConstructor);
  }

  deserializeContext<T>(entityConstructor: EntityConstructor<T>, context: ResponseContext<T>): ResponseContext<T> {
    context.body = this.jsonConvert.deserialize(context.body, entityConstructor);
    return context;
  }
}
