import { UseCase } from './UseCase';
import { container } from '@/iocContainer';
import { ApplicationContext, createApplicationContext } from './ApplicationContext';

type SubclassOf<T> = abstract new (...args: any[]) => T;

class UseCaseRunner {
  private readonly ctx: ApplicationContext;

  constructor({ currentUserId }: { currentUserId?: number }) {
    this.ctx = createApplicationContext({ currentUserId });
  }

  async run<TRequest, TResult>(UseCaseClass: SubclassOf<UseCase<TRequest, TResult>>, request: TRequest) {
    const useCase = container.get(UseCaseClass);
    useCase.setContext(this.ctx);
    return useCase.execute(request);
  }
}

export { UseCaseRunner };
