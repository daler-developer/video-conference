import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";

export type QueryStatus =
  | "idle"
  | "fetching"
  | "fetching-more"
  | "success"
  | "error";

export type BaseQueryParams = Record<string, any>;

export type BaseQueryData = Record<string, any>;

export type BaseQueryPageParam = Record<string, any> | null;

export type QueryCallback<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = (options: {
  params: TQueryParams;
  pageParam: TQueryPageParam;
}) => Promise<TQueryData>;

export type QueryMerge<TQueryData extends BaseQueryData> = (options: {
  existingData: TQueryData;
  incomingData: TQueryData;
}) => TQueryData;

export type QueryGetNextPageParam<TQueryPageParam extends BaseQueryPageParam> =
  (options: { lastPageParam: TQueryPageParam }) => NonNullable<TQueryPageParam>;

export type QueryOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
> = {
  name: string;
  params: TQueryParams;
  callback: QueryCallback<TQueryParams, TQueryData, TQueryPageParam>;
  schema: Schema;
  isInfinite: TQueryIsInfinite;
  initialPageParam?: TQueryPageParam;
  getNextPageParam?: QueryGetNextPageParam<TQueryPageParam>;
  merge: QueryMerge<TQueryData>;
};

export type QueryState<TQueryPageParam extends BaseQueryPageParam> = {
  status: QueryStatus;
  normalizedData: any;
  lastPageParam?: TQueryPageParam;
};

type HashQueryOptions = {
  name: string;
  params: unknown;
};

type BaseQueryNotifyEvent<TType extends string> = {
  type: TType;
};

type QueryNotifyEventStateUpdated = BaseQueryNotifyEvent<"state-updated">;

type QueryNotifyEvent = QueryNotifyEventStateUpdated;

type Listener = (event: QueryNotifyEvent) => void;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

export class Query<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  #state: QueryState<TQueryPageParam>;
  #options: QueryOptions<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryIsInfinite
  >;
  #observersCount: number;

  constructor(
    queryCache: QueryCache,
    {
      name,
      params,
      callback,
      schema,
      isInfinite,
      initialPageParam,
      getNextPageParam,
      merge,
    }: QueryOptions<
      TQueryParams,
      TQueryData,
      TQueryPageParam,
      TQueryIsInfinite
    >,
  ) {
    super();
    this.#queryCache = queryCache;
    this.#options = {
      name,
      params,
      callback,
      schema,
      isInfinite,
      initialPageParam,
      getNextPageParam,
      merge,
    };
    this.#observersCount = 0;
    this.#state = this.getInitialState();
    this.bindMethods();
  }

  private getInitialState(): QueryState<TQueryPageParam> {
    return {
      status: "idle",
      normalizedData: null,
      lastPageParam: this.#options.initialPageParam,
    };
  }

  private bindMethods() {
    this.triggerFetch = this.triggerFetch.bind(this);
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

  setData(data: TQueryData) {
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
      .denormalizeData<TQueryData>(
        this.#state.normalizedData,
        this.#options.schema,
      );
  }

  updateState(newState: Partial<QueryState<TQueryPageParam>>) {
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

    await sleep();

    try {
      const data = await this.#options.callback({
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
    if (!this.#options.isInfinite) {
      throw new Error(`Query ${this.#options.name} is not infinite`);
    }

    try {
      this.updateState({
        status: "fetching-more",
      });

      await sleep();

      const nextPageParam = this.#options.getNextPageParam!({
        lastPageParam: this.#state.lastPageParam!,
      });

      const data = await this.#options.callback({
        params: this.#options.params,
        pageParam: nextPageParam,
      });

      const mergedData = this.#options.merge({
        existingData: this.getData()!,
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

  getOptions() {
    return this.#options;
  }

  updateObserversCount(updater: (prev: number) => number) {
    this.#observersCount = updater(this.#observersCount);
  }

  getObserversCount() {
    return this.#observersCount;
  }

  private notify(event: QueryNotifyEvent) {
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
