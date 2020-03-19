import { JsonObject, JsonProperty, Any } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';
import { Vocabulary } from '@core/api/entities/vocabulary';

/**
 * Term entity.
 */
@JsonObject('Term')
export class Term extends Entity {
  static PLURAL_NAME = 'terms';

  @JsonProperty('id', Any, true) // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('name', String)
  name: number | string = undefined;

  @JsonProperty('label', String)
  label: string = undefined;

  @JsonProperty('vocabulary', Any, true) // Optional property
  vocabulary: Vocabulary = undefined;

  /** @override */
  toString(): string {
    return `Term: ${this.name} (${this.label})`;
  }
}
