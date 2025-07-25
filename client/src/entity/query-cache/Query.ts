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
  private consumersCount: number;
  private name: string;
  private params: TParams;
  private fn: QueryFn<TParams, TData>;

  constructor({ name, params, fn }: QueryOptions<TParams, TData>) {
    this.name = name;
    this.params = params;
    this.fn = fn;
    this.consumersCount = 0;
    this.state = {
      status: "idle",
      data: null,
    };
  }

  private updateState(newState: Partial<QueryState<TData>>) {
    this.state = {
      ...this.state,
      ...newState,
    };
  }

  public async triggerFetch() {
    this.updateState({
      status: "fetching",
    });

    try {
      const data = await this.fn({ params: this.params });

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

  public getHash() {
    return Query.hashQuery({ name: this.name, params: this.params });
  }
}
