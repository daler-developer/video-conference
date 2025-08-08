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

  buildQueryOrUseExisting<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
    TPageParam extends Record<string, any> | null,
  >(
    queryOptions: QueryOptions<TParams, TData, TPageParam>,
  ): Query<TParams, TData, TPageParam> {
    const existingQuery = this.#queryRepository.get({
      name: queryOptions.name,
      params: queryOptions.params,
    });

    if (existingQuery) {
      existingQuery.updateConsumersCount((prev) => prev + 1);
      return existingQuery;
    }

    const newQuery = this.#queryRepository.add(queryOptions);
    void newQuery.triggerFetch();
    newQuery.updateConsumersCount((prev) => prev + 1);
    return newQuery;
  }

  handleQueryUnmount<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
    TPageParam extends Record<string, any> | null,
  >(query: Query<TParams, TData, TPageParam>) {
    if (query) {
      query.updateConsumersCount((prev) => prev - 1);

      if (query.getConsumersCount() === 0) {
        this.#queryRepository.delete({
          name: query.getOptions().name,
          params: query.getOptions().params,
        });
      }
    }
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
