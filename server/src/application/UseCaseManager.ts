import { UseCase } from './UseCase';
import { container } from './iocContainer';

type SubclassOf<T> = abstract new (...args: any[]) => T;

class UseCaseManager {
  async run<TRequest, TResult>(UseCaseClass: SubclassOf<UseCase<TRequest, TResult>>, request: TRequest) {
    const useCase = container.get(UseCaseClass);
    return useCase.execute(request);
  }
}

export const useCaseManager = new UseCaseManager();
