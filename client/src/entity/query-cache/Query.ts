import { type Schema } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";
import { type BaseQueryErrorMap, QueryError } from "@/entity/QueryError.ts";

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
  merge?: QueryMerge<TQueryData>;
  getPageParamsFromData?: (data: TQueryData) => TQueryPageParam[];
};

export type QueryState<TQueryErrorMap extends BaseQueryErrorMap> = {
  status: QueryStatus;
  fetchStatus: QueryFetchStatus;
  fetchMeta: QueryFetchMeta;
  normalizedData: any;
  error: QueryError<TQueryErrorMap> | null;
};

type BaseFetchOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryErrorMap extends BaseQueryErrorMap,
  TQueryPageParam extends BaseQueryPageParam,
> = {
  onFetch: (
    this: Query<TQueryParams, TQueryData, TQueryErrorMap, TQueryPageParam>,
  ) => Promise<TQueryData>;
  onFetchStart?: () => {
    newState?: Partial<Omit<QueryState<TQueryErrorMap>, "fetchStatus">>;
  };
  onFetchSuccess?: () => {
    newState?: Partial<
      Omit<QueryState<TQueryErrorMap>, "status" | "fetchStatus">
    >;
  };
  onFetchError?: () => {
    newState?: Partial<
      Omit<QueryState<TQueryErrorMap>, "status" | "fetchStatus" | "error">
    >;
  };
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

const sleep = () => new Promise((resolve) => setTimeout(resolve, 200));

export class Query<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryErrorMap extends BaseQueryErrorMap,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean = any,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  #state: QueryState<TQueryErrorMap>;
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
      getPageParamsFromData,
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
      getPageParamsFromData,
    };
    this.#fetchPromise = null;
    this.#observersCount = 0;
    this.#state = this.getInitialState();
    this.bindMethods();
    this.subscribeToEntitiesUpdate();
  }

  private subscribeToEntitiesUpdate() {
    this.#queryCache.getEntityManager().subscribe((event) => {
      if (event.type === "entity-updated") {
        this.listeners.forEach((listener) => {
          listener({ type: "state-updated" });
        });
      }
    });
  }

  private getInitialState(): QueryState<TQueryErrorMap> {
    return {
      normalizedData: null,
      status: "pending",
      error: null,
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
  }

  static hashQuery({ name, params }: HashQueryOptions) {
    return `${name}|${JSON.stringify(params)}`;
  }

  setData(data: TQueryData) {
    const { normalizedData } = this.#queryCache
      .getEntityManager()
      .normalizeAndSave(data, this.#options.schema);

    if (this.#options.isInfinite) {
      this.#pageParams = this.#options.getPageParamsFromData!(data);
    }

    this.updateState({
      normalizedData,
    });
  }

  updateState(newState: Partial<QueryState<TQueryErrorMap>>) {
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
    if (this.isSuccess) {
      return this.refetch();
    }

    return this.#baseFetch({
      onFetch() {
        this.#pageParams.push(this.#options.initialPageParam!);

        return this.#options.callback({
          params: this.#options.params,
          pageParam: this.options.isInfinite
            ? this.#options.initialPageParam!
            : undefined,
        });
      },
    });
  }

  async refetch() {
    return this.#baseFetch({
      async onFetch() {
        if (!this.#options.isInfinite) {
          return this.#options.callback({
            params: this.#options.params,
          });
        }

        if (this.isPending) {
          this.#pageParams.push(this.#options.initialPageParam!);

          return this.#options.callback({
            params: this.#options.params,
            pageParam: this.#options.initialPageParam!,
          });
        }

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

          res = this.#options.merge!({
            existingData: res,
            incomingData: data,
          });
        }

        return res!;
      },
    });
  }

  async fetchMore() {
    if (!this.#options.isInfinite) {
      throw new Error(`Query ${this.#options.name} is not infinite`);
    }

    if (this.isPending) {
      return this.fetch();
    }

    return this.#baseFetch({
      onFetchStart() {
        return {
          newState: {
            fetchMeta: {
              isFetchingMore: true,
            },
          },
        };
      },
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
          return this.#options.merge!({
            existingData: this.data,
            incomingData,
          });
        }

        return incomingData;
      },
      onFetchSuccess() {
        return {
          newState: {
            fetchMeta: {
              isFetchingMore: false,
            },
          },
        };
      },
      onFetchError() {
        return {
          newState: {
            fetchMeta: {
              isFetchingMore: false,
            },
          },
        };
      },
    });
  }

  async #baseFetch(
    options: BaseFetchOptions<
      TQueryParams,
      TQueryData,
      TQueryErrorMap,
      TQueryPageParam
    >,
  ) {
    try {
      if (this.isFetching) {
        return this.#fetchPromise!;
      }

      const onFetchStartResult = options.onFetchStart?.();

      this.updateState({
        fetchStatus: "fetching",
        ...(onFetchStartResult?.newState
          ? {
              ...onFetchStartResult?.newState,
            }
          : {}),
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

      const onFetchSuccessResult = options.onFetchSuccess?.();

      this.updateState({
        status: "success",
        fetchStatus: "idle",
        normalizedData,
        ...(onFetchSuccessResult?.newState
          ? {
              ...onFetchSuccessResult.newState,
            }
          : {}),
      });

      // console.log("state", this.#state);

      return data;
    } catch (error) {
      if (error instanceof QueryError) {
        const onFetchErrorResult = options.onFetchError?.();

        this.updateState({
          status: "error",
          fetchStatus: "idle",
          error,
          ...(onFetchErrorResult?.newState
            ? {
                ...onFetchErrorResult?.newState,
              }
            : {}),
        });
      } else {
        alert("test");
      }
      throw error;
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
    return this.isFetching && !this.isPending && !this.isFetchingMore;
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

  get error() {
    return this.#state.error;
  }

  get isFetchMoreError() {
    return this.isError && Boolean(this.data);
  }
}
