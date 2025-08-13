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
      existingQuery.updateObserversCount((prev) => prev + 1);
      this.#query = existingQuery;
      return;
    }

    const newQuery = queryCache
      .getQueryRepository()
      .add<TQueryParams, TQueryData, TQueryPageParam>(queryObserverConfig);
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
    result.isIdle = this.getQuery().isIdle;
    result.isFetching = this.getQuery().isFetching;
    result.isPending = this.getQuery().isPending;
    result.isSuccess = this.getQuery().isSuccess;
    result.isError = this.getQuery().isError;
    result.isRefetching = this.getQuery().isRefetching;
    result.isLoading = this.getQuery().isLoading;

    if (this.getQuery().getOptions().isInfinite) {
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).fetchMore = this.getQuery().fetchMore;
      (
        result as QueryResult<TQueryData, true, TQueryObserverIsLazy>
      ).isFetchingMore = this.getQuery().isFetchingMore;
    }

    if (this.#options.isLazy) {
      (result as QueryResult<TQueryData, TQueryIsInfinite, true>).fetch =
        this.getQuery().triggerFetch;
    }

    return result;
  }
}
