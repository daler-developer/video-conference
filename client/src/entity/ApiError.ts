export class ApiError<
  TShape extends Record<string, object> = Record<string, object>,
> {
  message: string;
  type: keyof TShape;
  details: TShape[keyof TShape];

  constructor(message: string, type: keyof TShape, details: TShape[string]) {
    this.message = message;
    this.type = type;
    this.details = details;
  }

  public is<K extends keyof TShape>(
    type: K,
  ): this is ApiError<TShape> & { type: K; details: TShape[K] } {
    return this.type === type;
  }
}
