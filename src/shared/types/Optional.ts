export class Optional<T> {
  private value: T;

  constructor(value: T) {
    this.value = this.normalizeValue(value);
  }

  public isPresent(): boolean {
    return this.value !== null;
  }

  public isEmpty(): boolean {
    return this.value === null;
  }

  public get(): T {
    return this.value;
  }

  public static create<T>(value: T) {
    return new Optional<T>(value);
  }

  private normalizeValue(value: T) {
    const INVALID_TYPES_LIST = [undefined, null, 0] as T[];

    if (INVALID_TYPES_LIST.includes(value)) {
      return null as T;
    }

    if (Array.isArray(value) && !value.length) {
      return null as T;
    }

    if (this.isObject(value)) {
      return this.normalizeObject(value as T & object);
    }

    return value;
  }

  private isObject(object: unknown): boolean {
    return typeof object === 'object' && object !== null;
  }

  private normalizeObject(value: T & object) {
    if (!Object.keys(value).length) return null as T;

    const validateObjectProperties = Object.values(value).every(
      (value) => value === undefined || value === null,
    );

    if (validateObjectProperties) return null as T;

    return value;
  }
}
