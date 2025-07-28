import { Query, type QueryOptions } from "./Query";

class QueryRepository {
  private queries: Map<string, Query<any, any>> = new Map();

  add(queryOptions: QueryOptions<any, any>) {
    const queryHash = Query.hashQuery({
      name: queryOptions.name,
      params: queryOptions.params,
    });
    const newQuery = new Query(queryOptions);
    this.queries.set(queryHash, newQuery);
    return newQuery;
  }

  get<TParams extends Record<string, any>, TData extends Record<string, any>>({
    name,
    params,
  }: Pick<QueryOptions<TParams, TData>, "name" | "params">) {
    const queryHash = Query.hashQuery({ name, params });

    return this.queries.get(queryHash) as Query<TParams, TData>;
  }

  delete({ name, params }: Pick<QueryOptions<any, any>, "name" | "params">) {
    const queryHash = Query.hashQuery({ name, params });

    return this.queries.delete(queryHash);
  }
}

export const queryRepository = new QueryRepository();
