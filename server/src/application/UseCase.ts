import { ApplicationContext } from './ApplicationContext';
import { IRule } from '@/application/IRule';
import { ApplicationError } from '@/application/ApplicationError';

export abstract class UseCase<TRequest, TResult> {
  protected ctx: ApplicationContext = null!;

  abstract execute(request: TRequest): Promise<TResult>;

  setContext(ctx: ApplicationContext) {
    this.ctx = ctx;
  }

  async checkRule(ruleChecker: IRule) {
    ruleChecker.setContext(this.ctx);

    const error = await ruleChecker.check();

    if (error instanceof ApplicationError) {
      throw error;
    }
  }
}
