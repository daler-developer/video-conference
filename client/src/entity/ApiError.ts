export class ApiError<
  TShape extends Record<string, object> = Record<string, object>,
> extends Error {
  type: keyof TShape;
  details: TShape[keyof TShape];

  constructor(message: string, type: keyof TShape, details: TShape[string]) {
    super(message);
    this.type = type;
    this.details = details;
  }

  public errorIs<K extends keyof TShape>(
    type: K,
  ): this is ApiError<TShape> & { type: K; details: TShape[K] } {
    return this.type === type;
  }
}
