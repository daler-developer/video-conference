import { type QueryOptions, Query } from "./Query";
import { QueryRepository } from "./QueryRepository";
import { Subscribable } from "./Subscribable";
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
}

export const queryCache = new QueryCache();
