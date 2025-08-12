import {
  type BaseQueryData,
  type BaseQueryPageParam,
  type BaseQueryParams,
  type QueryOptions,
  Query,
  type QueryStatus,
} from "./Query";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";

type QueryResult<
  TQueryData extends BaseQueryData,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
> = {
  data: TQueryData | null;
  status: QueryStatus;
  isIdle: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
} & (TQueryIsInfinite extends true
  ? { fetchMore: () => Promise<void>; isFetchingMore: boolean }
  : {}) &
  (TQueryObserverIsLazy extends true ? { fetch: () => Promise<void> } : {});

export type QueryObserverOptions<TQueryObserverIsLazy extends boolean> = {
  isLazy: TQueryObserverIsLazy;
};

export type QueryObserverConfig<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
> = QueryOptions<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite> &
  QueryObserverOptions<TQueryObserverIsLazy>;

export class QueryObserver<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
> {
  #query: Query<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>;
  #options: QueryObserverOptions<TQueryObserverIsLazy>;

  constructor(
    queryObserverConfig: QueryObserverConfig<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryIsInfinite,
      TQueryObserverIsLazy
    >,
  ) {
    this.#options = {
      isLazy: queryObserverConfig.isLazy,
    };
    const existingQuery = queryCache
      .getQueryRepository()
      .get<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>({
        name: queryObserverConfig.name,
        params: queryObserverConfig.params,
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
      >(queryObserverConfig);
    if (!queryObserverConfig.isLazy) {
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

  createResult() {
    const result = {} as QueryResult<
      TQueryData,
      TQueryIsInfinite,
      TQueryObserverIsLazy
    >;

    result.data = this.getQuery().getData();
    result.status = this.getQuery().getStatus();
    result.isIdle = this.getQuery().getIsIdle();
    result.isFetching = this.getQuery().getIsFetching();
    result.isSuccess = this.getQuery().getIsSuccess();
    result.isError = this.getQuery().getIsError();

    if (this.getQuery().getOptions().isInfinite) {
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).fetchMore = this.getQuery().fetchMore;
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).isFetchingMore = this.getQuery().getIsFetchingMore();
    }

    if (this.#options.isLazy) {
      (result as QueryResult<TQueryData, TQueryIsInfinite, true>).fetch =
        this.getQuery().triggerFetch;
    }

    return result;
  }
}
