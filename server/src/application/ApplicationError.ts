export class ApplicationError extends Error {
  constructor(
    public type: string,
    message: string,
    public details?: object
  ) {
    super(message);
  }
}
