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
  TIsInfinite extends boolean,
> = QueryOptions<TQueryParams, TQueryData, TQueryPageParam, TIsInfinite> & {
  isLazy: boolean;
};

export class QueryObserver<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
> {
  #query: Query<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>;

  constructor(
    queryObserverOptions: QueryObserverOptions<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryIsInfinite
    >,
  ) {
    const existingQuery = queryCache
      .getQueryRepository()
      .get<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>({
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
      .add<
        TQueryParams,
        TQueryData,
        TQueryPageParam,
        TQueryIsInfinite
      >(queryObserverOptions);
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

    if (this.#query.getObserversCount() === 0) {
      queryCache.getQueryRepository().delete({
        name: this.#query.getOptions().name,
        params: this.#query.getOptions().params,
      });
    }
  }
}
