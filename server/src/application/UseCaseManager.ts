import { UseCase } from './UseCase';
import { container } from '@/iocContainer';
import { ApplicationContext } from './ApplicationContext';

type SubclassOf<T> = abstract new (...args: any[]) => T;

class UseCaseManager {
  async run<TRequest, TResult>(
    UseCaseClass: SubclassOf<UseCase<TRequest, TResult>>,
    request: TRequest,
    ctx: ApplicationContext
  ) {
    const useCase = container.get(UseCaseClass);
    useCase.setContext(ctx);
    return useCase.execute(request);
  }
}

export const useCaseManager = new UseCaseManager();
