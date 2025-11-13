import { ApplicationContext } from '@/application/ApplicationContext';
import { ApplicationError } from '@/application/ApplicationError';

export abstract class IRule {
  protected ctx: ApplicationContext = null!;

  setContext(ctx: ApplicationContext) {
    this.ctx = ctx;
  }

  protected error(type: string, message: string, details?: object) {
    return new ApplicationError(type, message, details);
  }

  abstract check(): Promise<ApplicationError | undefined>;
}
