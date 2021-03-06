import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';
import { Country } from '@core/api/entities/country';
import { IndicatorValue } from './indicator-value';
import { Term } from '@core/api/entities/term';

/**
 * Indicator entity.
 */
@JsonObject('Indicator')
export class Indicator extends Entity {
  static PLURAL_NAME = 'indicators';

  @JsonProperty('id', Any, true) // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('name', String)
  name: string = undefined;

  @JsonProperty('organization', String)
  organization: string = undefined;

  @JsonProperty('weight', Number)
  weight: number = 0;

  @JsonProperty('country', Any)
  country: Country = undefined;

  @JsonProperty('values', Any, true)
  values: IndicatorValue[] = undefined;

  @JsonProperty('terms', Any, true)
  terms: Term[] = [];

  /** @override */
  toString(): string {
    return this.name;
  }
}

