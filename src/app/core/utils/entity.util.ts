import { default as slugifyJs } from 'slugify';
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

/**
 * Test whether the provided argument is a valid IRI string.
 *
 * @param iri
 * @return Return `true` if the IRI is valid; otherwise; false.
 */
export function isIri(iri: any): boolean {
  return (isString(iri) && iri.length > 0)
      && (/^\/[a-z]+\/[0-9]+$/.test(iri));
}

/**
 * Extract the numeric identifier portion of an IRI string.
 *
 * @param iri string
 * @return The numeric ID, if found, or null.
 */
export function idFromIri(iri: string): number | null {
  const id = parseInt(iri.substring(iri.lastIndexOf('/') + 1), 10);
  return isFinite(id) ? id : null;
}

/**
 * Convert a string into its slugified form. For example, the slug form of
 * `COVID19 can be fatal` is `covid19_can_be_fatal`.
 *
 *
 * @param text The string to slugify
 * @param separator An optional separator to override the default separator `_`
 * @return The slugified string
 */
export function slugify(text: string, separator: string = '_'): string {
  return slugifyJs(text, {
    replacement: separator,
    lower: true,
  });
}
