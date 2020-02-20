
/**
 * Base entity.
 */
export abstract class Entity {
  static PLURAL_NAME: string;

  /** Unique identifier */
  id: number = undefined;

  getPluralName(): string {
    return (<typeof Entity> this.constructor).PLURAL_NAME;
  }

  /**
   * Get the name of the property that identifies the entity type.
   *
   * @return string
   */
  getIdentifierProperty(): string {
    return 'id';
  }

  /**
   * Retrieve the value of the identifier property.
   *
   * @see getIdentifierProperty()
   * @return any
   */
  getIdentifierValue(): any {
    return this[this.getIdentifierProperty()];
  }

  /** @override */
  toString(): string {
    return String(this.id);
  }
}

