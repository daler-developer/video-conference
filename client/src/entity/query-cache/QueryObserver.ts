import {
  type BaseQueryData,
  type BaseQueryPageParam,
  type BaseQueryParams,
  type QueryOptions,
  type QueryStatus,
  type QueryFetchStatus,
  Query,
} from "./Query";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";

type QueryResult<
  TQueryData extends BaseQueryData,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
> = {
  data: TQueryData | null;
  status: QueryStatus;
  fetchStatus: QueryFetchStatus;
  isIdle: boolean;
  isFetching: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isRefetching: boolean;
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
  TQueryObserverIsLazy extends boolean,
  TQueryIsInfinite extends boolean,
> = QueryOptions<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite> &
  QueryObserverOptions<TQueryObserverIsLazy>;

export class QueryObserver<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
> {
  #query: Query<TQueryParams, TQueryData, TQueryPageParam>;
  #options: QueryObserverOptions<TQueryObserverIsLazy>;

  constructor(
    queryObserverConfig: QueryObserverConfig<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryObserverIsLazy,
      TQueryIsInfinite
    >,
  ) {
    this.#options = {
      isLazy: queryObserverConfig.isLazy,
    };
    const existingQuery = queryCache
      .getQueryRepository()
      .get<TQueryParams, TQueryData, TQueryPageParam>({
        name: queryObserverConfig.name,
        params: queryObserverConfig.params,
      });

    if (existingQuery) {
      existingQuery.observersCount++;
      this.#query = existingQuery;
      return;
    }

    const newQuery = queryCache
      .getQueryRepository()
      .add<TQueryParams, TQueryData, TQueryPageParam>(queryObserverConfig);
    if (!queryObserverConfig.isLazy) {
      void newQuery.triggerFetch();
    }
    newQuery.observersCount++;
    this.#query = newQuery;
  }

  destroy() {
    this.#query.observersCount--;

    if (this.#query.observersCount === 0) {
      queryCache.getQueryRepository().delete({
        name: this.#query.options.name,
        params: this.#query.options.params,
      });
    }
  }

  createResult() {
    const result = {} as QueryResult<
      TQueryData,
      TQueryIsInfinite,
      TQueryObserverIsLazy
    >;

    result.data = this.query.data;
    result.status = this.query.status;
    result.isIdle = this.query.isIdle;
    result.isFetching = this.query.isFetching;
    result.isPending = this.query.isPending;
    result.isSuccess = this.query.isSuccess;
    result.isError = this.query.isError;
    result.isRefetching = this.query.isRefetching;
    result.isLoading = this.query.isLoading;

    if (this.query.options.isInfinite) {
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).fetchMore = this.query.fetchMore;
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).isFetchingMore = this.query.isFetchingMore;
    }

    if (this.#options.isLazy) {
      (result as QueryResult<TQueryData, TQueryIsInfinite, true>).fetch =
        this.query.triggerFetch;
    }

    return result;
  }

  get query() {
    return this.#query;
  }
}
