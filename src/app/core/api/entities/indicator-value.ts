import { JsonObject, JsonProperty } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';
import { Indicator } from '@core/api/entities/indicator';

/**
 * IndicatorValue entity.
 */
@JsonObject('IndicatorValue')
export class IndicatorValue extends Entity {
  static PLURAL_NAME = 'values';

  @JsonProperty('id') // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('value', Number)
  value: number | string = undefined;

  @JsonProperty('date', String)
  date: string = undefined;

  @JsonProperty('sourceUrl', String)
  sourceUrl: string = undefined;

  @JsonProperty('indicator', Indicator, true) // Optional property
  indicator: Indicator = undefined;

  /** @override */
  toString(): string {
    return `Value: ${this.value}`;
  }
}
