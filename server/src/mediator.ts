import { Container } from 'inversify';
import { Class, Mediator, Resolver } from 'mediatr-ts';

const container = new Container();

class InversifyResolver implements Resolver {
  resolve<T>(type: Class<T>): T {
    return container.get(type);
  }

  add<T>(type: Class<T>): void {
    container.bind(type).toSelf();
  }
}

const resolver = new InversifyResolver();

export const mediator = new Mediator({
  resolver,
});
