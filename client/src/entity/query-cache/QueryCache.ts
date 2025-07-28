import { type QueryOptions } from "./Query";
import { queryRepository } from "./QueryRepository";

class QueryCache {
  public initQuery(queryOptions: QueryOptions<any, any>) {
    const existingQuery = queryRepository.get({
      name: queryOptions.name,
      params: queryOptions.params,
    });

    if (existingQuery) {
      existingQuery.updateConsumersCount((prev) => prev + 1);
      return;
    }

    const newQuery = queryRepository.add(queryOptions);
    void newQuery.triggerFetch();
    newQuery.updateConsumersCount((prev) => prev + 1);
  }

  public destroyQuery({
    name,
    params,
  }: Pick<QueryOptions<any, any>, "name" | "params">) {
    const query = queryRepository.get({ name, params });

    if (query) {
      query.updateConsumersCount((prev) => prev - 1);

      if (query.getConsumersCount() === 0) {
        queryRepository.delete({ name, params });
      }
    }
  }

  public getQueryState<
    TParams extends Record<string, any>,
    TData extends Record<string, any>,
  >({ name, params }: Pick<QueryOptions<TParams, TData>, "name" | "params">) {
    const query = queryRepository.get<TParams, TData>({ name, params });

    if (query) {
      return query.getState();
    } else {
      // throw new Error("test");
    }
  }

  public subscribe(
    { name, params }: Pick<QueryOptions<any, any>, "name" | "params">,
    callback: () => void,
  ) {
    const query = queryRepository.get({ name, params });

    if (query) {
      return query.subscribe(callback);
    }

    throw new Error("test");
  }
}

export const queryCache = new QueryCache();
