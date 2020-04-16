import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';

/**
 * Country entity.
 */
@JsonObject('Country')
export class Country extends Entity {
  static PLURAL_NAME: string = 'countries';

  @JsonProperty('id', Any, true) // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('code', String)
  code: string = undefined;

  @JsonProperty('name', String)
  name: string = undefined;

  /** @override */
  getIdentifierProperty(): string {
    return 'code';
  }

  /** @override */
  toString(): string {
    return this.name;
  }
}

