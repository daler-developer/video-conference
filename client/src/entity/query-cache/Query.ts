import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";
import type { IncomingMessageExtractPayload } from "@/websocket";

export type QueryStatus =
  | "idle"
  | "fetching"
  | "fetching-more"
  | "success"
  | "error";

export type QueryFn<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
  TPageParam extends Record<string, any> | null,
> = (options: { params: TParams; pageParam: TPageParam }) => Promise<TData>;

export type QueryOptions<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
  TPageParam extends Record<string, any> | null,
> = {
  name: string;
  params: Record<string, any>;
  fn: QueryFn<TParams, TData, TPageParam>;
  schema: Schema;
  isInfinite: boolean;
  initialPageParam?: TPageParam;
  getNextPageParam?: (options: {
    lastPageParam: TPageParam;
  }) => NonNullable<TPageParam>;
  merge: (options: { existingData: TData; incomingData: TData }) => TData;
};

export type QueryState<TPageParam extends Record<string, any> | null> = {
  status: QueryStatus;
  normalizedData: any;
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
      merge,
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
      merge,
    };
    this.#consumersCount = 0;
    this.#state = this.getInitialState();
    this.bindMethods();
  }

  private getInitialState(): QueryState<TPageParam> {
    return {
      status: "idle",
      normalizedData: null,
      lastPageParam: this.#options.initialPageParam,
    };
  }

  private bindMethods() {
    this.fetchMore = this.fetchMore.bind(this);
    this.reset = this.reset.bind(this);
    this.getIsIdle = this.getIsIdle.bind(this);
    this.getIsFetching = this.getIsFetching.bind(this);
    this.getIsFetchingMore = this.getIsFetchingMore.bind(this);
    this.getIsSuccess = this.getIsSuccess.bind(this);
    this.getIsError = this.getIsError.bind(this);
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
    if (!this.#state.normalizedData) {
      return null;
    }

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
        status: "fetching-more",
      });

      const nextPageParam = this.#options.getNextPageParam!({
        lastPageParam: this.#state.lastPageParam!,
      });

      const data = await this.#options.fn({
        params: this.#options.params,
        pageParam: nextPageParam,
      });

      const mergedData = this.#options.merge({
        existingData: this.getData(),
        incomingData: data,
      });

      const { normalizedData } = this.#queryCache
        .getEntityManager()
        .normalizeAndSave(mergedData, this.#options.schema);

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

  getOptions() {
    return this.#options;
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

  getIsIdle() {
    return this.#state.status === "idle";
  }

  getIsFetching() {
    return this.#state.status === "fetching";
  }

  getIsFetchingMore() {
    return this.#state.status === "fetching-more";
  }

  getIsSuccess() {
    return this.#state.status === "success";
  }

  getIsError() {
    return this.#state.status === "error";
  }

  reset() {
    this.updateState(this.getInitialState());
  }
}
