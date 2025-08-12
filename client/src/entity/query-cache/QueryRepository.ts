import {
  type BaseQueryData,
  type BaseQueryPageParam,
  type BaseQueryParams,
  Query,
  type QueryOptions,
} from "./Query";
import { QueryCache } from "./QueryCache";

export class QueryRepository {
  #queryCache: QueryCache;
  #queries: Map<string, Query<any, any, any, any>> = new Map();

  constructor(queryCache: QueryCache) {
    this.#queryCache = queryCache;
  }

  add<
    TQueryParams extends BaseQueryParams,
    TQueryData extends BaseQueryData,
    TQueryPageParam extends BaseQueryPageParam,
    TQueryIsInfinite extends boolean,
  >(
    queryOptions: QueryOptions<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryIsInfinite
    >,
  ) {
    const queryHash = Query.hashQuery({
      name: queryOptions.name,
      params: queryOptions.params,
    });
    const newQuery = new Query(this.#queryCache, queryOptions);
    this.#queries.set(queryHash, newQuery);
    return newQuery;
  }

  get<
    TQueryParams extends BaseQueryParams,
    TQueryData extends BaseQueryData,
    TQueryPageParam extends BaseQueryPageParam,
    TQueryIsInfinite extends boolean,
  >({
    name,
    params,
  }: Pick<
    QueryOptions<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>,
    "name" | "params"
  >) {
    const queryHash = Query.hashQuery({ name, params });

    return this.#queries.get(queryHash) as Query<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryIsInfinite
    >;
  }

  delete<
    TQueryParams extends BaseQueryParams,
    TQueryData extends BaseQueryData,
    TQueryPageParam extends BaseQueryPageParam,
    TQueryIsInfinite extends boolean,
  >({
    name,
    params,
  }: Pick<
    QueryOptions<TQueryParams, TQueryData, TQueryPageParam, TQueryIsInfinite>,
    "name" | "params"
  >) {
    const queryHash = Query.hashQuery({ name, params });

    return this.#queries.delete(queryHash);
  }
}
