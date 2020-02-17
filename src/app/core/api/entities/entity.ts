
/**
 * Base entity.
 */
export abstract class Entity {
  /** Unique identifier */
  id: number = undefined;

  /**
   * Get the name of the property that identifies the enitity type.
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

