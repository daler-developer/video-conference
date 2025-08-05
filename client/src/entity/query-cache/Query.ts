import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";

export type QueryStatus = "idle" | "fetching" | "success" | "error";

export type QueryFn<
  TParams extends Record<string, unknown>,
  TData extends Record<string, unknown>,
  TPageParam extends Record<string, unknown> | null,
> = (options: { params: TParams; pageParam: TPageParam }) => Promise<TData>;

export type QueryOptions<
  TParams extends Record<string, unknown>,
  TData extends Record<string, unknown>,
  TPageParam extends Record<string, unknown> | null,
> = {
  name: string;
  params: Record<string, unknown>;
  fn: QueryFn<TParams, TData, TPageParam>;
  schema: Schema;
  isInfinite: boolean;
  initialPageParam?: TPageParam;
  getNextPageParam?: (options: {
    lastPageParam: TPageParam;
  }) => NonNullable<TPageParam>;
};

export type QueryState<TPageParam extends Record<string, unknown> | null> = {
  status: QueryStatus;
  normalizedData: unknown;
  lastPageParam?: TPageParam;
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
  TPageParam extends Record<string, unknown> | null = null,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  #state: QueryState<TPageParam>;
  #options: QueryOptions<TParams, TData, TPageParam>;
  #consumersCount: number;

  constructor(
    queryCache: QueryCache,
    {
      name,
      params,
      fn,
      schema,
      isInfinite,
      initialPageParam,
      getNextPageParam,
    }: QueryOptions<TParams, TData, TPageParam>,
  ) {
    super();
    this.#queryCache = queryCache;
    this.#options = {
      name,
      params,
      fn,
      schema,
      isInfinite,
      initialPageParam,
      getNextPageParam,
    };
    this.#consumersCount = 0;
    this.#state = {
      status: "idle",
      normalizedData: null,
      lastPageParam: this.#options.initialPageParam,
    };
  }

  static hashQuery({ name, params }: HashQueryOptions) {
    return `${name}|${JSON.stringify(params)}`;
  }

  setData(data: TData) {
    const { normalizedData } = this.#queryCache
      .getEntityManager()
      .normalizeAndSave(data, this.#options.schema);

    this.updateState({
      normalizedData,
    });
  }

  getData() {
    return this.#queryCache
      .getEntityManager()
      .denormalizeData<TData>(this.#state.normalizedData, this.#options.schema);
  }

  updateState(newState: Partial<QueryState<TPageParam>>) {
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
      const data = await this.#options.fn({
        params: this.#options.params,
        pageParam: this.#options.initialPageParam!,
      });

      const { normalizedData } = this.#queryCache
        .getEntityManager()
        .normalizeAndSave(data, this.#options.schema);

      // this.#allEntities = allEntities;
      //
      // for (const entity of this.#allEntities) {
      //   entity.subscribe(() => {});
      // }

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

  async fetchMore() {
    try {
      this.updateState({
        status: "fetching",
      });

      const nextPageParam = this.#options.getNextPageParam!({
        lastPageParam: this.#state.lastPageParam!,
      });

      const data = await this.#options.fn({
        params: nextPageParam!,
        pageParam: this.#options.initialPageParam!,
      });

      const { normalizedData } = this.#queryCache
        .getEntityManager()
        .normalizeAndSave(data, this.#options.schema);

      this.updateState({
        status: "success",
        lastPageParam: nextPageParam,
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
