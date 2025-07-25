import { Query, type QueryOptions } from "./Query";

type InitQueryOptions = QueryOptions;

type DestroyQueryOptions = Pick<QueryOptions, "name" | "params">;

export class QueryCache {
  private queries: Map<string, Query<any, any>>;

  constructor() {
    this.queries = new Map();
  }

  public initQuery({ name, fn, params }: InitQueryOptions) {
    const queryHash = Query.hashQuery({ name, params });

    const existingQuery = this.queries.get(queryHash);

    if (existingQuery) {
      existingQuery.updateConsumersCount((prev) => prev + 1);
    }

    const newQuery = new Query({ name, params, fn });

    this.queries.set(queryHash, newQuery);

    void newQuery.triggerFetch();
    newQuery.updateConsumersCount((prev) => prev + 1);
  }

  public destroyQuery({ name, params }: DestroyQueryOptions) {
    const queryHash = Query.hashQuery({ name, params });

    const query = this.queries.get(queryHash);

    if (query) {
      query.updateConsumersCount((prev) => prev - 1);

      if (query.getConsumersCount() === 0) {
        this.queries.delete(queryHash);
      }
    }
  }
}
