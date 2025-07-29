import { Query, type QueryOptions } from "./Query";
import { QueryCache } from "./QueryCache";

export class QueryRepository {
  #queryCache: QueryCache;
  #queries: Map<string, Query<any, any>> = new Map();

  constructor(queryCache: QueryCache) {
    this.#queryCache = queryCache;
  }

  add(queryOptions: QueryOptions<any, any>) {
    const queryHash = Query.hashQuery({
      name: queryOptions.name,
      params: queryOptions.params,
    });
    const newQuery = new Query(this.#queryCache, queryOptions);
    this.#queries.set(queryHash, newQuery);
    return newQuery;
  }

  get<TParams extends Record<string, any>, TData extends Record<string, any>>({
    name,
    params,
  }: Pick<QueryOptions<TParams, TData>, "name" | "params">) {
    const queryHash = Query.hashQuery({ name, params });

    return this.#queries.get(queryHash) as Query<TParams, TData>;
  }

  delete({ name, params }: Pick<QueryOptions<any, any>, "name" | "params">) {
    const queryHash = Query.hashQuery({ name, params });

    return this.#queries.delete(queryHash);
  }
}
