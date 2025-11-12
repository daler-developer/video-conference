import { ApplicationContext } from './ApplicationContext';

export abstract class UseCase<TRequest, TResult> {
  abstract execute(request: TRequest, ctx: ApplicationContext): Promise<TResult>;
}
