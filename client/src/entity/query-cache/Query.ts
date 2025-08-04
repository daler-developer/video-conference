import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";

export type QueryStatus = "idle" | "fetching" | "success" | "error";

export type QueryFn<
  TParams extends Record<string, unknown>,
  TData extends Record<string, unknown>,
> = (options: { params: TParams }) => Promise<TData>;

export type QueryOptions<
  TParams extends Record<string, unknown>,
  TData extends Record<string, unknown>,
> = {
  name: string;
  params: Record<string, unknown>;
  fn: QueryFn<TParams, TData>;
  schema: Schema;
};

export type QueryState = {
  status: QueryStatus;
  normalizedData: unknown;
};

type HashQueryOptions = {
  name: string;
  params: Record<string, unknown>;
};

type QueryNotifyEvent = {
  type: "state-updated";
};

type Listener = (event: QueryNotifyEvent) => void;

export class Query<
  TParams extends Record<string, unknown>,
  TData extends Record<string, unknown>,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  #state: QueryState;
  #options: QueryOptions<TParams, TData>;
  #consumersCount: number;

  constructor(
    queryCache: QueryCache,
    { name, params, fn, schema }: QueryOptions<TParams, TData>,
  ) {
    super();
    this.#queryCache = queryCache;
    this.#options = {
      name,
      params,
      fn,
      schema,
    };
    this.#consumersCount = 0;
    this.#state = {
      status: "idle",
      normalizedData: null,
    };
  }

  static hashQuery({ name, params }: HashQueryOptions) {
    return `${name}|${JSON.stringify(params)}`;
  }

  setData(data: TData) {
    const normalizedData = this.#queryCache
      .getEntityManager()
      .normalizeAndSave(data, this.#options.schema);

    this.updateState({
      normalizedData,
    });
  }

  getData() {
    return this.#queryCache
      .getEntityManager()
      .denormalizeData(this.#state.normalizedData, this.#options.schema);
  }

  updateState(newState: Partial<QueryState>) {
    this.#state = {
      ...this.#state,
      ...newState,
    };

    this.notify({ type: "state-updated" });
  }

  async triggerFetch() {
    this.updateState({
      status: "fetching",
    });

    try {
      const data = await this.#options.fn({ params: this.#options.params });

      const normalizedData = this.#queryCache
        .getEntityManager()
        .normalizeAndSave(data, this.#options.schema);

      this.updateState({
        status: "success",
        normalizedData,
      });
    } catch (e) {
      this.updateState({
        status: "error",
        normalizedData: null,
      });
      throw e;
    }
  }

  getConsumersCount() {
    return this.#consumersCount;
  }

  updateConsumersCount(updater: (prev: number) => number) {
    this.#consumersCount = updater(this.#consumersCount);
  }

  notify(event: QueryNotifyEvent) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }

  getStatus() {
    return this.#state.status;
  }
}
