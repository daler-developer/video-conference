import { type Schema, normalize, denormalize } from "normalizr";
import { Subscribable } from "./Subscribable.ts";
import { QueryCache } from "./QueryCache.ts";

export type QueryStatus = "idle" | "fetching" | "success" | "error";

export type QueryFn<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
> = (options: { params: TParams }) => Promise<TData>;

export type QueryOptions<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
> = {
  name: string;
  params: Record<string, any>;
  fn: QueryFn<TParams, TData>;
  schema: Schema;
};

export type QueryState<TData extends Record<string, any>> = {
  status: QueryStatus;
  data: TData | null;
};

type HashQueryOptions = {
  name: string;
  params: Record<string, any>;
};

type QueryNotifyEvent = {
  type: "state-updated";
};

type Listener = (event: QueryNotifyEvent) => void;

export class Query<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
> extends Subscribable<Listener> {
  #queryCache: QueryCache;
  private state: QueryState<TData>;
  public options: QueryOptions<TParams, TData>;
  private consumersCount: number;

  constructor(
    queryCache: QueryCache,
    { name, params, fn, schema }: QueryOptions<TParams, TData>,
  ) {
    super();
    this.#queryCache = queryCache;
    this.options = {
      name,
      params,
      fn,
      schema,
    };
    this.consumersCount = 0;
    this.state = {
      status: "idle",
      data: null,
    };
  }

  public setData(newDate: TData) {
    this.updateState({
      data: newDate,
    });
  }

  public getData() {
    const denormalized = denormalize(
      this.state.data,
      this.options.schema,
      this.#queryCache.entityManager.getAllEntities(),
    );
    return denormalized;
  }

  public updateData(newDate: TData) {
    this.updateState({
      data: newDate,
    });
  }

  private updateState(newState: Partial<QueryState<TData>>) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.notify({ type: "state-updated" });
  }

  public async triggerFetch() {
    this.updateState({
      status: "fetching",
    });

    try {
      const data = await this.options.fn({ params: this.options.params });

      const normalizedData = normalize(data, this.options.schema);

      this.updateState({
        status: "success",
        data: normalizedData,
      });
    } catch {
      this.updateState({
        status: "error",
        data: null,
      });
    }
  }

  public getConsumersCount() {
    return this.consumersCount;
  }

  public updateConsumersCount(updater: (prev: number) => number) {
    this.consumersCount = updater(this.consumersCount);
  }

  public static hashQuery({ name, params }: HashQueryOptions) {
    return `${name}|${JSON.stringify(params)}`;
  }

  public getState() {
    return this.state;
  }

  public getHash() {
    return Query.hashQuery({
      name: this.options.name,
      params: this.options.params,
    });
  }

  public notify(event: QueryNotifyEvent) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }

  public getStatus() {
    return this.state.status;
  }
}
