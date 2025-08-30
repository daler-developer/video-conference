export abstract class UseCase<TRequest, TResult> {
  abstract execute(request: TRequest): Promise<TResult>;
}
