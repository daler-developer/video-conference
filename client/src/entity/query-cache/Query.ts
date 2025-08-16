import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";

export type QueryStatus = "pending" | "success" | "error";

export type QueryFetchStatus = "idle" | "fetching";

export type QueryFetchMeta = {
  isFetchingMore: boolean;
};

export type BaseQueryParams = Record<string, any>;

export type BaseQueryData = Record<string, any>;

export type BaseQueryPageParam = Record<string, any> | null;

export type QueryCallback<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = (options: {
  params: TQueryParams;
  pageParam?: TQueryPageParam;
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
  TQueryIsInfinite extends boolean = any,
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

export type QueryState = {
  status: QueryStatus;
  fetchStatus: QueryFetchStatus;
  fetchMeta: QueryFetchMeta;
  normalizedData: any;
};

type BaseFetchOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = {
  onFetch: (
    this: Query<TQueryParams, TQueryData, TQueryPageParam>,
  ) => Promise<TQueryData>;
  fetchMeta?: QueryFetchMeta;
  onSuccess?: () => void;
  onError?: () => void;
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

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1500));

export class Query<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean = any,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  #state: QueryState;
  #options: QueryOptions<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryIsInfinite
  >;
  #observersCount: number;
  #fetchPromise: Promise<TQueryData> | null;
  #pageParams: TQueryPageParam[];

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
    this.#pageParams = [];
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
    this.#fetchPromise = null;
    this.#observersCount = 0;
    this.#state = this.getInitialState();
    this.bindMethods();
  }

  private getInitialState(): QueryState {
    return {
      normalizedData: null,
      status: "pending",
      fetchStatus: "idle",
      fetchMeta: {
        isFetchingMore: false,
      },
    };
  }

  private bindMethods() {
    this.fetch = this.fetch.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
    this.reset = this.reset.bind(this);
    this.refetch = this.refetch.bind(this);
    // this.getIsIdle = this.getIsIdle.bind(this);
    // this.getIsFetching = this.getIsFetching.bind(this);
    // this.getIsSuccess = this.getIsSuccess.bind(this);
    // this.getIsError = this.getIsError.bind(this);
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

  updateState(newState: Partial<QueryState>) {
    this.#state = {
      ...this.#state,
      ...newState,
      fetchMeta: {
        ...this.#state.fetchMeta,
        ...newState.fetchMeta,
      },
    };

    this.notify({ type: "state-updated" });
  }

  async fetch() {
    if (this.#options.isInfinite) {
      return this.#baseFetch({
        onFetch() {
          this.#pageParams.push(this.#options.initialPageParam!);

          return this.#options.callback({
            params: this.#options.params,
            pageParam: this.#options.initialPageParam!,
          });
        },
      });
    } else {
      return this.#baseFetch({
        onFetch() {
          return this.#options.callback({
            params: this.#options.params,
          });
        },
      });
    }
  }

  async refetch() {
    if (this.#options.isInfinite) {
      return this.#baseFetch({
        async onFetch() {
          let res: TQueryData | null = null;

          for (const pageParam of this.#pageParams) {
            const data = await this.#options.callback({
              params: this.#options.params,
              pageParam,
            });

            if (!res) {
              res = data;
              continue;
            }

            res = this.#options.merge({
              existingData: res,
              incomingData: data,
            });
          }

          return res!;
        },
      });
    } else {
      return this.#baseFetch({
        async onFetch() {
          return this.#options.callback({
            params: this.#options.params,
          });
        },
      });
    }
  }

  async fetchMore() {
    if (!this.#options.isInfinite) {
      throw new Error(`Query ${this.#options.name} is not infinite`);
    }

    return this.#baseFetch({
      async onFetch() {
        const nextPageParam = this.#options.getNextPageParam!({
          lastPageParam: this.#pageParams[this.#pageParams.length - 1],
        });

        const incomingData = await this.#options.callback({
          params: this.#options.params,
          pageParam: nextPageParam,
        });

        this.#pageParams.push(nextPageParam);

        if (this.data) {
          return this.#options.merge({
            existingData: this.data,
            incomingData,
          });
        }

        return incomingData;
      },
      fetchMeta: {
        isFetchingMore: true,
      },
    });

    // try {
    //   this.updateState({
    //     fetchStatus: "fetching",
    //     fetchMeta: {
    //       isFetchingMore: true,
    //     },
    //   });
    //
    //   await sleep();
    //
    //   const nextPageParam = this.#options.getNextPageParam!({
    //     lastPageParam: this.#state.lastPageParam!,
    //   });
    //
    //   const data = await this.#options.callback({
    //     params: this.#options.params,
    //     pageParam: nextPageParam,
    //   });
    //
    //   const mergedData = this.#options.merge({
    //     existingData: this.data!,
    //     incomingData: data,
    //   });
    //
    //   const { normalizedData } = this.#queryCache
    //     .getEntityManager()
    //     .normalizeAndSave(mergedData, this.#options.schema);
    //
    //   this.updateState({
    //     fetchStatus: "idle",
    //     status: "success",
    //     lastPageParam: nextPageParam,
    //     normalizedData,
    //     fetchMeta: {
    //       isFetchingMore: false,
    //     },
    //   });
    // } catch (e) {
    //   this.updateState({
    //     fetchStatus: "idle",
    //     status: "error",
    //     normalizedData: null,
    //     fetchMeta: {
    //       isFetchingMore: false,
    //     },
    //   });
    //   throw e;
    // }
  }

  async #baseFetch(
    options: BaseFetchOptions<TQueryParams, TQueryData, TQueryPageParam>,
  ) {
    const prevFetchMeta = this.#state.fetchMeta;

    try {
      if (this.isFetching) {
        return this.#fetchPromise!;
      }

      this.updateState({
        fetchStatus: "fetching",
        fetchMeta: options.fetchMeta || this.#state.fetchMeta,
      });

      await sleep();

      const fetchPromise = options.onFetch.bind(this)();

      this.#fetchPromise = fetchPromise;

      const data = await fetchPromise;

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
        fetchStatus: "idle",
        normalizedData,
        fetchMeta: prevFetchMeta,
      });

      options.onSuccess?.();

      return data;
    } catch (e) {
      this.updateState({
        status: "error",
        fetchStatus: "idle",
        normalizedData: null,
        fetchMeta: prevFetchMeta,
      });
      options.onError?.();
      throw e;
    } finally {
      this.#fetchPromise = null;
    }
  }

  reset() {
    this.updateState(this.getInitialState());
  }

  private notify(event: QueryNotifyEvent) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }

  get observersCount() {
    return this.#observersCount;
  }

  set observersCount(value: number) {
    this.#observersCount = value;
  }

  get status() {
    return this.#state.status;
  }

  get data() {
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

  get options() {
    return this.#options;
  }

  get isLoading() {
    return this.isFetching && this.isPending;
  }

  get isRefetching() {
    return this.isFetching && !this.isPending;
  }

  get isPending() {
    return this.#state.status === "pending";
  }

  get isSuccess() {
    return this.#state.status === "success";
  }

  get isError() {
    return this.#state.status === "error";
  }

  get isIdle() {
    return this.#state.fetchStatus === "idle";
  }

  get isFetching() {
    return this.#state.fetchStatus === "fetching";
  }

  get isFetchingMore() {
    return this.isFetching && this.#state.fetchMeta.isFetchingMore;
  }
}
