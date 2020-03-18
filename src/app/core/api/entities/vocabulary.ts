import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { Entity } from '@core/api/entities/entity';
import { Term } from './term';

/**
 * Vocabulary entity.
 */
@JsonObject('Vocabulary')
export class Vocabulary extends Entity {
  static PLURAL_NAME = 'vocabularies';

  @JsonProperty('id', Any, true) // Type can be ignored or set to `Any` for optional properties.
  id: number = undefined;

  @JsonProperty('name', String)
  name: string = undefined;

  @JsonProperty('label', String)
  label: string = undefined;

  @JsonProperty('terms', Any, true)
  terms: Term[] = undefined;

  /** @override */
  toString(): string {
    return `Vocabulary: ${this.name} (${this.label})`;
  }
}

