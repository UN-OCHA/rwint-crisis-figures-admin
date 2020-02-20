import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import { EntityConstructor } from '@core/api/types';
import { Entity } from '@core/api/entities/entity';

/**
 * A static method that generates the IRI of an entity given its plural name and identifier value.
 *
 * @param target string | Entity | EntityConstructor<Entity> | Object
 * @param identifierValue
 * @return string
 * @throws An error is thrown if `target` does not match any of the valid types.
 */
export function generateIri<T extends Entity = Entity>(
  target: string | Entity | EntityConstructor<T> | Object,
  identifierValue?: number | string): string {

  let pluralName = null;

  try {
    if (isString(target) && isValidEntityId(identifierValue)) {
      pluralName = target;
    } else if (target instanceof Entity) {
      pluralName = target.getPluralName();
      identifierValue = identifierValue || target.getIdentifierValue();
    } else if (target && isValidEntityId(identifierValue)) {
      pluralName = (new (target as EntityConstructor<T>)).getPluralName();
    } else {
      throw new Error(`Possible invalid argument (${target}). Please provide a string or Entity type as target.`);
    }
  } catch (e) {
    throw new Error(`Unable to generate IRI for target (${target}).`);
  }

  return `/${pluralName}/${identifierValue}`;
}

/**
 * Validate whether the given `identifier` is a valid Entity ID.
 *
 * Note that this has nothing to do with IRIs. Only non-empty strings and numbers
 * are considered valid identifiers.
 *
 * @param identifier
 * @return Return `true` if the identifier is valid; otherwise; false.
 */
export function isValidEntityId(identifier: any): boolean {
  return (isString(identifier) && identifier.length > 0)
      || (isNumber(identifier) && identifier > 0);
}
