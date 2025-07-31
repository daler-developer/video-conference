import { type QueryOptions } from "./Query";
import { QueryRepository } from "./QueryRepository";
import { Subscribable } from "./Subscribable";
import { EntityManager } from "./entity-manager/EntityManager";

type QueryCacheNotifyEvent = {
  type: "query-state-updated";
};

type Listener = (event: QueryCacheNotifyEvent) => void;

export class QueryCache extends Subscribable<Listener> {
  #queryRepository = new QueryRepository(this);
  #entityManager = new EntityManager();

  getEntityManager(): EntityManager {
    return this.#entityManager;
  }

  public buildQueryOrUseExisting(queryOptions: QueryOptions<any, any>) {
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

  public destroyQuery({
    name,
    params,
  }: Pick<QueryOptions<any, any>, "name" | "params">) {
    const query = this.#queryRepository.get({ name, params });

    if (query) {
      query.updateConsumersCount((prev) => prev - 1);

      if (query.getConsumersCount() === 0) {
        this.#queryRepository.delete({ name, params });
      }
    }
  }

  public getQuery<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
  >({ name, params }: Pick<QueryOptions<TParams, TData>, "name" | "params">) {
    return this.#queryRepository.get<TParams, TData>({ name, params });
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
