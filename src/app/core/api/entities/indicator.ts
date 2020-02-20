import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';
import { Country } from '@core/api/entities/country';

/**
 * Indicator entity.
 */
@JsonObject('Indicator')
export class Indicator extends Entity {
  static PLURAL_NAME = 'indicators';

  @JsonProperty('id') // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('name', String)
  name: string = undefined;

  @JsonProperty('organization', String)
  organization: string = undefined;

  @JsonProperty('country', Any)
  country: Country = undefined;

  // protected getPluralName(): string {
  //   return Indicator.pluralName;
  // }

  /** @override */
  toString(): string {
    return this.name;
  }
}

