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
};

export type QueryState<TData extends Record<string, any>> = {
  status: QueryStatus;
  data: TData | null;
};

type HashQueryOptions = {
  name: string;
  params: Record<string, any>;
};

export class Query<
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
> {
  private state: QueryState<TData>;
  public options: QueryOptions<TParams, TData>;
  private consumersCount: number;
  private observers: Array<(state: QueryState<TData>) => void>;

  constructor({ name, params, fn }: QueryOptions<TParams, TData>) {
    this.options = {
      name,
      params,
      fn,
    };
    this.consumersCount = 0;
    this.state = {
      status: "idle",
      data: null,
    };
    this.observers = [];
  }

  private updateState(newState: Partial<QueryState<TData>>) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.observers.forEach((callback) => {
      callback(this.state);
    });
  }

  public async triggerFetch() {
    this.updateState({
      status: "fetching",
    });

    try {
      const data = await this.options.fn({ params: this.options.params });

      this.updateState({
        status: "success",
        data,
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

  public subscribe(callback: (state: QueryState<TData>) => void) {
    this.observers.push(callback);

    return () => {
      this.observers = this.observers.filter((c) => c !== callback);
    };
  }
}
