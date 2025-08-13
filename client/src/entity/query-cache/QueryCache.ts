import { QueryRepository } from "./QueryRepository";
import { EntityManager } from "./entity-manager/EntityManager";

export class QueryCache {
  #queryRepository = new QueryRepository(this);
  #entityManager = new EntityManager();

  getQueryRepository() {
    return this.#queryRepository;
  }

  getEntityManager(): EntityManager {
    return this.#entityManager;
  }
}

export const queryCache = new QueryCache();

// public getQueryState<
//   TParams extends Record<string, any>,
//   TData extends Record<string, any>,
// >({ name, params }: Pick<QueryOptions<TParams, TData>, "name" | "params">) {
//   const query = this.#queryRepository.get<TParams, TData>({ name, params });
//
//   if (query) {
//     return query.getState();
//   } else {
//     throw new Error("test");
//   }
// }

// public setQueryData<
//   TParams extends Record<string, any>,
//   TData extends Record<string, any>,
// >(
//   { name, params }: Pick<QueryOptions<TParams, TData>, "name" | "params">,
//   data: TData,
// ) {
//   const query = this.#queryRepository.get<TParams, TData>({ name, params });
//   query.updateData(data);
// }
