import {
  type BaseQueryData,
  type BaseQueryPageParam,
  type BaseQueryParams,
  type QueryOptions,
  Query,
} from "./Query";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";

export type QueryObserverOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = QueryOptions<TQueryParams, TQueryData, TQueryPageParam> & {
  isLazy: boolean;
};

export class QueryObserver<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> {
  #query: Query<TQueryParams, TQueryData, TQueryPageParam>;

  constructor(
    queryObserverOptions: QueryObserverOptions<
      TQueryParams,
      TQueryData,
      TQueryPageParam
    >,
  ) {
    const existingQuery = queryCache
      .getQueryRepository()
      .get<TQueryParams, TQueryData, TQueryPageParam>({
        name: queryObserverOptions.name,
        params: queryObserverOptions.params,
      });

    if (existingQuery) {
      existingQuery.updateObserversCount((prev) => prev + 1);
      this.#query = existingQuery;
      return;
    }

    const newQuery = queryCache
      .getQueryRepository()
      .add<TQueryParams, TQueryData, TQueryPageParam>(queryObserverOptions);
    if (!queryObserverOptions.isLazy) {
      void newQuery.triggerFetch();
    }
    newQuery.updateObserversCount((prev) => prev + 1);
    this.#query = newQuery;
  }

  getQuery() {
    return this.#query;
  }

  destroy() {
    this.#query.updateObserversCount((prev) => prev - 1);

    if (this.#query.getConsumersCount() === 0) {
      queryCache.getQueryRepository().delete({
        name: this.#query.getOptions().name,
        params: this.#query.getOptions().params,
      });
    }
  }
}
